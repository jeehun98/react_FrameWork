# 3. Tanh (Hyperbolic Tangent)

### 개요

- **정의**: Tanh 함수는 입력 값을 -1에서 1 사이로 변환합니다.
- **공식**: Tanh(x)=ex+e−xex−e−x​
    
    Tanh(x)=ex−e−xex+e−x\text{Tanh}(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}}
    
- **특징**:
    - 출력 값이 [-1, 1] 범위에 있습니다.
    - Sigmoid보다 **기울기 소실 문제**가 적습니다.
    - 입력 값이 0에 가까울수록 출력 값도 0에 가까워집니다.

```cpp
std::pair<py::array_t<double>, std::vector<std::shared_ptr<Node>>> tanh_activation(
    py::array_t<double> inputs, 
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

        if (is_new_graph) {
            double exp_pos_output = std::exp(input_value);
            std::shared_ptr<Node> exp_pos_node = std::make_shared<Node>("exp", input_value, exp_pos_output, 0);

            double exp_neg_output = std::exp(-input_value);
            std::shared_ptr<Node> exp_neg_node = std::make_shared<Node>("exp", -input_value, exp_neg_output, 0);

            double numerator_output = exp_pos_output - exp_neg_output;
            std::shared_ptr<Node> numerator_node = std::make_shared<Node>("subtract", exp_pos_output, exp_neg_output, numerator_output, 0);
            numerator_node->add_child(exp_pos_node);
            numerator_node->add_child(exp_neg_node);
            exp_pos_node->add_parent(numerator_node);
            exp_neg_node->add_parent(numerator_node);

            double denominator_output = exp_pos_output + exp_neg_output;
            std::shared_ptr<Node> denominator_node = std::make_shared<Node>("add", exp_pos_output, exp_neg_output, denominator_output, 0);
            denominator_node->add_child(exp_pos_node);
            denominator_node->add_child(exp_neg_node);
            exp_pos_node->add_parent(denominator_node);
            exp_neg_node->add_parent(denominator_node);

            double reciprocal_output = 1.0 / denominator_output;
            std::shared_ptr<Node> reciprocal_node = std::make_shared<Node>("reciprocal", 1.0, denominator_output, reciprocal_output, 0);
            reciprocal_node->add_child(denominator_node);
            denominator_node->add_parent(reciprocal_node);

            double tanh_output = numerator_output * reciprocal_output;
            std::shared_ptr<Node> tanh_node = std::make_shared<Node>("multiply", numerator_output, reciprocal_output, tanh_output, reciprocal_output);
            tanh_node->add_child(numerator_node);
            numerator_node->add_parent(tanh_node);

            node_list.push_back(tanh_node);
            ptr_result[i] = tanh_output;
        } else {
            auto tanh_node = node_list[i];
            double exp_pos_output = std::exp(input_value);
            double exp_neg_output = std::exp(-input_value);
            double numerator_output = exp_pos_output - exp_neg_output;
            double denominator_output = exp_pos_output + exp_neg_output;
            double tanh_output = numerator_output / denominator_output;
            tanh_node->update(numerator_output, denominator_output, tanh_output, denominator_output);
            ptr_result[i] = tanh_node->output;

            // 노드 연결 확인 및 재설정
            auto reciprocal_node = tanh_node->get_parents()[0];
            reciprocal_node->update(1.0, denominator_output, 1.0 / denominator_output, 0);

            auto denominator_node = reciprocal_node->get_parents()[0];
            denominator_node->update(exp_pos_output, exp_neg_output, denominator_output, 0);

            auto numerator_node = tanh_node->get_parents()[0];
            numerator_node->update(exp_pos_output, exp_neg_output, numerator_output, 0);
        }
    }

    return std::make_pair(result, node_list);
}
```

### 코드 설명

- **노드 구성**:
    - `exp_pos_node`: 입력 값의 지수 값을 계산합니다.
    - `exp_neg_node`: 입력 값의 음수에 대한 지수 값을 계산합니다.
    - `numerator_node`: 지수 값의 차이를 계산합니다.
    - `denominator_node`: 지수 값의 합을 계산합니다.
    - `reciprocal_node`: 합의 역수를 계산합니다.
    - `tanh_node`: 분자와 분모의 비율을 계산하여 최종 값을 반환합니다.
- **새로운 그래프** 생성 시, 위 노드들을 연결하고 계산 그래프를 구성합니다.
- **기존 그래프** 업데이트 시, 노드 값을 재설정하고 연결 관계를 재구성합니다.