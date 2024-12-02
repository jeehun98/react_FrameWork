# 3. Computation Graph와 자동 미분 구현 내용

## 1. Computation Graph 개요

- Computation Graph는 연산과 데이터 흐름을 시각적으로 표현한 그래프로, **자동 미분**을 통해 모델 학습 시 그래디언트를 자동으로 계산할 수 있습니다.
- **자동 미분**은 미분 연산을 자동화하여, 모델의 매개변수에 대해 손실 함수의 그래디언트를 계산하는 기법입니다.
- `Node` 클래스는 이러한 Computation Graph의 각 노드를 나타내며, 연산, 그래디언트 계산, 역전파 등의 기능을 제공합니다.

## 2. 자동 미분의 원리

- **자동 미분 (Automatic Differentiation, Autodiff)**:
    - 자동 미분은 **연산 그래프**를 사용하여 함수의 모든 연산에 대해 그래디언트를 계산합니다.
    - `Node` 클래스에서 각 연산은 `operations` 맵에 정의되어 있으며, 각각의 연산에 대해 그래디언트를 계산하는 함수가 포함되어 있습니다.
    - **연산의 예시**:
        - `multiply`: 입력 값과 가중치를 곱한 후, 입력 값과 가중치에 대한 그래디언트를 계산합니다.
        - `exp`: 출력 값의 미분은 출력 값 자체입니다.

### 2.1. 연산 그래프의 예시

```
x1 ──> multiply ──> x2 ──> add ──> x3 ──> exp ──> output
```

- **Forward Propagation**: 입력 값이 왼쪽에서 오른쪽으로 흐르며 연산이 수행됩니다.
- **Backward Propagation**: 그래디언트 값이 오른쪽에서 왼쪽으로 전달되며, 자동 미분을 통해 각 노드의 그래디언트를 계산합니다.

## 3. `Node` 클래스에서 자동 미분 구현

- `Node` 클래스는 자동 미분을 수행하기 위해 다음과 같은 메서드들을 포함합니다:
    - **`calculate_gradient`**: 현재 노드의 연산에 따라 그래디언트를 계산합니다.
    - **`backpropagate`**: 현재 노드의 그래디언트를 계산하고, 부모 노드로 그래디언트를 전달합니다.
    - **`update_weights`**: 계산된 그래디언트를 사용하여 가중치를 업데이트합니다.

### 3.1. `calculate_gradient` 메서드

- 주어진 연산(`operation`)에 따라 그래디언트를 계산하며, `operations` 맵에서 정의된 함수를 호출합니다.
- **예시: `multiply` 연산의 그래디언트 계산**
    
    ```cpp
    ops["multiply"] = [](double input, double weight, double out, double upstream) {
        return std::make_pair(upstream * weight, upstream * input);
    };
    ```
    
    - **입력 값에 대한 그래디언트**: `upstream * weight`
    - **가중치에 대한 그래디언트**: `upstream * input`

### 3.2. `backpropagate` 메서드

- 자동 미분의 핵심인 **역전파**를 수행합니다.
- 그래디언트를 계산한 후, 이를 부모 노드로 전달하여 재귀적으로 그래프의 모든 노드에 대해 그래디언트를 계산합니다.
- **구현 예시**:
    
    ```cpp
    void backpropagate(double upstream_gradient = 1.0, std::unordered_set<Node*>* visited = nullptr) {
        if (!visited) {
            std::unordered_set<Node*> local_visited;
            backpropagate(upstream_gradient, &local_visited);
            return;
        }
        if (visited->find(this) != visited->end()) {
            return;
        }
        visited->insert(this);
    
        auto gradients = calculate_gradient(upstream_gradient);
        double grad_input = gradients.first;
        double grad_weight = gradients.second;
        grad_weight_total += grad_weight;
    
        for (auto& child : children) {
            child->backpropagate(grad_input, visited);
        }
    }
    ```
    
- **작동 방식**:
    - 현재 노드의 그래디언트를 계산하고, 부모 노드로 그래디언트를 전달합니다.
    - 방문한 노드는 다시 방문하지 않도록 `visited` 집합을 사용합니다.

## 4. 자동 미분의 예제 코드

```cpp
// 노드 생성
auto input_node = std::make_shared<Node>("multiply", 3.0, 0.5, 1.5, 0.0);
auto add_node = std::make_shared<Node>("add", 1.5, 1.0, 2.5, 0.0);

// 노드 간 연결
input_node->add_child(add_node);

// Forward Propagation
double output = add_node->output;

// Backward Propagation (자동 미분)
add_node->backpropagate();

// 가중치 업데이트
input_node->update_weights(0.01);

// 결과 출력
std::cout << "Updated Weight: " << input_node->get_weight() << std::endl;
```

## 5. 자동 미분 구현의 장점과 한계

- **장점**:
    - 모든 연산에 대해 자동으로 그래디언트를 계산할 수 있어, 복잡한 미분 계산을 수동으로 구현할 필요가 없습니다.
    - 연산 그래프의 구조를 사용하여 미분 계산이 효율적으로 이루어집니다.
- **한계**:
    - 메모리 사용량이 증가할 수 있습니다. 특히, 큰 모델에서는 그래프의 모든 노드와 연산을 저장해야 하기 때문에 메모리 관리가 중요합니다.
    - 순환 구조 (Cyclic Graph)를 지원하지 않으므로, 순환 참조 문제를 해결해야 합니다.

## 6. 최적화 및 개선 방안

- **Lazy Evaluation**:
    - 필요할 때만 연산을 수행하여 불필요한 계산을 줄일 수 있습니다.
- **Gradient Clipping**:
    - 그래디언트 폭발 문제를 방지하기 위해, 그래디언트 값이 일정 범위를 넘지 않도록 제한할 수 있습니다.
- **메모리 관리 개선**:
    - `std::weak_ptr`를 사용하여 순환 참조 문제를 방지하고, 메모리 누수를 줄일 수 있습니다.