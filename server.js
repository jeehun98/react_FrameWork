const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// 마크다운 파일 경로
const markdownFolder = path.join(__dirname, "public/docs/markdownfiles");

// CORS 설정 (모든 도메인 허용)
app.use(cors());

// API: 마크다운 파일 목록 반환
app.get("/api/markdown-files", (req, res) => {
  fs.readdir(markdownFolder, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).send("Error reading directory");
    }
    const markdownFiles = files.filter((file) => file.endsWith(".md"));
    res.json(markdownFiles);
  });
});

// 정적 파일 제공
app.use("/docs/markdownfiles", express.static(markdownFolder));

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
