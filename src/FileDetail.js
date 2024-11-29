import React from "react";
import { useParams, Link } from "react-router-dom";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

const FileDetail = ({ files }) => {
  const { fileName } = useParams(); // URL에서 파일 이름 가져오기
  const file = files.find((f) => f.fileName === fileName);

  if (!file) {
    return <div>File not found</div>;
  }

  return (
    <div>
      <h2>{file.fileName}</h2>
      <SyntaxHighlighter language="javascript" style={docco}>
        {file.code}
      </SyntaxHighlighter>
      <Link to="/">Back to file list</Link>
    </div>
  );
};

export default FileDetail;
