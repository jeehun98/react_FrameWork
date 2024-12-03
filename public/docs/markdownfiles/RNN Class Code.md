# RNN Class Code

```python
import os
os.add_dll_directory("C:\\msys64\\mingw64\\bin")

import numpy as np
from dev.layers.layer import Layer
from dev import activations
from dev.backend.recurrent import recurrent

class RNN(Layer):
    def __init__(
        self, 
        units,
        activation="tanh",
        recurrent_activation="sigmoid",
        use_bias=True,
        input_shape=None,
        return_sequences = False,
        **kwargs
    ):
        super().__init__(**kwargs)
        self.units = units
        self.activation = activation
        self.recurrent_activation = recurrent_activation
        self.use_bias = use_bias
        self.state = None
        self.input_shape = input_shape
        self.node_list = []
        self.return_sequences = return_sequences

    def build(self, input_shape):
        """
        RNN의 가중치 초기화
        W (커널) : 입력 데이터에서 은닉 상태로 전달되는 가중치 ( 입력 데이터의 차원, 은닉 유닛의 수 )
        U (순환 커널) : 이전 은닉 상태에서 현재 은닉 상태로 전달되는 가중치 ( 은닉 유닛의 수, 은닉 유닛의 수 )
        b (바이어스) : 각 은닉 상태의 바이어스 ( 은닉 유닛의 수 )
        """
        self.input_shape = input_shape

        input_dim = input_shape[-1]
        
        # 가중치 초기화
        self.weight = np.random.randn(input_dim, self.units)
        self.recurrent_weight = np.random.randn(self.units, self.units)
        self.bias = np.zeros((self.units,)) if self.use_bias else None

        # 상태 초기화
        self.state = np.zeros((1, self.units))

        self.output_shape = (1, self.units)

    def call(self, inputs):
        """
        RNN 레이어의 순전파 연산 (단일 입력 데이터)
        """
        # inputs의 shape: (timesteps, input_dim)
        timesteps, input_dim = inputs.shape

        # 결과를 담을 배열 초기화
        outputs = np.zeros((timesteps, self.units))

        # 노드 리스트 초기화 (첫 실행 시 빈 리스트 전달)
        node_list = []

        # 단일 입력 데이터에 대해 RNN 수행
        result, node_list = recurrent.rnn_layer(
            inputs,                   # 입력 데이터 (timesteps, input_dim)
            self.weight,              # 가중치 (input_dim, units)
            self.recurrent_weight,    # 순환 가중치 (units, units)
            self.bias,                # 바이어스 (units,)
            self.activation,          # 활성화 함수
            self.return_sequences,
        )

        # 결과를 numpy array로 변환하여 반환
        # 출력의 형태 (timesteps, units)
        outputs = np.array(result)

        self.node_list = node_list

        return outputs

    def get_config(self):
        config = {
            "units": self.units,
            "activation": self.activation,
            "recurrent_activation": self.recurrent_activation,
            "use_bias": self.use_bias,
        }
        base_config = super().get_config()
        return {**base_config, **config}

```