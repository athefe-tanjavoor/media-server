🗂️ Media Upload Server (Express + Multer)

A powerful and lightweight Node.js server for uploading and managing multiple files — including .exe, .msi, .zip, images, videos, and more.
Built with Express.js, Multer, and supports up to 4GB per file.

🚀 Features

📤 Upload multiple files at once (up to 50 files per request).

🧩 Supports all file types (.exe, .msi, .zip, .mp4, .png, etc.).

🗄️ Files automatically saved in /uploads.

🌐 Static file server — access uploaded files via direct URLs.

💾 Auto-generated file list and elegant HTML viewer page.

⚙️ Fully configurable upload path and size limits.

📁 Project Structure
📦 media-server
┣ 📂 web/ # Frontend folder (optional)
┣ 📂 uploads/ # All uploaded files will appear here
┣ 📜 server.js # Main Express server
┣ 📜 package.json
┗ 📜 README.md

🧠 Prerequisites

Make sure you have:

Node.js ≥ 18

npm

⚙️ Installation

# Clone the repository

git clone https://github.com/yourusername/media-server.git
cd media-server

# Install dependencies

npm install

🏃 Run the Server
node server.js

By default, the server runs at
👉 http://localhost:4000

📤 Upload Files
Endpoint
POST /upload

Form Field Name
files

Example using cURL:
curl -X POST -F "files=@example.zip" -F "files=@setup.msi" http://localhost:4000/upload

✅ Response:

{
"message": "Files uploaded successfully!",
"files": [
{
"filename": "1697305612345-example.zip",
"url": "/uploads/1697305612345-example.zip"
}
]
}

🌍 Browse Uploaded Files

You can visually browse and download uploaded files at:

➡️ http://localhost:4000/uploads-page

or fetch a list of all files via JSON API:

GET /list-uploads

Example response:

[
{ "name": "1733428800000-report.pdf", "url": "/uploads/1733428800000-report.pdf" },
{ "name": "1733428801000-setup.exe", "url": "/uploads/1733428801000-setup.exe" }
]

🧰 Configuration

uploadDir Directory where files are saved /app/uploads
limit.fileSize Maximum upload size per file 4GB
array("files", 50) Max number of files per upload 50
⚡ Example Frontend (optional)

Create a simple HTML file inside /web/index.html:

<form action="/upload" method="POST" enctype="multipart/form-data">
  <h2>Upload Files</h2>
  <input type="file" name="files" multiple />
  <button type="submit">Upload</button>
</form>
<a href="/uploads-page">View Uploaded Files</a>

🧾 License

This project is licensed under the MIT License — feel free to modify and use it.

👨‍💻 Author

Rankraze Media Server Project (2025)
Developed by Tanjavoor Athefe 💡
