const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// 마크다운 파일 경로
const markdownFolder = path.join(__dirname, "public/docs");

// 파일 목록 API
app.get("/api/markdown-files", (req, res) => {
  fs.readdir(markdownFolder, (err, files) => {
    if (err) {
      return res.status(500).send("Error reading directory");
    }
    const markdownFiles = files.filter((file) => file.endsWith(".md"));
    res.json(markdownFiles);
  });
});

app.use(express.static("public"));
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
