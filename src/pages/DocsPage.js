import React from "react";
import { useParams, Link } from "react-router-dom";

const DocsPage = () => {
  const { componentName } = useParams(); // URL에서 컴포넌트 이름 가져오기

  // 문서 데이터: 컴포넌트 이름별 설명
  const docs = {
    FileViewer: {
      title: "FileViewer Component",
      description:
        "The FileViewer component renders a list of files with links to their detailed pages. It accepts a `files` prop containing file metadata.",
      example: `
        import React from "react";
        import { Link } from "react-router-dom";

        const FileViewer = ({ files }) => (
          <div>
            <h1>Code Files</h1>
            <ul>
              {files.map((file) => (
                <li key={file.fileName}>
                  <Link to={\`/file/\${file.fileName}\`}>{file.fileName}</Link>
                </li>
              ))}
            </ul>
          </div>
        );

        export default FileViewer;
      `,
    },
    FileDetail: {
      title: "FileDetail Component",
      description:
        "The FileDetail component shows detailed information about a selected file. It uses the `files` prop to find and display the selected file's code and description.",
      example: `
        import React from "react";
        import { useParams } from "react-router-dom";

        const FileDetail = ({ files }) => {
          const { fileName } = useParams();
          const file = files.find((f) => f.fileName === fileName);

          return (
            <div>
              <h2>{file?.fileName}</h2>
              <p>{file?.description}</p>
              <pre>{file?.code}</pre>
            </div>
          );
        };

        export default FileDetail;
      `,
    },
  };

  const doc = docs[componentName]; // 컴포넌트 이름에 해당하는 문서 가져오기

  if (!doc) {
    return <div>Documentation not found for {componentName}</div>;
  }

  return (
    <div>
      <h1>{doc.title}</h1>
      <p>{doc.description}</p>
      <pre
        style={{
          backgroundColor: "#f4f4f4",
          padding: "16px",
          borderRadius: "8px",
          overflowX: "auto",
        }}
      >
        {doc.example}
      </pre>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default DocsPage;
