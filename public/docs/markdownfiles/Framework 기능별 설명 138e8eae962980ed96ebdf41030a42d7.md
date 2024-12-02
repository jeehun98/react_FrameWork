# Framework 기능별 설명

## **1. 계산 그래프 (Computation Graph)**

### **A. PyTorch의 구현 방법 (Dynamic Graph)**

```python
import torch

# 동적 계산 그래프 예제
x = torch.tensor([1.0], requires_grad=True)
y = torch.tensor([2.0], requires_grad=True)
z = x ** 2 + y ** 2  # 그래프가 동적으로 생성됨

z.backward()  # 역전파
print(x.grad)  # dz/dx = 2x = 2
print(y.grad)  # dz/dy = 2y = 4
```

- **설명**: PyTorch는 **동적 계산 그래프 (Dynamic Computation Graph)** 방식을 사용합니다. 모델이 실행될 때마다 새로운 계산 그래프가 생성되며, 코드 실행 시점에서 그래프를 정의합니다.
- **장점**:
    - **디버깅이 용이**: Python 코드와 동일하게 동작하므로, 에러 발생 시 즉시 문제를 파악하고 수정할 수 있습니다.
    - **유연한 모델 정의**: 조건문이나 반복문을 활용하여 **복잡한 모델 구조**를 동적으로 정의할 수 있습니다.
- **구현 방식**:
    - 각 연산은 **Autograd Function** 클래스의 서브클래스로 정의되며, Forward/Backward 메서드를 구현합니다.
    - 그래프는 Python 객체로 유지되며, `backward()` 메서드 호출 시 그래디언트가 계산됩니다.

### **B. TensorFlow의 구현 방법 (Static Graph)**

```python
import tensorflow as tf

@tf.function  # 정적 그래프 생성
def compute_graph(x, y):
    return x ** 2 + y ** 2

x = tf.Variable(1.0)
y = tf.Variable(2.0)
z = compute_graph(x, y)

with tf.GradientTape() as tape:
    z = compute_graph(x, y)

# 그래디언트 계산
gradients = tape.gradient(z, [x, y])
print(gradients)  # [2.0, 4.0]
```

- **설명**: TensorFlow는 기본적으로 **정적 계산 그래프 (Static Computation Graph)** 방식을 사용합니다. 모든 연산이 실행되기 전에 그래프가 정의되며, 이후 한 번에 실행됩니다.
- **장점**:
    - **최적화 가능성**: 그래프가 고정되기 때문에 다양한 최적화 기법 (Graph Transformations, XLA Compiler)을 적용할 수 있습니다.
    - **모델 배포 용이**: 그래프를 `.pb` 파일로 저장하고, 다양한 환경에서 배포할 수 있습니다.
- **구현 방식**:
    - TensorFlow 1.x에서는 `tf.Session()`과 함께 그래프를 정의하고 실행했습니다.
    - TensorFlow 2.x에서는 **Eager Execution**을 통해 동적 그래프도 지원하지만, `@tf.function`을 사용하여 정적 그래프를 생성할 수 있습니다.

---

## **2. 자동 미분 (Autograd / Automatic Differentiation)**

### **A. PyTorch의 Autograd**

```python
import torch

x = torch.tensor(3.0, requires_grad=True)

y = x ** 2
y.backward()  # 자동 미분

print(x.grad)  # dy/dx = 2 * x = 6
```

- **설명**: PyTorch는 **동적 계산 그래프**를 기반으로 자동 미분 기능을 제공합니다. 각 연산은 `Autograd Function` 클래스의 서브클래스이며, 그래프는 연산이 수행될 때마다 생성됩니다.
- **구현 방식**:
    - 각 연산은 **Tensor 객체**의 `grad_fn` 속성에 의해 추적됩니다.
    - `backward()` 메서드 호출 시, 그래프의 노드들이 역순으로 방문되며, **Chain Rule**을 사용해 그래디언트를 계산합니다.
- **장점**:
    - **사용자 정의 함수**에 대해서도 자동 미분이 가능합니다 (`torch.autograd.Function`).
    - 코드가 간단하며, Python과 동일한 방식으로 작동합니다.

### **B. TensorFlow의 GradientTape**

```python
import tensorflow as tf

x = tf.Variable(3.0)

with tf.GradientTape() as tape:
    y = x ** 2

grad = tape.gradient(y, x)
print(grad)  # dy/dx = 2 * x = 6
```

- **설명**: TensorFlow 2.x에서는 **tf.GradientTape**를 사용해 자동 미분을 수행합니다. 이 테이프는 연산을 기록하고, 역전파 시 이를 사용해 그래디언트를 계산합니다.
- **구현 방식**:
    - `with tf.GradientTape()` 블록 내에서 연산이 수행되면, 테이프가 연산을 기록합니다.
    - `tape.gradient()` 메서드 호출 시 그래디언트가 계산됩니다.
- **장점**:
    - **정적 그래프 모드**와 함께 사용 시 최적화 가능.
    - 다양한 연산에 대해 자동 미분이 지원됩니다.

### **C. JAX의 Autodiff**

```python
import jax
import jax.numpy as jnp

def func(x):
    return x ** 2

grad_func = jax.grad(func)
print(grad_func(3.0))  # 6.0
```

- **설명**: JAX는 **Function Transformation**을 통해 자동 미분을 수행합니다 (`jax.grad`).
- **구현 방식**:
    - 함수 자체를 변환(`grad`, `jit`, `vmap` 등)하여 그래디언트를 계산합니다.
- **장점**:
    - 함수 변환 방식이므로, 최적화 및 벡터화에 유리합니다.
    - GPU/TPU 가속을 쉽게 적용할 수 있습니다.

---

## **3. 레이어 시스템 (Layer System)**

### **A. Keras의 Layer 시스템**

```python
import tensorflow as tf

class CustomLayer(tf.keras.layers.Layer):
    def __init__(self, units=32):
        super(CustomLayer, self).__init__()
        self.units = units

    def build(self, input_shape):
        self.w = self.add_weight(shape=(input_shape[-1], self.units), initializer="random_normal")

    def call(self, inputs):
        return tf.matmul(inputs, self.w)

layer = CustomLayer(10)
x = tf.ones((1, 5))
print(layer(x))
```

- **설명**: Keras는 **함수형 API와 시퀀셜 API**를 사용해 레이어를 정의합니다. 각 레이어는 `tf.keras.layers.Layer`의 서브클래스입니다.
- **구현 방식**:
    - `__init__()`에서 레이어의 파라미터를 정의하고, `call()` 메서드에서 Forward Propagation을 구현합니다.
- **장점**:
    - 직관적이며, 사용자가 쉽게 새로운 레이어를 정의할 수 있습니다.
    - 다양한 기본 레이어(`Dense`, `Conv2D`, `LSTM` 등)가 제공됩니다.

### **B. PyTorch의 Module 시스템**

```python
import torch
import torch.nn as nn

class CustomLayer(nn.Module):
    def __init__(self, input_dim, output_dim):
        super(CustomLayer, self).__init__()
        self.linear = nn.Linear(input_dim, output_dim)

    def forward(self, x):
        return self.linear(x)

layer = CustomLayer(5, 10)
x = torch.ones((1, 5))
print(layer(x))
```

- **설명**: PyTorch는 `torch.nn.Module` 클래스를 통해 레이어를 정의합니다. 각 레이어는 모듈의 서브클래스로 구현되며, Forward 메서드에서 연산이 수행됩니다.
- **구현 방식**:
    - `__init__()`에서 파라미터를 정의하고, `forward()`에서 연산을 수행합니다.
- **장점**:
    - 모듈 간의 **자동 연결 및 파라미터 관리**가 용이합니다.
    - 다양한 모델 아키텍처를 쉽게 정의할 수 있습니다.

---

## **4. 최적화 알고리즘 (Optimization Algorithms)**

### **A. PyTorch의 Optimizer**

```python
import torch
import torch.optim as optim

model = nn.Linear(1, 1)
optimizer = optim.SGD(model.parameters(), lr=0.01)

# 데이터 및 손실 함수 정의
x = torch.tensor([[1.0]], requires_grad=True)
y = torch.tensor([[2.0]])

# Forward Propagation 및 역전파
output = model(x)
loss = (output - y) ** 2
loss.backward()

# 파라미터 업데이트
optimizer.step()
optimizer.zero_grad()
```

- **설명**: PyTorch는 `torch.optim` 모듈에서 다양한 최적화 알고리즘을 제공합니다.
- **구현 방식**:
    - `step()` 메서드를 통해 파라미터 업데이트가 이루어집니다.
    - `state_dict()`를 통해 최적화 알고리즘의 상태를 저장하고 복원할 수 있습니다.
- **장점**:
    - 다양한 최적화 기법(SGD, Adam, RMSProp 등)을 쉽게 사용할 수 있습니다.
    - 파라미터 그룹 설정을 통해 각 레이어에 다른 학습률을 적용할 수 있습니다.

### **B. TensorFlow의 Optimizer**

```python
import tensorflow as tf

model = tf.keras.Sequential([tf.keras.layers.Dense(1)])
optimizer = tf.keras.optimizers.SGD(learning_rate=0.01)

x = tf.constant([[1.0]])
y = tf.constant([[2.0]])

# Forward 및 역전파
with tf.GradientTape() as tape:
    predictions = model(x)
    loss = tf.reduce_mean((predictions - y) ** 2)

# 그래디언트 계산 및 파라미터 업데이트
gradients = tape.gradient(loss, model.trainable_variables)
optimizer.apply_gradients(zip(gradients, model.trainable_variables))
```

- **설명**: TensorFlow는 `tf.keras.optimizers` 모듈에서 최적화 알고리즘을 제공합니다.
- **구현 방식**:
    - `apply_gradients()` 메서드로 그래디언트를 사용해 파라미터를 업데이트합니다.
- **장점**:
    - 다양한 최적화 기법과 함께, **학습률 스케줄링** 기능이 포함되어 있습니다.