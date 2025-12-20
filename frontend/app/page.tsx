"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [canDownload, setCanDownload] = useState(false);

  /* ---------------- ANALYZE ---------------- */
  const handleAnalyze = async () => {
    const cleanedUrl = url.trim();

    if (!cleanedUrl) {
      setStatus("Please paste an Instagram Reel link");
      return;
    }

    try {
      setCanDownload(false);
      setStatus("Analyzing...");

      const res = await fetch(`${API}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanedUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || "Invalid link");
        return;
      }

      setStatus("Reel detected. Choose video or audio.");
      setCanDownload(true);
    } catch (err) {
      console.error(err);
      setStatus("Server error. Try again.");
    }
  };

  /* ---------------- DOWNLOAD VIDEO ---------------- */
  const handleVideoDownload = async () => {
    try {
      setStatus("Downloading video...");

      const res = await fetch(`${API}/api/download/video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        throw new Error("Video download failed");
      }

      const blob = await res.blob(); // ✅ IMPORTANT
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "ReelZy_video.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();

      setStatus("Video downloaded successfully");
    } catch (err) {
      console.error(err);
      setStatus("Server error. Try again.");
    }
  };

  /* ---------------- DOWNLOAD AUDIO ---------------- */
  const handleAudioDownload = async () => {
    try {
      setStatus("Downloading audio...");

      const res = await fetch(`${API}/api/download/audio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        throw new Error("Audio download failed");
      }

      const blob = await res.blob(); // ✅ IMPORTANT
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "ReelZy_audio.mp3";
      document.body.appendChild(a);
      a.click();
      a.remove();

      setStatus("Audio downloaded successfully");
    } catch (err) {
      console.error(err);
      setStatus("Server error. Try again.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-5 px-4 text-center">
      <h1 className="text-3xl font-bold">ReelZy</h1>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste Instagram Reel link"
        className="w-full max-w-md px-4 py-3 border rounded-md outline-none"
      />

      <button
        onClick={handleAnalyze}
        className="px-6 py-3 bg-pink-500 text-white rounded-md font-medium"
      >
        Analyze
      </button>

      {canDownload && (
        <div className="flex gap-4 mt-2">
          <button
            onClick={handleVideoDownload}
            className="px-6 py-2 bg-black text-white rounded-md"
          >
            Download Video
          </button>

          <button
            onClick={handleAudioDownload}
            className="px-6 py-2 border border-pink-500 text-pink-500 rounded-md"
          >
            Download Audio
          </button>
        </div>
      )}

      {status && <p className="text-sm text-gray-600">{status}</p>}
    </main>
  );
}
