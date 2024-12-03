# RNN 클래스

**Recurrent Neural Network (RNN)** 클래스는 시계열 데이터나 순차적인 데이터 처리를 위한 **순환 신경망 레이어**입니다. 입력 데이터의 **시간적 의존성**을 고려하여, 이전 시점의 출력을 현재 시점의 계산에 사용합니다. `RNN` 클래스는 다양한 가중치 초기화 방법과 활성화 함수를 지원하며, `Layer` 클래스를 상속받아 확장 구현되었습니다.

---

## **클래스 개요**

- **상속**: `RNN` 클래스는 `Layer` 클래스를 상속받아, 딥러닝 모델의 기본적인 순환 레이어로 사용됩니다.
- **주요 기능**:
    - **가중치 초기화**: 다양한 초기화 방법 (`he`, `xavier`, `zeros`, `ones`, `random_uniform`)을 지원합니다.
    - **활성화 함수 적용**: 다양한 활성화 함수 (`tanh`, `sigmoid` 등)를 사용할 수 있습니다.
    - **시간 순서 처리**: 입력 데이터의 시간적 흐름을 고려하여 순전파(Forward Propagation)를 수행합니다.
    - **Backpropagation Through Time (BPTT)**: 자동 미분을 통해 역전파(Backpropagation)를 수행하여, 그래디언트를 계산하고 가중치를 업데이트합니다.

---

## **주요 속성 (Attributes)**

- **`units`**:
    - RNN 레이어의 은닉 유닛(hidden unit)의 개수입니다. 출력 차원의 크기를 정의합니다.
- **`activation`**:
    - 은닉 상태를 계산할 때 사용하는 활성화 함수입니다. 기본값은 `'tanh'`입니다.
- **`recurrent_activation`**:
    - 순환 커널에서 은닉 상태를 계산할 때 사용하는 활성화 함수입니다. 기본값은 `'sigmoid'`입니다.
- **`use_bias`**:
    - 바이어스를 사용할지 여부를 결정하는 플래그입니다.
- **`state`**:
    - 현재 시점의 은닉 상태를 저장합니다. 순전파 시 업데이트됩니다.
- **`return_sequences`**:
    - `True`일 경우 모든 시점의 출력을 반환하고, `False`일 경우 마지막 시점의 출력만 반환합니다.
- **`node_list`**:
    - 계산 그래프에서 사용되는 노드들의 리스트입니다.

---

## **메서드 설명 (Methods)**

### **`__init__(self, units, activation='tanh', recurrent_activation='sigmoid', use_bias=True, input_shape=None, return_sequences=False, **kwargs)`**

- **설명**: 클래스 초기화 메서드로, 은닉 유닛 개수, 활성화 함수, 순환 활성화 함수, 바이어스 사용 여부 등을 설정합니다.
- **인자**:
    - `units`: 출력 유닛의 개수.
    - `activation`: 은닉 상태 계산에 사용할 활성화 함수 (`tanh`, `relu` 등).
    - `recurrent_activation`: 순환 커널에 사용할 활성화 함수 (`sigmoid` 등).
    - `use_bias`: 바이어스 사용 여부 (`True`/`False`).
    - `return_sequences`: 모든 시점의 출력 반환 여부 (`True`/`False`).
- **기본값**: 활성화 함수는 `'tanh'`, 순환 활성화 함수는 `'sigmoid'`, `use_bias`는 `True`입니다.

---

### **`build(self, input_shape)`**

- **설명**: RNN의 가중치와 바이어스를 초기화하고, 입력 형태를 설정합니다.
- **인자**:
    - `input_shape`: 입력 데이터의 형태 `(batch_size, timesteps, input_dim)`을 포함하는 튜플입니다.
- **동작**:
    - `initialize_weights()` 메서드를 호출하여 가중치(`weight`, `recurrent_weight`)와 바이어스를 초기화합니다.
    - 은닉 상태(`state`)를 `(batch_size, units)` 크기로 초기화합니다.

---

### **`call(self, inputs)`**

- **설명**: Forward 연산을 수행하는 메서드로, 입력 데이터를 시간 축(`timesteps`)에 따라 순차적으로 처리합니다.
- **인자**:
    - `inputs`: `(timesteps, input_dim)` 형태의 입력 데이터.
- **동작**:
    1. **시간 순서 처리**: 각 시점의 입력 데이터에 대해 은닉 상태를 업데이트합니다.
    2. **은닉 상태 계산**: 입력 데이터와 가중치, 이전 은닉 상태를 사용하여 새로운 은닉 상태를 계산합니다.
    3. **출력 결정**: `return_sequences` 옵션에 따라 모든 시점의 출력 또는 마지막 시점의 출력만 반환합니다.
- **반환값**: `(timesteps, units)` 또는 `(1, units)` 형태의 출력 데이터.

---

### **`backpropagate(self, upstream_gradient=1.0)`**

- **설명**: 역전파(Backpropagation)를 수행하여, 그래디언트를 계산하고 업데이트합니다.
- **인자**:
    - `upstream_gradient`: 상위 노드에서 전달된 그래디언트 값.
- **동작**:
    - `calculate_gradient()` 메서드를 사용하여 그래디언트를 계산합니다.
    - 부모 노드로 그래디언트를 전달하며, 재귀적으로 역전파를 수행합니다.

---

### **`update_weights(self, learning_rate)`**

- **설명**: 학습률(`learning_rate`)을 사용하여 가중치와 바이어스를 업데이트합니다.
- **동작**:
    - `grad_weight_total` 값을 사용하여 가중치를 업데이트한 후, 그래디언트 합산 값을 초기화합니다.
- **예시 코드**:
    
    ```cpp
    weight_value -= learning_rate * grad_weight_total;
    grad_weight_total = 0.0;
    ```
    

---

### **`get_config(self)`**

- **설명**: RNN 클래스의 구성 정보를 반환합니다.
- **반환값**: 구성 정보를 포함하는 딕셔너리.
- **구성 정보**:
    - `'units'`: 은닉 유닛의 개수.
    - `'activation'`: 활성화 함수 이름.
    - `'recurrent_activation'`: 순환 활성화 함수 이름.
    - `'use_bias'`: 바이어스 사용 여부.
    - `'return_sequences'`: 시퀀스 반환 여부.

---

### **`set_root_node(self)`**

- **설명**: 계산 그래프에서 모든 노드의 루트를 설정합니다.
- **동작**:
    - `node_list`를 통해 루트 노드를 설정하고, 중복 작업을 피합니다.

---

## **RNN 클래스의 특징**

- **Computation Graph 기반**:
    - `node_list`를 사용하여 각 연산에서 생성된 노드들을 그래프 구조로 관리합니다.
    - 이를 통해 자동 미분 및 그래디언트 계산이 용이해집니다.
- **다양한 활성화 함수 지원**:
    - 기본 활성화 함수로 `tanh`와 `sigmoid`를 사용하지만, 사용자 정의 활성화 함수도 가능합니다.
- **시퀀스 반환 옵션**:
    - `return_sequences=True`일 경우 모든 시점의 은닉 상태를 반환합니다.
    - `return_sequences=False`일 경우 마지막 시점의 은닉 상태만 반환합니다.

[RNN Class Code](RNN%20Class%20Code%2013ce8eae9629803c8003d0a9a0ffd0b7.md)