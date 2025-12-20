import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import YtDlpWrap from "yt-dlp-wrap";

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------------- BASIC SETUP ---------------- */
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOWNLOAD_DIR = path.join(__dirname, "downloads");
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

const ytDlp = new YtDlpWrap();

/* ---------------- AUTO DELETE ---------------- */
const AUTO_DELETE_TIME = 10 * 60 * 1000; // 10 min

function scheduleFileDeletion(filePath) {
  setTimeout(() => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, () => {
        console.log("🗑️ Deleted:", path.basename(filePath));
      });
    }
  }, AUTO_DELETE_TIME);
}

/* ---------------- HELPERS ---------------- */
function getNextFileNumber(prefix) {
  const files = fs.readdirSync(DOWNLOAD_DIR);
  const nums = files
    .filter((f) => f.startsWith(prefix))
    .map((f) => parseInt(f.split("_")[2]))
    .filter(Boolean);
  return nums.length ? Math.max(...nums) + 1 : 1;
}

/* ---------------- HEALTH ---------------- */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "ReelZy backend is running" });
});

/* ---------------- ANALYZE (FAST & SAFE) ---------------- */
app.post("/api/analyze", (req, res) => {
  console.log("ANALYZE HIT:", req.body);

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  if (url.includes("instagram.com/reel/")) {
    return res.json({
      status: "ok",
      type: "reel",
      actions: ["video", "audio"],
    });
  }

  if (url.includes("instagram.com/p/")) {
    return res.json({
      status: "ok",
      type: "post",
      actions: ["video"],
    });
  }

  return res.status(400).json({ error: "Invalid Instagram URL" });
});

/* ---------------- DOWNLOAD VIDEO ---------------- */
app.post("/api/download/video", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL required" });

  try {
    const count = getNextFileNumber("ReelZy_video");
    const fileName = `ReelZy_video_${count}.mp4`;
    const outputPath = path.join(DOWNLOAD_DIR, fileName);

    await ytDlp.exec([
      url,
      "-f", "mp4",
      "-o", outputPath
    ]);

    scheduleFileDeletion(outputPath);
    res.download(outputPath);
  } catch (err) {
    console.error("VIDEO ERROR:", err);
    res.status(500).json({ error: "Video download failed" });
  }
});

/* ---------------- DOWNLOAD AUDIO ---------------- */
app.post("/api/download/audio", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL required" });

  try {
    const count = getNextFileNumber("ReelZy_audio");
    const fileName = `ReelZy_audio_${count}.mp3`;
    const outputPath = path.join(DOWNLOAD_DIR, fileName);

    await ytDlp.exec([
      url,
      "-x",
      "--audio-format", "mp3",
      "-o", outputPath
    ]);

    scheduleFileDeletion(outputPath);
    res.download(outputPath);
  } catch (err) {
    console.error("AUDIO ERROR:", err);
    res.status(500).json({ error: "Audio download failed" });
  }
});

/* ---------------- POST VIDEO ---------------- */
app.post("/api/download/post", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL required" });

  try {
    const count = getNextFileNumber("ReelZy_post");
    const fileName = `ReelZy_post_${count}.mp4`;
    const outputPath = path.join(DOWNLOAD_DIR, fileName);

    await ytDlp.exec([
      url,
      "-f", "mp4",
      "-o", outputPath
    ]);

    scheduleFileDeletion(outputPath);
    res.download(outputPath);
  } catch (err) {
    console.error("POST ERROR:", err);
    res.status(500).json({ error: "Post download failed" });
  }
});

/* ---------------- START ---------------- */
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
