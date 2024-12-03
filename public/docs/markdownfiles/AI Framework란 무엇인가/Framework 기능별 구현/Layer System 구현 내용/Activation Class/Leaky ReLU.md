# 4. Leaky ReLU

### 개요

- **정의**: Leaky ReLU는 ReLU의 변형으로, 음수 입력 값에 대해 작은 기울기를 허용합니다.
- **공식**: Leaky ReLU(x)=max(α⋅x,x)
    
    Leaky ReLU(x)=max⁡(α⋅x,x)\text{Leaky ReLU}(x) = \max(\alpha \cdot x, x)
    
- **특징**:
    - `α`는 보통 0.01로 설정됩니다.
    - `Dying ReLU` 문제를 완화할 수 있습니다.

```cpp
std::pair<py::array_t<double>, std::vector<std::shared_ptr<Node>>> leaky_relu(
    py::array_t<double> inputs, 
    double alpha = 0.01, 
    std::vector<std::shared_ptr<Node>> node_list = {}
) {
    py::buffer_info buf = inputs.request();
    double* ptr = static_cast<double*>(buf.ptr);

    py::array_t<double> result(buf.size);
    py::buffer_info buf_result = result.request();
    double* ptr_result = static_cast<double*>(buf_result.ptr);

    bool is_new_graph = node_list.empty();

    for (size_t i = 0; i < buf.size; ++i) {
        double input_value = ptr[i];
        double leaky_value = alpha * input_value;

        if (is_new_graph) {
            double compare_output = (input_value > 0) ? 1.0 : 0.0;
            std::shared_ptr<Node> compare_node = std::make_shared<Node>("compare", input_value, compare_output, 0);

            double output_value = (compare_output > 0) ? input_value : leaky_value;
            std::shared_ptr<Node> select_node = std::make_shared<Node>("select", input_value, leaky_value, output_value, 0);
            select_node->add_parent(compare_node);
            compare_node->add_child(select_node);

            node_list.push_back(select_node);
            ptr_result[i] = output_value;
        } else {
            auto select_node = node_list[i];
            double output_value = (input_value > 0) ? input_value : leaky_value;
            select_node->update(input_value, leaky_value, output_value, 0);
            ptr_result[i] = select_node->output;

            // 노드 연결 확인 및 재설정
            auto compare_node = select_node->get_parents()[0];
            compare_node->update(input_value, 0.0, input_value > 0 ? 1.0 : 0.0, 0);
        }
    }

    return std::make_pair(result, node_list);
}

```

### 코드 설명

- **노드 구성**:
    - `compare_node`: 입력 값과 0을 비교합니다.
    - `select_node`: 입력 값이 양수면 그대로 반환, 음수면 `alpha`와 곱한 값을 반환합니다.
- **새로운 그래프** 생성 시, 비교 노드와 선택 노드를 연결합니다.
- **기존 그래프** 업데이트 시, 노드 값을 업데이트하고 연결 관계를 재설정합니다.