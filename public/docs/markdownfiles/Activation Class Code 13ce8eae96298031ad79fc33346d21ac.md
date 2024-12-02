# Activation Class Code

```python
from dev.layers.layer import Layer
from dev import activations
import numpy as np

class Activation(Layer):
"""
Activation 레이어 클래스:
입력된 활성화 함수를 사용하여 입력 데이터에 비선형성을 추가합니다.
"""

def __init__(self, activation, **kwargs):
    """
    Parameters:
        activation (str or callable): 사용할 활성화 함수의 이름 또는 함수 객체.
        **kwargs: 추가적인 파라미터는 부모 클래스(Layer)로 전달됩니다.
    """
    # 부모 클래스(Layer) 초기화
    super().__init__(**kwargs)

    # 활성화 함수 가져오기 (이름 또는 함수 객체 지원)
    self.activation = activations.get(activation)

    # 계산 그래프에서 노드 추적을 위한 리스트
    self.node_list = []

    # 활성화 레이어는 학습 가능한 파라미터가 없습니다.
    self.trainable = False

    # 레이어 이름 설정
    self.layer_name = "activation"

def call(self, inputs):
    """
    입력 데이터를 활성화 함수에 적용합니다.

    Parameters:
        inputs (np.ndarray): 이전 레이어의 출력 데이터.

    Returns:
        np.ndarray: 활성화 함수 적용 후 출력 데이터.
    """
    # 활성화 함수 적용 및 계산 그래프 노드 리스트 반환
    output, activation_node_list = self.activation(inputs)

    # 노드 리스트 업데이트 (역전파 시 사용)
    self.node_list = activation_node_list

    # 출력 데이터를 배열로 변환하여 반환 (일관성 유지)
    return np.array([output])

def compute_output_shape(self, input_shape):
    """
    출력 데이터의 형태를 계산합니다.

    Parameters:
        input_shape (tuple): 입력 데이터의 형태.

    Returns:
        tuple: 출력 데이터의 형태 (입력과 동일).
    """
    return input_shape

def build(self, input_shape):
    """
    레이어의 초기 설정을 완료합니다.

    Parameters:
        input_shape (tuple): 입력 데이터의 형태.
    """
    self.input_shape = input_shape
    self.output_shape = input_shape

    # 부모 클래스의 build 메서드 호출
    super().build(input_shape)

```