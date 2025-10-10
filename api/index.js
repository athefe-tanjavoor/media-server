const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = "/home/skalelit/uploads/media-server";

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ message: "File uploaded successfully", file: req.file });
});

// Serve uploaded files
app.use("/uploads", express.static(UPLOAD_DIR));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  