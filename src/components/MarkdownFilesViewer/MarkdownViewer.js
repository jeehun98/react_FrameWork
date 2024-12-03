import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const MarkdownViewer = () => {
  const { fileName } = useParams();
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/markdown-files/${fileName}`)
      .then((response) => response.text())
      .then((data) => setContent(data))
      .catch((error) => console.error("Error fetching file content:", error));
  }, [fileName]);

  return (
    <div>
      <h2>{fileName}</h2>
      <pre>{content}</pre>
    </div>
  );
};

export default MarkdownViewer;
