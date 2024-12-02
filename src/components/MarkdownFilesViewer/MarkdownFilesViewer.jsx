import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw"; // HTML 파싱
import rehypeHighlight from "rehype-highlight"; // 코드 하이라이트
import "highlight.js/styles/github.css"; // 코드 하이라이트 테마

const MarkdownFilesViewer = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    // 파일 목록 가져오기
    fetch("/api/markdown-files")
      .then((response) => response.json())
      .then((data) => setFiles(data))
      .catch((error) => console.error("Error fetching file list:", error));
  }, []);

  const fetchFileContent = (fileName) => {
    // 선택된 파일 내용 가져오기
    fetch(`/docs/${fileName}`)
      .then((response) => response.text())
      .then((text) => {
        setContent(text);
        setSelectedFile(fileName);
      })
      .catch((error) => console.error("Error fetching file content:", error));
  };

  return (
    <div>
      <h1>Markdown Files</h1>
      <ul>
        {files.map((file) => (
          <li key={file}>
            <button onClick={() => fetchFileContent(file)}>{file}</button>
          </li>
        ))}
      </ul>
      {selectedFile && (
        <div>
          <h2>{selectedFile}</h2>
          <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeHighlight]}>
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default MarkdownFilesViewer;
