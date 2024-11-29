import React from "react";
import { useParams, Link } from "react-router-dom";

const FileDetail = ({ files }) => {
  const { fileName } = useParams();
  const file = files.find((f) => f.fileName === fileName);

  if (!file) {
    return <div>File not found</div>;
  }

  return (
    <div>
      <h2>{file.fileName}</h2>
      <p style={{ fontStyle: "italic", color: "#555" }}>{file.description}</p>
      <pre
        style={{
          backgroundColor: "#f4f4f4",
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        {file.code.map((line, index) => (
          <div
            key={index}
            style={{
              backgroundColor: line.highlight ? "#ffe4b2" : "transparent",
              padding: "2px 0",
            }}
          >
            {line.link ? (
              <Link
                to={line.link}
                style={{
                  color: "blue",
                  textDecoration: "underline",
                }}
              >
                {line.text}
              </Link>
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
