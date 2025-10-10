import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../web")));

// Upload endpoint
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ message: "File uploaded successfully!" });
});

// Handle all routes — send index.html for frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../web/index.html"));
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
