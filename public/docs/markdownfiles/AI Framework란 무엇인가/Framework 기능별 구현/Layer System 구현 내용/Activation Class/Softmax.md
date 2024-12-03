# 5. Softmax

### 개요

- **정의**: Softmax는 입력 값을 확률 분포로 변환합니다.
- **공식**: Softmax(xi​)=∑j​exj​exi​​
    
    Softmax(xi)=exi∑jexj\text{Softmax}(x_i) = \frac{e^{x_i}}{\sum_{j} e^{x_j}}
    
- **특징**:
    - 출력 값의 합이 1이 되도록 합니다.
    - 다중 클래스 분류 문제에서 출력층에 주로 사용됩니다.

```cpp
std::pair<py::array_t<double>, std::vector<std::shared_ptr<Node>>> softmax(
    py::array_t<double> inputs, 
    std::vector<std::shared_ptr<Node>> node_list = {}
) {
    py::buffer_info buf = inputs.request();
    if (buf.ndim != 2)
        throw std::runtime_error("Input should be a 2-D array");

    size_t num_rows = buf.shape[0];
    size_t num_cols = buf.shape[1];
    double* ptr = static_cast<double*>(buf.ptr);

    py::array_t<double> result({num_rows, num_cols});
    py::buffer_info buf_result = result.request();
    double* ptr_result = static_cast<double*>(buf_result.ptr);

    bool is_new_graph = node_list.empty();

    for (size_t row = 0; row < num_rows; ++row) {
        double* row_ptr = ptr + row * num_cols;
        double* row_result_ptr = ptr_result + row * num_cols;

        double max_val = *std::max_element(row_ptr, row_ptr + num_cols);

        double sum = 0.0;
        std::vector<std::shared_ptr<Node>> exp_nodes;

        for (size_t i = 0; i < num_cols; ++i) {
            double input_value = row_ptr[i];

            if (is_new_graph) {
                double sub_output = input_value - max_val;
                std::shared_ptr<Node> sub_node = std::make_shared<Node>("subtract", input_value, max_val, sub_output, 0);

                double exp_output = std::exp(sub_output);
                std::shared_ptr<Node> exp_node = std::make_shared<Node>("exp", sub_output, exp_output, 0);
                exp_node->add_child(sub_node);
                sub_node->add_parent(exp_node);

                exp_nodes.push_back(exp_node);
                sum += exp_output;
            } else {
                auto exp_node = node_list[row * num_cols + i];
                double sub_output = input_value - max_val;
                double exp_output = std::exp(sub_output);
                exp_node->update(sub_output, 0, exp_output, 0);
                exp_nodes.push_back(exp_node);
                sum += exp_output;
            }
        }

        for (size_t i = 0; i < num_cols; ++i) {
            if (is_new_graph) {
                double div_output = exp_nodes[i]->output / sum;
                std::shared_ptr<Node> div_node = std::make_shared<Node>("divide", exp_nodes[i]->output, sum, div_output, 0);
                div_node->add_child(exp_nodes[i]);
                exp_nodes[i]->add_parent(div_node);

                node_list.push_back(div_node);
                row_result_ptr[i] = div_output;
            } else {
                auto div_node = node_list[row * num_cols + i];
                double div_output = exp_nodes[i]->output / sum;
                div_node->update(exp_nodes[i]->output, sum, div_output, 0);
                row_result_ptr[i] = div_node->output;

                // 노드 연결 확인 및 재설정
                auto exp_node = div_node->get_parents()[0];
                exp_node->update(div_node->input_value, 0.0, std::exp(div_node->input_value), 0);
            }
        }
    }

    return std::make_pair(result, node_list);
}

```

### 코드 설명

- **노드 구성**:
    - `max_val`: 행별 최대 값을 찾습니다.
    - `exp_node`: 최대 값과 입력 값의 차이를 지수 함수로 변환합니다.
    - `div_node`: 지수 값의 합으로 나누어 확률 값을 계산합니다.
- **새로운 그래프** 생성 시, 각 노드를 추가하고 연결합니다.
- **기존 그래프** 업데이트 시, 노드 값을 재설정하고 부모 노드와의 연결을 업데이트합니다.