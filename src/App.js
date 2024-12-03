import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MarkdownFilesViewer from "./components/MarkdownFilesViewer/MarkdownFilesViewer";
import MarkdownContent from "./components/MarkdownFilesViewer/MarkdownContent";
import "./styles/App.css";

const App = () => {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>React Markdown Viewer</h1>
        </header>
        <div className="content-container">
          <nav className="navigator">
            <MarkdownFilesViewer />
          </nav>
          <main className="main-content">
            <Routes>
              <Route path="/file/:fileName" element={<MarkdownContent />} />
            </Routes>
          </main>
        </div>
        <footer>
          <p>&copy; 2024 Code Files Viewer. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
