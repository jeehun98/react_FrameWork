import React from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

const CodeBlock = ({ fileName, code }) => {
  return (
    <div style={{ marginBottom: "24px" }}>
      <h3>{fileName}</h3>
      <SyntaxHighlighter language="javascript" style={docco} showLineNumbers>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
