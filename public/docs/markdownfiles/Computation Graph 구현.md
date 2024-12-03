# 2. Computation Graph 구현 내용

## 1. Computation Graph 개요

- **Computation Graph**는 수학적 연산을 노드(Node)와 간선(Edge)으로 표현하는 데이터 구조입니다.
- 각 노드는 연산(`operation`), 입력 값(`input_value`), 가중치(`weight_value`), 출력 값(`output`)을 포함하며, 그래디언트 계산 및 역전파(backpropagation)를 통해 모델의 학습에 사용됩니다.
- 이 구현에서는 `Node` 클래스를 사용하여 Computation Graph를 구축하며, 그래프의 연산, 노드 간의 관계 설정, 역전파, 가중치 업데이트 등의 기능을 제공합니다.

## 2. Node 클래스 설계

- `Node` 클래스는 Computation Graph의 핵심 구성 요소로, 각 노드는 연산과 관련된 데이터를 저장하고 부모/자식 관계를 설정할 수 있습니다.
- **주요 속성**:
    - `operation`: 노드에서 수행할 연산 (`add`, `multiply`, `exp` 등).
    - `input_value`: 입력 값.
    - `weight_value`: 노드의 가중치 값.
    - `output`: 연산 결과 값.
    - `bias`: 바이어스 값.
    - `parents`: 부모 노드 리스트 (`std::weak_ptr`로 관리).
    - `children`: 자식 노드 리스트 (`std::shared_ptr`로 관리).
    - `grad_weight_total`: 가중치의 총 그래디언트 값.

### 클래스 다이어그램

```
Node
├── operation: std::string
├── input_value: double
├── weight_value: double
├── output: double
├── bias: double
├── grad_weight_total: double
├── parents: std::vector<std::weak_ptr<Node>>
├── children: std::vector<std::shared_ptr<Node>>
└── methods: add_parent, add_child, remove_parent, remove_child 
						 ,backpropagate, update_weights

```

## 3. 주요 메서드 설명

### 3.1. 부모/자식 노드 추가 및 제거 (`add_parent`, `add_child`, `remove_parent`, `remove_child`)

- **부모 노드 추가 (`add_parent`)**:
    - 부모 노드를 추가하며, 중복 추가를 방지하기 위해 체크합니다.
- **자식 노드 추가 (`add_child`)**:
    - 자식 노드를 추가하고, 자식 노드에서도 현재 노드를 부모로 추가합니다.
- **부모/자식 노드 제거**:
    - 부모 또는 자식 노드를 리스트에서 제거하여 그래프 구조를 수정할 수 있습니다.

### 3.2. 노드 업데이트 (`update`)

- 노드의 입력 값, 가중치 값, 출력 값, 바이어스를 업데이트합니다.
- 새로운 데이터에 따라 노드의 연산 결과를 업데이트할 때 사용합니다.

### 3.3. 그래디언트 계산 (`calculate_gradient`)

- 주어진 연산(`operation`)에 따라 그래디언트를 계산합니다.
- 다양한 연산(`add`, `multiply`, `exp` 등)에 대해 각각 정의된 그래디언트 계산 함수가 호출됩니다.
- **예시**:
    - `multiply` 연산의 그래디언트는 입력 값과 가중치를 곱한 결과로 계산됩니다:
        
        ```cpp
        ops["multiply"] = [](double input, double weight, double out, double upstream) {
            return std::make_pair(upstream * weight, upstream * input);
        };
        ```
        

### 3.4. 역전파 (`backpropagate`)

- 노드에서 그래디언트를 계산하고, 자식 노드로 전달하여 역전파를 수행합니다.
- 이미 방문한 노드는 다시 방문하지 않도록 `visited` 집합을 사용합니다.
- **작동 원리**:
    - 현재 노드에서 그래디언트를 계산하고, 자식 노드로 `grad_input` 값을 전달합니다.
    - 자식 노드에서는 재귀적으로 역전파가 수행됩니다.

### 3.5. 가중치 업데이트 (`update_weights`)

- 학습률(`learning_rate`)을 사용하여 노드의 가중치를 업데이트합니다.
- 업데이트 후, 그래디언트 합산 값(`grad_weight_total`)은 0으로 초기화됩니다.
- **예시 코드**:
    
    ```cpp
    weight_value -= learning_rate * grad_weight_total;
    ```
    

### 3.6. 트리 출력 (`print_tree`)

- Computation Graph의 구조를 트리 형태로 출력합니다.
- 순환 참조를 방지하기 위해 이미 방문한 노드는 "already visited"로 표시됩니다.
- **출력 예시**:
    
    ```
    Node: multiply, Weight: 0.5, Grad Total: 0.1, Output: 0.25
        Children:
            Node: add, Weight: 1.0, Grad Total: 0.05, Output: 1.25
                Leaf node
    ```
    

## 4. 지원되는 연산 목록

- 현재 `Node` 클래스에서 지원하는 연산 목록은 다음과 같습니다:
    - **기본 연산**: `add`, `subtract`, `multiply`, `divide`
    - **비선형 연산**: `exp`, `square`, `reciprocal`, `negate`
    - **Pooling 연산**: `max_pool`, `avg_pool`
    - **Bias 연산**: `bias`
    - **Flatten 연산**: `flatten` (입력을 그대로 전달)

### 사용 가능한 연산 확인 (`get_available_operations`)

- `get_available_operations()` 메서드를 통해 현재 지원되는 연산 목록을 확인할 수 있습니다:
    
    ```cpp
    std::string available_operations = node.get_available_operations();
    ```
    

## 5. Computation Graph의 예제 코드

```cpp
// 노드 생성
auto input_node = std::make_shared<Node>("multiply", 2.0, 0.5, 1.0, 0.0);
auto add_node = std::make_shared<Node>("add", 1.0, 1.0, 2.0, 0.0);

// 노드 간 연결
input_node->add_child(add_node);

// 역전파 수행
input_node->backpropagate();

// 가중치 업데이트
input_node->update_weights(0.01);

// 트리 구조 출력
input_node->print_tree(input_node);
```

## 6. 최적화 및 개선 사항

- **메모리 관리**:
    - `std::shared_ptr`와 `std::weak_ptr`을 사용하여 순환 참조 문제를 해결합니다.
- **Lazy Evaluation**:
    - 계산을 지연하여 필요할 때만 연산을 수행하는 방식을 고려할 수 있습니다.
- **Gradient Clipping**:
    - 그래디언트 폭발 문제를 방지하기 위해 그래디언트 클리핑 기능을 추가할 수 있습니다.

[Node Class code](Node%20Class%20code%2013ce8eae962980199804c0634b9abf37.md)