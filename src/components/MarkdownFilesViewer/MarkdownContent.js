import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./MarkdownContent.css";

const MarkdownContent = () => {
  const { fileName } = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/markdown-files/${encodeURIComponent(fileName)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching file: ${response.statusText}`);
        }
        return response.text();
      })
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [fileName]);

  if (loading) {
    return <div className="markdown-content">Loading...</div>;
  }

  if (error) {
    return (
      <div className="markdown-content">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="markdown-content">
      <h2>{fileName}</h2>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
