# 1. ReLU (Rectified Linear Unit)

### 개요

- **정의**: ReLU는 입력 값이 0보다 크면 그대로 반환하고, 0 이하인 경우는 0을 반환합니다.
- **공식**: ReLU(x)=max(0,x)
    
    ReLU(x)=max⁡(0,x)\text{ReLU}(x) = \max(0, x)
    
- **특징**:
    - 간단한 계산으로 빠른 성능을 보장합니다.
    - 음수 입력 값을 0으로 반환하기 때문에, 일부 뉴런이 "죽는" 문제 (`Dying ReLU`)가 발생할 수 있습니다.

```cpp
std::pair<py::array_t<double>, std::vector<std::shared_ptr<Node>>> relu(
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
        double zero_value = 0.0;

        if (is_new_graph) {
            std::shared_ptr<Node> compare_node = std::make_shared<Node>("compare", input_value, zero_value, input_value > 0 ? 1.0 : 0.0);
            double output_value = (compare_node->output > 0) ? input_value : 0.0;
            std::shared_ptr<Node> select_node = std::make_shared<Node>("select", input_value, zero_value, output_value);

            select_node->add_child(compare_node);
            compare_node->add_parent(select_node);

            node_list.push_back(select_node);
            ptr_result[i] = output_value;
        } else {
            auto select_node = node_list[i];
            select_node->update(input_value, zero_value, (input_value > 0) ? input_value : 0.0, 0);
            ptr_result[i] = select_node->output;

            // 노드 연결 확인 및 재설정
            auto compare_node = select_node->get_children()[0];  // 첫 번째 자식 노드가 비교 노드
            compare_node->update(input_value, zero_value, input_value > 0 ? 1.0 : 0.0, 0);
        }
    }

    return std::make_pair(result, node_list);
}
```

### 코드 설명

- **노드 구성**:
    - `compare_node`: 입력 값과 0을 비교합니다.
    - `select_node`: 비교 결과에 따라 입력 값 또는 0을 선택합니다.
- **새로운 그래프** 생성 시, `compare_node`와 `select_node`를 연결합니다.
- **기존 그래프** 업데이트 시, 노드 값을 업데이트하고 연결 관계를 재설정합니다.