import React from "react";
import { Link } from "react-router-dom";

const FileViewer = ({ files }) => {
  return (
    <div>
      <h1>Code Files</h1>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            {/* 파일 이름 클릭 시 상세 페이지로 이동 */}
            <Link to={`/file/${encodeURIComponent(file.fileName)}`}>
              {file.fileName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileViewer;
