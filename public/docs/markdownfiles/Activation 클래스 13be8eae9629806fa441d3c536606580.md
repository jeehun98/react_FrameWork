# Activation 클래스

## 개요

`Activation` 클래스는 `Layer` 클래스를 상속받는 활성화 레이어로, 모델의 비선형성을 추가하기 위해 사용됩니다. `Activation` 레이어는 주어진 활성화 함수 (예: sigmoid, tanh, relu 등)를 사용하여 입력 데이터에 대해 연산을 수행하고, 그 결과를 반환합니다.

### 코드 구조

### 1. 클래스 정의

```python
from dev.layers.layer import Layer
from dev import activations
import numpy as np

class Activation(Layer):
```

`Activation` 클래스는 `Layer` 클래스를 상속받아 구현되었습니다. 이로 인해 부모 클래스인 `Layer`의 모든 속성과 메서드를 사용할 수 있습니다.

---

### 2. 초기화 메서드 (`__init__`)

```python
def __init__(self, activation, **kwargs):
    super().__init__(**kwargs)
    self.activation = activations.get(activation)
    self.node_list = []
    self.trainable = True
    self.layer_name = "activation"
```

- **`activation`**: 사용할 활성화 함수의 이름을 입력받습니다. `activations.get()` 메서드를 통해 해당 함수의 실제 구현을 가져옵니다.
- **`node_list`**: 계산 그래프에서 노드들을 저장하는 리스트입니다.
- **`trainable`**: 현재 레이어가 학습 가능한지를 나타내는 플래그입니다. 활성화 레이어는 학습 가능한 파라미터가 없으므로 보통 `True`로 설정되지만 실제로는 변경되지 않습니다.
- **`layer_name`**: 레이어의 이름을 지정합니다. 이는 디버깅 및 로그 확인 시 유용합니다.

---

### 3. `call` 메서드

```python
def call(self, inputs):
    output, activation_node_list = self.activation(inputs)
    self.node_list = activation_node_list
    output = np.array([output])
    return output
```

- **`inputs`**: 이전 레이어의 출력을 입력으로 받습니다.
- **`self.activation(inputs)`**: 입력 데이터를 활성화 함수에 전달하고, 활성화 값과 노드 리스트를 반환받습니다.
- **`self.node_list`**: 계산 그래프의 노드 리스트를 업데이트합니다.
- **`output`**: 활성화 함수의 결과를 배열 형태로 변환하여 반환합니다.
- **연산 수행**: 실제 연산이 이루어지는 핵심 메서드로, 모델의 순전파(forward propagation) 단계에서 호출됩니다.

---

### 4. 출력 형태 계산 (`compute_output_shape`)

```python
def compute_output_shape(self, input_shape):
    return input_shape
```

- **`input_shape`**: 입력 데이터의 형태입니다.
- **반환값**: 활성화 함수는 입력의 형태를 그대로 유지하므로, 입력의 형태를 그대로 반환합니다.

---

### 5. 빌드 메서드 (`build`)

```python
def build(self, input_shape):
    self.input_shape = input_shape
    self.output_shape = input_shape
    super().build(input_shape)
```

- **`input_shape`**: 입력 데이터의 형태를 설정합니다.
- **`output_shape`**: 출력 데이터의 형태를 설정합니다. 활성화 함수는 입력과 출력의 형태가 동일합니다.
- **부모 클래스 호출**: 부모 클래스의 `build` 메서드를 호출하여 추가적인 초기화 작업을 수행합니다.

---

## 주요 포인트

1. **비선형성 추가**: `Activation` 레이어는 활성화 함수를 사용하여 모델의 비선형성을 추가합니다. 이로 인해 모델은 단순 선형 변환 이상의 복잡한 패턴을 학습할 수 있습니다.
2. **노드 리스트 관리**: `node_list` 속성은 계산 그래프에서 활성화 함수의 각 연산 노드를 추적합니다. 이는 역전파(backpropagation) 단계에서 그래디언트 계산 시 사용됩니다.
3. **연결 및 연산 수행**: 활성화 함수는 보통 `Dense` 레이어나 `Conv` 레이어와 연결된 이후 계산이 수행됩니다. 이를 통해 모델의 출력이 활성화 함수를 거쳐 최종 결과값이 됩니다.

[**Activation Functions Module**](Activation%20Functions%20Module%2013be8eae96298014b7e1f6a22cb43fe8.md)

[Activation Class Code](Activation%20Class%20Code%2013ce8eae96298031ad79fc33346d21ac.md)