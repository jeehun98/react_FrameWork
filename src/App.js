import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileViewer from "./FileViewer";
import FileDetail from "./FileDetail";
import DocsPage from "./DocsPage"; // 새 문서 페이지
import files from "./data";
import MarkdownViewer from "./MarkdownViewer";
import "./styles/App.css"; // 스타일 추가

const App = () => {
  return (
    <div className="App">
      <h1>React Markdown Viewer</h1>
      {/* example.md 파일을 표시 */}
      <MarkdownViewer fileName="example" />

      <Router>
        <header>
          <h1>AI Framework 주요 기능 구현</h1>
        </header>
        <Routes>
          <Route path="/" element={<FileViewer files={files} />} />
          <Route path="/file/:fileName" element={<FileDetail files={files} />} />
          <Route path="/docs/:componentName" element={<DocsPage />} /> {/* 새 경로 */}
        </Routes>
        <footer>
          <p>&copy; 2024 Code Files Viewer. All rights reserved.</p>
        </footer>
      </Router>
    </div>
  );
};

export default App;
