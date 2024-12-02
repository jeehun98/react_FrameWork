import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw"; // HTML 파싱
import rehypeHighlight from "rehype-highlight"; // 코드 하이라이트
import "highlight.js/styles/github.css"; // 코드 하이라이트 테마
import "./MarkdownFilesViewer.css"; // 스타일 파일 추가

const MarkdownFilesViewer = () => {
  const [files, setFiles] = useState([]); // 파일 목록
  const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일
  const [content, setContent] = useState(""); // 파일 내용
  const [error, setError] = useState(""); // 오류 메시지 상태

  useEffect(() => {
    // 파일 목록 가져오기
    fetch("http://localhost:5000/api/markdown-files")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched files:", data); // 디버그용 파일 목록 출력
        setFiles(data);
      })
      .catch((err) => {
        console.error("Error fetching file list:", err);
        setError("Unable to fetch file list. Please try again later.");
      });
  }, []);

  const fetchFileContent = (fileName) => {
    // 선택된 파일 내용 가져오기
    fetch(`http://localhost:5000/docs/markdownfiles/${fileName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        console.log("Fetched content:", text); // 디버그용 파일 내용 출력
        setContent(text);
        setSelectedFile(fileName);
      })
      .catch((err) => {
        console.error("Error fetching file content:", err);
        setContent("Unable to fetch file content. Please try again later.");
      });
  };

  return (
    <div className="markdown-viewer">
      <h1 className="title">Markdown Files</h1>

      {error && <p className="error">{error}</p>} {/* 오류 메시지 표시 */}

      <div className="file-list">
        <h2>Available Files</h2>
        {files.length > 0 ? (
          <ul>
            {files.map((file) => (
              <li key={file}>
                <button
                  onClick={() => fetchFileContent(file)}
                  className="file-button"
                >
                  {file}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No files available. Please check the server or add markdown files.</p>
        )}
      </div>

      {selectedFile && (
        <div className="markdown-content">
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
