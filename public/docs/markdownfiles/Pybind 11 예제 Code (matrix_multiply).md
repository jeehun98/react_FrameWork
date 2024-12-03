# Pybind 11 예제 Code (matrix_multiply)

```cpp
#include <pybind11/pybind11.h>
#include <pybind11/numpy.h>
#include <vector>

namespace py = pybind11;

// C++에서 행렬 곱셈 함수 정의
py::array_t<double> matrix_multiply(py::array_t<double> mat1, py::array_t<double> mat2) {
    auto buf1 = mat1.request();
    auto buf2 = mat2.request();

    if (buf1.shape[1] != buf2.shape[0]) {
        throw std::runtime_error("행렬의 크기가 맞지 않습니다.");
    }

    size_t rows = buf1.shape[0];
    size_t cols = buf2.shape[1];
    size_t inner_dim = buf1.shape[1];

    std::vector<double> result(rows * cols, 0.0);

    auto ptr1 = static_cast<double*>(buf1.ptr);
    auto ptr2 = static_cast<double*>(buf2.ptr);

    // 행렬 곱셈 연산
    for (size_t i = 0; i < rows; ++i) {
        for (size_t j = 0; j < cols; ++j) {
            for (size_t k = 0; k < inner_dim; ++k) {
                result[i * cols + j] += ptr1[i * inner_dim + k] * ptr2[k * cols + j];
            }
        }
    }

    // Python에서 사용 가능한 NumPy 배열로 반환
    return py::array_t<double>({rows, cols}, result.data());
}

// Pybind11 모듈 정의
PYBIND11_MODULE(matrix_ops, m) {
    m.def("matrix_multiply", &matrix_multiply, "행렬 곱셈 함수");
}

```

### **C++ 코드 설명**:

- `matrix_multiply()` 함수는 두 개의 NumPy 배열을 입력받아 행렬 곱셈을 수행하고 결과를 반환합니다.
- `py::array_t` 타입은 Python의 NumPy 배열과 직접 호환됩니다.
- `PYBIND11_MODULE` 매크로는 Python 모듈을 정의합니다 (`matrix_ops`).