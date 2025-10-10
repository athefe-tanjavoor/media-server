import express from "express";
import multer from "multer";
import path from "path";

const app = express();

// === Container upload folder ===
const uploadDir = "/app/uploads"; // This maps to host folder

// === Multer Storage ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// === Serve Frontend ===
app.use(express.static(path.join(process.cwd(), "web")));

// === Serve uploaded files ===
app.use("/uploads", express.static(uploadDir));

// === Upload Endpoint ===
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  res.json({
    message: "File uploaded successfully and stored on Proxmox!",
    filename: req.file.filename,
    path: `${uploadDir}/${req.file.filename}`,
    url: `/uploads/${req.file.filename}`,
  });
});

// === List Uploaded Files ===
app.get("/list-uploads", (req, res) => {
  import("fs").then((fs) => {
    fs.readdir(uploadDir, (err, files) => {
      if (err)
        return res.status(500).json({ message: "Cannot read uploads folder" });
      const fileList = files.map((f) => ({ name: f, url: `/uploads/${f}` }));
      res.json(fileList);
    });
  });
});

// === HTML Page to View Uploads ===
app.get("/uploads-page", (req, res) => {
  import("fs").then((fs) => {
    fs.readdir(uploadDir, (err, files) => {
      if (err) return res.send("Cannot read uploads folder");

      const fileLinks = files
        .map((f) => `<li><a href="/uploads/${f}" target="_blank">${f}</a></li>`)
        .join("\n");

      res.send(`
        <!DOCTYPE html>
        <html>
          <head><title>Uploaded Files</title></head>
          <body>
            <h1>Uploaded Files</h1>
            <ul>${fileLinks}</ul>
            <a href="/">Go Back to Upload Form</a>
          </body>
        </html>
      `);
    });
  });
});

// === Frontend Fallback ===
app.get(/^\/.*$/, (req, res) => {
  res.sendFile(path.join(process.cwd(), "web/index.html"));
});

// === Start Server ===
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
