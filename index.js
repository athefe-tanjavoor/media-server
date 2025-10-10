import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();

// Host path on Proxmox for uploads
const uploadDir = "/home/skalelit/uploads/media-server/uploads";

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Serve static frontend files
app.use(express.static(path.join(__dirname, "web")));

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully and stored on Proxmox!",
    filename: req.file.filename,
    path: `${uploadDir}/${req.file.filename}`,
  });
});

// Handle all frontend routes
app.get(/^\/.*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "web/index.html"));
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
