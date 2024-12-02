import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MarkdownFilesViewer.css";

const MarkdownFilesViewer = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/markdown-files")
      .then((response) => response.json())
      .then((data) => setFiles(data))
      .catch((error) => console.error("Error fetching file list:", error));
  }, []);

  return (
    <div className="markdown-navigator">
      <h2>Available Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file}>
            <Link to={`/file/${file}`}>{file}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MarkdownFilesViewer;
