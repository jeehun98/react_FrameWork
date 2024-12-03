# Activation Functions Module

**init**.py

```python
from dev.activations.activations import sigmoid, relu, leaky_relu, softmax, tanh

# 활성화 함수 객체 집합
ALL_ACTIVATIONS = {
    sigmoid,
    relu,
    leaky_relu,
    softmax,
    tanh,
}

# 활성화 함수 이름과 객체를 매핑한 딕셔너리
ALL_ACTIVATIONS_DICT = {activation.__name__: activation for activation in ALL_ACTIVATIONS}

def get(identifier):
    """
    활성화 함수의 이름(identifier)을 문자열로 입력받아, 
    해당 이름에 맞는 활성화 함수 객체를 반환합니다.
    
    Parameters:
        identifier (str or callable): 활성화 함수의 이름(str) 또는 함수 객체.
    
    Returns:
        function: 호출 가능한 활성화 함수 객체.
    
    Raises:
        ValueError: 유효하지 않은 이름이 입력된 경우 예외를 발생시킵니다.
    """

    # 입력이 문자열인 경우, 딕셔너리에서 활성화 함수 가져오기
    if isinstance(identifier, str):
        activation_fn = ALL_ACTIVATIONS_DICT.get(identifier)

        # 함수 객체가 유효한 경우 반환
        if callable(activation_fn):
            return activation_fn

    # 입력이 이미 함수 객체인 경우, 그대로 반환
    if callable(identifier):
        return identifier

    # 유효하지 않은 입력일 경우 예외 발생
    available_activations = ", ".join(ALL_ACTIVATIONS_DICT.keys())
    raise ValueError(
        f"Invalid activation function identifier: '{identifier}'. "
        f"Available options are: {available_activations}."
    )

```

activation.py

```python
# backend 변환
import os
os.add_dll_directory("C:\\msys64\\mingw64\\bin")

from dev.backend.activations import activations

def relu(x, node_list = []):
    return activations.relu(x, node_list)

def leaky_relu(x, alpha=0.01, node_list = []):
    return activations.leaky_relu(x, alpha, node_list)

def sigmoid(x, node_list = []):
    return activations.sigmoid(x, node_list)

def tanh(x, node_list = []):
    return activations.tanh_activation(x, node_list)

def softmax(x, node_list = []):
    return activations.softmax(x, node_list)
```

### 1. **모듈 개요**

---

- 이 모듈은 다양한 **활성화 함수**들을 정의하고 관리합니다.
- 모델의 비선형성을 추가하여 학습 성능을 향상시키는 데 중요한 역할을 합니다.
- 문자열을 통해 활성화 함수의 이름을 입력받아, 이를 호출 가능한 함수 객체로 반환하는 **`get()` 메서드**를 제공합니다.

---

## 2. **지원 활성화 함수 목록**

- 이 모듈에서는 다음과 같은 활성화 함수들을 제공합니다:
    - **Sigmoid** (`sigmoid`)
    - **ReLU** (`relu`)
    - **Leaky ReLU** (`leaky_relu`)
    - **Softmax** (`softmax`)
    - **Tanh** (`tanh`)

---

---

## 3. **`get()` 메서드 설명**

### 개요

- **`get()` 메서드**는 활성화 함수의 이름을 문자열로 받아서, 해당 함수 객체를 반환하는 역할을 합니다.
- 사용자가 정의되지 않은 활성화 함수의 이름을 입력할 경우, **예외 처리**를 통해 오류를 반환합니다.

### 설명

- **문자열 검사**: `identifier`가 문자열인 경우, `ALL_ACTIVATIONS_DICT`에서 해당 이름의 활성화 함수를 가져옵니다.
- **유효성 검사**: 가져온 객체가 호출 가능한 함수인지(`callable()`) 확인합니다.
- **예외 처리**: 유효하지 않은 입력일 경우, 사용 가능한 활성화 함수의 목록을 함께 제공하여 오류 메시지를 반환합니다.

---

---

## 4. **확장 가능성 및 주의사항**

### 확장 가능성

- 새로운 활성화 함수를 추가할 경우:
    1. `dev/activations/activations.py` 파일에 활성화 함수 정의.
    2. `ALL_ACTIVATIONTS` 집합에 해당 함수를 추가.
    3. `get()` 메서드를 통해 호출 가능하게 설정.

### 주의사항

- **기울기 소실 문제**: Sigmoid, Tanh 등의 활성화 함수는 큰 입력 값에서 기울기 소실 문제가 발생할 수 있습니다.
- **Dying ReLU 문제**: ReLU 활성화 함수는 음수 입력 값에 대해 출력이 0이 되므로, `Leaky ReLU`로 개선할 수 있습니다.

[1. **ReLU (Rectified Linear Unit)**](1%20ReLU%20(Rectified%20Linear%20Unit)%2013be8eae962980e1afa6d3f6e9d65875.md)

[2. **Sigmoid**](2%20Sigmoid%2013be8eae962980228d64ff5dddd4f66c.md)

[3. **Tanh (Hyperbolic Tangent)**](3%20Tanh%20(Hyperbolic%20Tangent)%2013be8eae962980fbabeff51c7f1e069c.md)

[4. **Leaky ReLU**](4%20Leaky%20ReLU%2013be8eae962980b7801fde71b735fc54.md)

[5. **Softmax**](5%20Softmax%2013be8eae96298003948ec0e33e9ecf87.md)