import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { YtDlpWrap } from "yt-dlp-wrap"; // ✅ FIXED IMPORT

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ---------------- PATH SETUP ---------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOWNLOAD_DIR = path.join(__dirname, "downloads");
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

/* ---------------- YT-DLP ---------------- */
const ytDlp = new YtDlpWrap();

/* ---------------- UTIL ---------------- */
function nextFile(prefix, ext) {
  const files = fs.readdirSync(DOWNLOAD_DIR);
  const count = files.filter(f => f.startsWith(prefix)).length + 1;
  return `${prefix}_${count}.${ext}`;
}

/* ---------------- HEALTH ---------------- */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

/* ---------------- VIDEO ---------------- */
app.post("/api/video", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).send("URL required");

  const fileName = nextFile("ReelZy_video", "mp4");
  const outputPath = path.join(DOWNLOAD_DIR, fileName);

  try {
    await ytDlp.exec([
      url,
      "-f", "mp4",
      "-o", outputPath
    ]);

    res.download(outputPath, fileName, () => {
      fs.unlink(outputPath, () => {});
    });
  } catch (err) {
    console.error("VIDEO ERROR:", err);
    res.status(500).send("Video download failed");
  }
});

/* ---------------- AUDIO ---------------- */
app.post("/api/audio", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).send("URL required");

  const fileName = nextFile("ReelZy_audio", "mp3");
  const outputPath = path.join(DOWNLOAD_DIR, fileName);

  try {
    await ytDlp.exec([
      url,
      "-x",
      "--audio-format", "mp3",
      "-o", outputPath
    ]);

    res.download(outputPath, fileName, () => {
      fs.unlink(outputPath, () => {});
    });
  } catch (err) {
    console.error("AUDIO ERROR:", err);
    res.status(500).send("Audio download failed");
  }
});

/* ---------------- START ---------------- */
app.listen(PORT, () => {
  console.log("🚀 ReelZy backend running on port", PORT);
});
