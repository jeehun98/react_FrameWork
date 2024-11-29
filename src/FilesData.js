const files = [
    {
      fileName: "App.js",
      code: `
  import React from "react";
  import FileViewer from "./FileViewer";
  import files from "./FilesData";
  
  const App = () => {
    return (
      <div>
        <h1>Code Files</h1>
        <FileViewer files={files} />
      </div>
    );
  };
  
  export default App;
      `,
    },
    {
      fileName: "CodeViewer.js",
      code: `
  import React from "react";
  
  const CodeViewer = () => {
    return (
      <div>
        <h2>Code Viewer Component</h2>
      </div>
    );
  };
  
  export default CodeViewer;
      `,
    },
  ];
  
  export default files;
  