import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MarkdownFilesViewer.css";

const MarkdownFilesViewer = () => {
  const [structure, setStructure] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/markdown-structure")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching structure: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => setStructure(data))
      .catch((error) => {
        console.error(error);
        setError(error.message);
      });
  }, []);

  const renderStructure = (nodes) => (
    <ul>
      {nodes.map((node, index) => (
        <li key={`${node.name}-${index}`}>
          {node.type === "file" ? (
            <Link to={`/file/${encodeURIComponent(node.name)}`}>{node.name}</Link>
          ) : (
            <details>
              <summary>{node.name}</summary>
              {node.children && renderStructure(node.children)}
            </details>
          )}
        </li>
      ))}
    </ul>
  );

  if (error) {
    return <div className="markdown-files">Error: {error}</div>;
  }

  if (!structure || structure.length === 0) {
    return <div className="markdown-files">Loading...</div>;
  }

  return <div className="markdown-files">{renderStructure(structure)}</div>;
};

export default MarkdownFilesViewer;
