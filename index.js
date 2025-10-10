import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();

// Proxmox host path
const uploadDir = "/home/skalelit/uploads/media-server/uploads";

// Ensure folder exists
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Serve frontend
app.use(express.static(path.join(__dirname, "web")));

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({
    message: "File uploaded successfully and stored on Proxmox!",
    filename: req.file.filename,
    path: `${uploadDir}/${req.file.filename}`,
  });
});

// Catch-all route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "web/index.html"));
});

// Listen on 0.0.0.0
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
