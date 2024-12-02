import React from "react";
import { Link } from "react-router-dom";
import "./styles/FileViewer.css";

const FileViewer = ({ files }) => {
  return (
    <div className="FileViewer">
      <h2>Available Files</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            <Link to={`/file/${file.fileName}`}>{file.fileName}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileViewer;
