# Layer Class Code

```python
from dev import regularizers

class Layer:
    def __init__(self, name=None, regularizer=None, **kwargs):
        self.name = name or self.__class__.__name__
        self.input_shape = None
        self.output_shape = None
        self.built = False
        
        # Regularizer 설정
        if regularizer is not None:
            self.regularizer = regularizers.get(regularizer)
        else:
            self.regularizer = None

        # input_dim 인자 처리
        self.input_dim_arg = kwargs.pop("input_dim", None)
        if self.input_dim_arg is not None:
            self.input_dim_arg = (self.input_dim_arg,)

    def build(self, input_shape=None):
        """
        레이어의 초기화 작업을 수행합니다.
        input_shape 인자가 제공되지 않으면, self.input_dim_arg를 사용합니다.
        """
        if input_shape is not None:
            self.input_shape = input_shape
        elif self.input_dim_arg is not None:
            self.input_shape = self.input_dim_arg
        else:
            raise ValueError("Input shape must be provided during build.")

        self.built = True

    def call(self, *args, **kwargs):
        """
        Forward 연산을 수행합니다.
        이 메서드는 상속받는 클래스에서 구현되어야 합니다.
        """
        if not self.built:
            raise RuntimeError(
                f"Layer '{self.name}' is not built yet. "
                "Please call `build()` before using this layer."
            )

        raise NotImplementedError(
            f"Layer {self.__class__.__name__} does not have a `call()` "
            "method implemented. Received args: {args}, kwargs: {kwargs}"
        )

    def apply_regularizer(self, weights):
        """
        가중치에 대해 regularizer를 적용합니다.
        """
        if self.regularizer is not None:
            return self.regularizer(weights)
        return 0

    def get_config(self):
        """
        레이어의 구성 정보를 반환합니다.
        """
        config = {
            'name': self.name,
            'input_shape': self.input_shape,
            'output_shape': self.output_shape,
            'regularizer': self.regularizer.__class__.__name__ if self.regularizer else None,
            'module': "dev.layers",
        }
        return config

    @classmethod
    def from_config(cls, config):
        """
        구성 정보를 사용해 인스턴스를 복원합니다.
        """
        instance = cls(name=config['name'], regularizer=config.get('regularizer'))
        instance.input_shape = config.get('input_shape')
        instance.output_shape = config.get('output_shape')
        return instance

```