import React from "react";
import { Link } from "react-router-dom";

const FileViewer = ({ files }) => {
  return (
    <div>
      <h1>Code Files</h1>
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
