import React from "react";
import { Link } from "react-router-dom";

const FileViewer = ({ files }) => {
  return (
    <div>
      <h1>Code Files</h1>
      <ul>
        {files.map((file, index) => (
          <li key={index} style={{ marginBottom: "16px" }}>
            <Link to={`/file/${file.fileName}`} style={{ fontWeight: "bold" }}>
              {file.fileName}
            </Link>
            <p style={{ margin: "4px 0", color: "#555" }}>{file.description}</p> {/* 간략 설명 추가 */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileViewer;
