import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileViewer from "./FileViewer";
import FileDetail from "./FileDetail";
import DocsPage from "./DocsPage"; // 새 문서 페이지
import files from "./FilesData";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FileViewer files={files} />} />
        <Route path="/file/:fileName" element={<FileDetail files={files} />} />
        <Route path="/docs/:componentName" element={<DocsPage />} /> {/* 새 경로 */}
      </Routes>
    </Router>
  );
};

export default App;
