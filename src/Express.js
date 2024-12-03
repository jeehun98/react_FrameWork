const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// 마크다운 파일 경로
const markdownFolder = path.join(__dirname, "public/docs");

// 폴더 및 파일 계층 구조 반환 함수
const getDirectoryStructure = (dirPath) => {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });

  return items.map((item) => {
    const itemPath = path.join(dirPath, item.name);
    if (item.isDirectory()) {
      return {
        name: item.name,
        type: "directory",
        children: getDirectoryStructure(itemPath),
      };
    } else if (item.isFile() && item.name.endsWith(".md")) {
      return { name: item.name, type: "file" };
    }
  });
};

// 계층 구조 API
app.get("/api/markdown-structure", (req, res) => {
  try {
    console.log("Request received at /api/markdown-structure");
    const structure = getDirectoryStructure(markdownFolder);
    console.log("Structure generated:", structure);
    res.json(structure);
  } catch (err) {
    console.error("Error processing /api/markdown-structure:", err);
    res.status(500).send("Error reading directory structure");
  }
});

// 특정 파일 내용 반환 API
app.get("/api/markdown-files/:fileName", (req, res) => {
  const filePath = path.join(markdownFolder, req.params.fileName);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(404).send("File not found");
    }
    res.send(data);
  });
});

// 정적 파일 제공
app.use(express.static("public"));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
