import React from "react";
import { useParams, Link } from "react-router-dom";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

const FileDetail = ({ files }) => {
  const { fileName } = useParams();
  const file = files.find((f) => f.fileName === fileName);

  if (!file) {
    return <div>File not found</div>;
  }

  return (
    <div>
      <h2>{file.fileName}</h2>
      <p style={{ fontStyle: "italic", color: "#555" }}>{file.description}</p> {/* 설명 추가 */}
      <SyntaxHighlighter language="javascript" style={docco}>
        {file.code}
      </SyntaxHighlighter>
      <Link to="/">Back to file list</Link>
    </div>
  );
};

export default FileDetail;
