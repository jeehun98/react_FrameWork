const files = [
    {
      fileName: "App.js",
      description: "This is the main entry point of the React application.",
      code: `
  import React from "react";
  import FileViewer from "./FileViewer";
  import files from "./FilesData";
  
  const App = () => {
    return (
      <div>
        <h1>Code Files Viewer</h1>
        <FileViewer files={files} />
      </div>
    );
  };
  
  export default App;
      `,
    },
    {
      fileName: "FileViewer.js",
      description: "This component renders the list of files with links to their details.",
      code: `
  import React from "react";
  import { Link } from "react-router-dom";
  
  const FileViewer = ({ files }) => {
    return (
      <div>
        <h1>Code Files</h1>
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              <Link to={\`/file/\${file.fileName}\`}>
                {file.fileName}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default FileViewer;
      `,
    },
    {
      fileName: "FileDetail.js",
      description: "This component shows the detailed code and description of a file.",
      code: `
  import React from "react";
  import { useParams, Link } from "react-router-dom";
  import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
  import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
  
  const FileDetail = ({ files }) => {
    const { fileName } = useParams();
    const file = files.find((f) => f.fileName === fileName);
  
    if (!file) {
      return <div>File not found</div>;
    }
  
    return (
      <div>
        <h2>{file.fileName}</h2>
        <p>{file.description}</p> {/* 설명 출력 */}
        <SyntaxHighlighter language="javascript" style={docco}>
          {file.code}
        </SyntaxHighlighter>
        <Link to="/">Back to file list</Link>
      </div>
    );
  };
  
  export default FileDetail;
      `,
    },
  ];
  
  export default files;
  