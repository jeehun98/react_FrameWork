const FileViewerData = {
    fileName: "FileViewer.js",
    description: "This component renders the list of files with links to their details.",
    code: [
      { text: 'import React from "react";', highlight: false },
      { text: 'import { Link } from "react-router-dom";', highlight: true },
      { text: "", highlight: false },
      { text: "const FileViewer = ({ files }) => {", highlight: false },
      { text: "  return (", highlight: false },
      { text: "    <div>", highlight: false },
      { text: "      <h1>Code Files</h1>", highlight: true },
      { text: "      <ul>", highlight: false },
      { text: "        {files.map((file, index) => (", highlight: false },
      { text: "          <li key={index}>", highlight: false },
      { text: "            <Link to={`/file/${file.fileName}`}>", highlight: true, link: "/docs/fileName" },
      { text: "              {file.fileName}", highlight: true },
      { text: "            </Link>", highlight: false },
      { text: "          </li>", highlight: false },
      { text: "        ))}", highlight: false },
      { text: "      </ul>", highlight: false },
      { text: "    </div>", highlight: false },
      { text: "  );", highlight: false },
      { text: "};", highlight: false },
      { text: "", highlight: false },
      { text: "export default FileViewer;", highlight: false },
    ],
  };
  
  export default FileViewerData;
  