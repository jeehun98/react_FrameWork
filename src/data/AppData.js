const AppData = {
    fileName: "App.js",
    description: "This is the main entry point of the React application.??",
    code: [
      { text: 'import React from "react";', highlight: true },
      { text: 'import FileViewer from "./FileViewer";', highlight: false },
      { text: 'import files from "./FilesData";', highlight: false },
      { text: "", highlight: false },
      { text: "const App = () => {", highlight: false },
      { text: "  return (", highlight: false },
      { text: '    <div>', highlight: false },
      { text: '      <h1>Code Files Viewer</h1>', highlight: true },
      { text: "      <FileViewer files={files} />", highlight: true, link: "/docs/FileViewer" },
      { text: "    </div>", highlight: false },
      { text: "  );", highlight: false },
      { text: "};", highlight: false },
      { text: "", highlight: false },
      { text: "export default App;", highlight: true },
    ],
  };
  
  export default AppData;
  