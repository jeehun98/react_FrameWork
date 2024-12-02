# 2. Sigmoid

### 개요

- **정의**: Sigmoid 함수는 입력 값을 0과 1 사이의 값으로 변환합니다.
- **공식**: Sigmoid(x)=1+e−x1​
    
    Sigmoid(x)=11+e−x\text{Sigmoid}(x) = \frac{1}{1 + e^{-x}}
    
- **특징**:
    - 출력 값이 [0, 1] 범위에 있습니다.
    - 이진 분류 문제에서 주로 사용됩니다.
    - 큰 입력 값에서는 **기울기 소실 문제**가 발생할 수 있습니다.

```cpp
std::pair<py::array_t<double>, std::vector<std::shared_ptr<Node>>> sigmoid(
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
            double neg_output = -input_value;
            std::shared_ptr<Node> neg_node = std::make_shared<Node>("negate", input_value, neg_output, 0);

            double exp_output = std::exp(neg_output);
            std::shared_ptr<Node> exp_node = std::make_shared<Node>("exp", neg_output, exp_output, 0);
            exp_node->add_child(neg_node);
            neg_node->add_parent(exp_node);

            double constant_value = 1.0;
            double add_output = constant_value + exp_output;
            std::shared_ptr<Node> add_node = std::make_shared<Node>("add", exp_output, constant_value, add_output, 0);
            add_node->add_child(exp_node);
            exp_node->add_parent(add_node);

            double recip_output = constant_value / add_output;
            std::shared_ptr<Node> recip_node = std::make_shared<Node>("reciprocal", constant_value, add_output, recip_output, 0);
            recip_node->add_child(add_node);
            add_node->add_parent(recip_node);

            node_list.push_back(recip_node);
            ptr_result[i] = recip_output;
        } else {
            auto recip_node = node_list[i];
            double neg_output = -input_value;
            double exp_output = std::exp(neg_output);
            double add_output = 1.0 + exp_output;
            recip_node->update(1.0, add_output, 1.0 / add_output, 0);
            ptr_result[i] = recip_node->output;

            // 노드 연결 확인 및 재설정
            auto add_node = recip_node->get_children()[0];
            add_node->update(exp_output, 1.0, add_output, 0);

            auto exp_node = add_node->get_children()[0];
            exp_node->update(neg_output, 0.0, exp_output, 0);

            auto neg_node = exp_node->get_children()[0];
            neg_node->update(input_value, 0.0, neg_output, 0);
        }
    }

    return std::make_pair(result, node_list);
}
```

### 코드 설명

- **노드 구성**:
    - `neg_node`: 입력 값의 음수를 계산합니다.
    - `exp_node`: 음수 값을 지수 함수로 변환합니다.
    - `add_node`: 지수 값에 1을 더합니다.
    - `reciprocal_node`: 1을 더한 값의 역수를 계산합니다.
- **새로운 그래프** 생성 시, 위 노드들을 연결하여 계산 그래프를 구성합니다.
- **기존 그래프** 업데이트 시, 각 노드의 값을 재설정하고 연결 관계를 업데이트합니다.