import React from "react";
import { useParams, Link } from "react-router-dom";
import "./styles/FileDetail.css";

const FileDetail = ({ files }) => {
  const { fileName } = useParams();
  const file = files.find((f) => f.fileName === fileName);

  if (!file) {
    return <div>File not found</div>;
  }

  return (
    <div className="FileDetail">
      <h2>{file.fileName}</h2>
      <p>{file.description}</p>
      <pre>
        {file.code.map((line, index) => (
          <div
            key={index}
            style={{
              backgroundColor: line.highlight ? "#ffe4b2" : "transparent", // 하이라이트 배경색
              padding: "2px 0",
            }}
          >
            {line.link ? (
              <a
                href={line.link}
                style={{
                  color: line.highlight ? "darkred" : "blue",
                  textDecoration: "underline",
                }}
              >
                {line.text}
              </a>
            ) : (
              line.text
            )}
          </div>
        ))}
      </pre>
      <Link to="/">Back to file list</Link>
    </div>
  );
};

export default FileDetail;
