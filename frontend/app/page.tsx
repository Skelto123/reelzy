"use client";

import { useState, useRef } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [canDownload, setCanDownload] = useState(false);

  const videoFormRef = useRef<HTMLFormElement>(null);
  const audioFormRef = useRef<HTMLFormElement>(null);

  /* ---------------- ANALYZE ---------------- */
  const handleAnalyze = async () => {
    const cleanedUrl = url.trim();
    if (!cleanedUrl) {
      setStatus("Please paste an Instagram Reel link");
      return;
    }

    try {
      setCanDownload(false);
      setStatus("Analyzing…");

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
    } catch {
      setStatus("Server waking up… try again in 5 seconds.");
    }
  };

  /* ---------------- DOWNLOAD (NATIVE POST) ---------------- */
  const downloadVideo = () => {
    setStatus("Downloading video…");
    videoFormRef.current?.submit();
  };

  const downloadAudio = () => {
    setStatus("Downloading audio…");
    audioFormRef.current?.submit();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-5 px-4 text-center">
      <h1 className="text-3xl font-bold">ReelZy</h1>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste Instagram Reel link"
        className="w-full max-w-md px-4 py-3 border rounded-md"
      />

      <button
        onClick={handleAnalyze}
        className="px-6 py-3 bg-pink-500 text-white rounded-md"
      >
        Analyze
      </button>

      {canDownload && (
        <div className="flex gap-4">
          {/* VIDEO FORM */}
          <form
            ref={videoFormRef}
            method="POST"
            action={`${API}/api/download/video`}
          >
            <input type="hidden" name="url" value={url} />
            <button
              type="button"
              onClick={downloadVideo}
              className="px-6 py-2 bg-black text-white rounded-md"
            >
              Download Video
            </button>
          </form>

          {/* AUDIO FORM */}
          <form
            ref={audioFormRef}
            method="POST"
            action={`${API}/api/download/audio`}
          >
            <input type="hidden" name="url" value={url} />
            <button
              type="button"
              onClick={downloadAudio}
              className="px-6 py-2 border border-pink-500 text-pink-500 rounded-md"
            >
              Download Audio
            </button>
          </form>
        </div>
      )}

      {status && <p className="text-sm text-gray-600">{status}</p>}
    </main>
  );
}
