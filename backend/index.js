import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const app = express();
const PORT = 5000;

/* ---------------- BASIC SETUP ---------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOWNLOAD_DIR = path.join(__dirname, "downloads");
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

/* ---------------- AUTO DELETE ---------------- */
const AUTO_DELETE_TIME = 10 * 60 * 1000; // 10 minutes

function scheduleFileDeletion(filePath) {
  setTimeout(() => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, () => {
        console.log("🗑️ Auto-deleted:", path.basename(filePath));
      });
    }
  }, AUTO_DELETE_TIME);
}

/* ---------------- HELPERS ---------------- */
function getNextFileNumber(prefix) {
  const files = fs.readdirSync(DOWNLOAD_DIR);
  const nums = files
    .filter((f) => f.startsWith(prefix))
    .map((f) => {
      const m = f.match(/_(\d+)/);
      return m ? parseInt(m[1]) : 0;
    })
    .filter((n) => n > 0);

  return nums.length ? Math.max(...nums) + 1 : 1;
}

/* ---------------- HEALTH ---------------- */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "ReelZy backend is running" });
});

/* ---------------- ANALYZE ---------------- */
app.post("/api/analyze", (req, res) => {
  console.log("ANALYZE HIT:", req.body);
  console.error("ANALYZE ERROR:", error);
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const isReel = url.includes("instagram.com/reel/");
  const isPost = url.includes("instagram.com/p/");

  if (!isReel && !isPost) {
    return res.status(400).json({ error: "Invalid Instagram URL" });
  }

  return res.json({
    status: "ok",
    type: isReel ? "reel" : "post",
    actions: isReel ? ["video", "audio"] : ["video"],
  });
});

app.post("/api/analyze", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  if (url.includes("instagram.com/reel")) {
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
      actions: ["video"],        // 👈 image not supported
      note: "Post image download coming soon",
    });
  }

  return res.status(400).json({
    error: "Unsupported Instagram URL",
  });
});

/* ---------------- SSE PROGRESS ---------------- */
const progressClients = {};

app.get("/api/progress/:id", (req, res) => {
  const { id } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write(`data: ${JSON.stringify({ connected: true })}\n\n`);
  progressClients[id] = res;

  req.on("close", () => {
    delete progressClients[id];
  });
});

/* ---------------- REEL VIDEO ---------------- */
app.post("/api/download/video", (req, res) => {
  const { url, id } = req.body;
  if (!url || !id) return res.status(400).json({ error: "Missing data" });

  const count = getNextFileNumber("ReelZy_video");
  const fileName = `ReelZy_video_${count}.mp4`;
  const outputPath = path.join(DOWNLOAD_DIR, fileName);

  const ytdlp = spawn("yt-dlp", [
    "-f",
    "mp4",
    "-o",
    outputPath,
    "--progress",
    url,
  ]);

  ytdlp.stdout.on("data", (data) => {
    const m = data.toString().match(/(\d{1,3}\.\d)%/);
    if (m && progressClients[id]) {
      progressClients[id].write(
        `data: ${JSON.stringify({ progress: m[1] })}\n\n`
      );
    }
  });

  ytdlp.on("close", () => {
    scheduleFileDeletion(outputPath);

    if (progressClients[id]) {
      progressClients[id].write(
        `data: ${JSON.stringify({ done: true, file: fileName })}\n\n`
      );
      progressClients[id].end();
      delete progressClients[id];
    }
  });

  res.json({ started: true });
});

/* ---------------- REEL AUDIO ---------------- */
app.post("/api/download/audio", (req, res) => {
  const { url, id } = req.body;
  if (!url || !id) return res.status(400).json({ error: "Missing data" });

  const count = getNextFileNumber("ReelZy_audio");
  const fileName = `ReelZy_audio_${count}.mp3`;
  const outputPath = path.join(DOWNLOAD_DIR, fileName);

  const ytdlp = spawn("yt-dlp", [
    "-x",
    "--audio-format",
    "mp3",
    "-o",
    outputPath,
    "--progress",
    url,
  ]);

  ytdlp.stdout.on("data", (data) => {
    const m = data.toString().match(/(\d{1,3}\.\d)%/);
    if (m && progressClients[id]) {
      progressClients[id].write(
        `data: ${JSON.stringify({ progress: m[1] })}\n\n`
      );
    }
  });

  ytdlp.on("close", () => {
    scheduleFileDeletion(outputPath);

    if (progressClients[id]) {
      progressClients[id].write(
        `data: ${JSON.stringify({ done: true, file: fileName })}\n\n`
      );
      progressClients[id].end();
      delete progressClients[id];
    }
  });

  res.json({ started: true });
});

/* ---------------- POST VIDEO ---------------- */
app.post("/api/download/post", (req, res) => {
  const { url, id } = req.body;
  if (!url || !id) return res.status(400).json({ error: "Missing data" });

  const count = getNextFileNumber("ReelZy_post");
  const fileName = `ReelZy_post_${count}.mp4`;
  const outputPath = path.join(DOWNLOAD_DIR, fileName);

  const ytdlp = spawn("yt-dlp", [
    "-f",
    "mp4",
    "-o",
    outputPath,
    "--progress",
    url,
  ]);

  ytdlp.stdout.on("data", (data) => {
    const m = data.toString().match(/(\d{1,3}\.\d)%/);
    if (m && progressClients[id]) {
      progressClients[id].write(
        `data: ${JSON.stringify({ progress: m[1] })}\n\n`
      );
    }
  });

  ytdlp.on("close", () => {
    scheduleFileDeletion(outputPath);

    if (progressClients[id]) {
      progressClients[id].write(
        `data: ${JSON.stringify({ done: true, file: fileName })}\n\n`
      );
      progressClients[id].end();
      delete progressClients[id];
    }
  });

  res.json({ started: true });
});

/* ---------------- FILE SERVE ---------------- */
app.get("/api/file/:name", (req, res) => {
  const filePath = path.join(DOWNLOAD_DIR, req.params.name);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }
  res.download(filePath);
});

/* ---------------- START ---------------- */
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
