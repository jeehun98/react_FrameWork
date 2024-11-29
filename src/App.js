import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileViewer from "./FileViewer";
import FileDetail from "./FileDetail";
import files from "./FilesData";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FileViewer files={files} />} />
        <Route path="/file/:fileName" element={<FileDetail files={files} />} />
      </Routes>
    </Router>
  );
};

export default App;
