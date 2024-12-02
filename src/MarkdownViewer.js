import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw"; // HTML 파싱
import rehypeHighlight from "rehype-highlight"; // 코드 하이라이트
import "highlight.js/styles/github.css"; // 코드 하이라이트 테마

const MarkdownViewer = ({ fileName }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    // Markdown 파일을 읽어오는 fetch 호출
    fetch(`/docs/${fileName}.md`)
      .then((response) => response.text())
      .then((text) => setContent(text))
      .catch((error) => console.error("Markdown 파일 읽기 오류:", error));
  }, [fileName]);

  return (
    <div>
      <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
