# Dense Class Code

```python
import numpy as np
from dev.layers.layer import Layer
from dev import activations
from dev.node.node import Node
from dev.backend.operaters import operations_matrix

class Dense(Layer):
    def __init__(self, units, activation=None, name=None, initializer='he', **kwargs):
        super().__init__(name, **kwargs)
        self.units = units
        self.output_shape = (1, units)
        self.trainable = True
        self.node_list = []
        self.mul_mat_node_list = []
        self.add_bias_node_list = []
        self.act_node_list = []
        self.layer_name = "dense"

        # 활성화 함수 설정
        self.activation = activations.get(activation) if activation else None

        # 가중치 및 편향 초기화 방식
        self.initializer = initializer
        self.weights = None
        self.bias = None

    def initialize_weights(self, input_dim):
        """
        가중치와 편향을 초기화합니다.
        추가된 초기화 방법: zeros, ones, random_uniform
        """
        if self.initializer == 'he':
            self.weights = np.random.randn(input_dim, self.units) * np.sqrt(2 / input_dim)
        elif self.initializer == 'xavier':
            self.weights = np.random.randn(input_dim, self.units) * np.sqrt(1 / input_dim)
        elif self.initializer == 'zeros':
            self.weights = np.zeros((input_dim, self.units))
        elif self.initializer == 'ones':
            self.weights = np.ones((input_dim, self.units))
        elif self.initializer == 'random_uniform':
            self.weights = np.random.uniform(-0.05, 0.05, (input_dim, self.units))
        else:
            raise ValueError(f"Unknown initializer: {self.initializer}")

        self.bias = np.zeros((1, self.units))

    def build(self, input_shape):
        if not isinstance(input_shape, (tuple, list)) or len(input_shape) < 2:
            raise ValueError("Invalid input shape. Expected a tuple with at least two dimensions.")

        input_dim = input_shape[1]
        self.input_shape = input_shape

        # 가중치 초기화
        self.initialize_weights(input_dim)

        super().build()

    def call(self, input_data):
        """
        Dense 층의 연산을 수행합니다.
        """
        if input_data.ndim != 2 or input_data.shape[1] != self.input_shape[1]:
            raise ValueError(f"Invalid input shape. Expected shape (batch_size, {self.input_shape[1]}), "
                             f"but got {input_data.shape}.")

        # 행렬 곱셈 연산
        x, self.node_list = operations_matrix.matrix_multiply(input_data, self.weights)

        # 편향 추가
        if self.bias is not None:
            bias_reshaped = np.tile(self.bias, (input_data.shape[0], 1))
            x, add_node_list = operations_matrix.matrix_add(x, bias_reshaped)
            
            # add_node_list 의 각 원소의 리프 노드 탐색 후 연결수행

            for i in range(len(self.node_list)):
                leaf_node = add_node_list[i].find_leaf_nodes()[0]
                root_node = self.node_list[i]

                root_node.add_parent(leaf_node)
                leaf_node.add_child(root_node)

        # 활성화 함수 적용
        if self.activation is not None:
            x, act_node_list = self.activation(x)
            
            for i in range(len(self.node_list)):
                leaf_node = act_node_list[i].find_leaf_nodes()[0]
                root_node = self.node_list[i]

                root_node.add_parent(leaf_node)
                leaf_node.add_child(root_node)
            
        return x.reshape(1,-1)

    def get_config(self):
        base_config = super().get_config()
        config = {
            'class_name': self.__class__.__name__,
            'units': self.units,
            'activation': self.activation.__name__ if self.activation else None,
            'initializer': self.initializer,
            'input_shape': self.input_shape,
            'trainable': self.trainable
        }
        return {**base_config, **config}

    @classmethod
    def from_config(cls, config):
        return cls(**config)

    def set_root_node(self):
        """
        모든 노드의 루트를 설정합니다.
        루트 노드가 이미 설정된 경우 중복 작업을 피합니다.
        """
        if not all(node.is_root() for node in self.node_list):
            self.node_list = [self.find_root(node) for node in self.node_list]

```