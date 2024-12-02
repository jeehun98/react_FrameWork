import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

const MarkdownContent = () => {
  const { fileName } = useParams(); // URL의 파일명을 가져옴
  const [content, setContent] = useState("");

  useEffect(() => {
    if (fileName) {
      fetch(`http://localhost:5000/docs/markdownfiles/${fileName}`)
        .then((response) => response.text())
        .then((text) => setContent(text))
        .catch((error) => console.error("Error fetching file content:", error));
    }
  }, [fileName]);

  return (
    <div className="markdown-content">
      <h2>{fileName || "Select a file to view"}</h2>
      <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
