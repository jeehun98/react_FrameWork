import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileViewer from "./FileViewer";
import FileDetail from "./FileDetail";
import files from "./filesData";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 파일 목록 페이지 */}
        <Route path="/" element={<FileViewer files={files} />} />
        
        {/* 파일 상세 페이지 */}
        <Route
          path="/file/:fileName"
          element={<FileDetail files={files} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
