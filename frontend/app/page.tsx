"use client";

import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import HowToUse from "./components/HowToUse";
import FAQ from "./components/FAQ";

export default function Home() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [canDownload, setCanDownload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [contentType, setContentType] = useState<"reel" | "post" | null>(null);

  const listenToProgress = (id: string) => {
    let completed = false;

    const eventSource = new EventSource(
      `process.env.NEXT_PUBLIC_API_URL
/api/progress/${id}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.progress) {
        setProgress(Number(data.progress));
      }

      if (data.done && data.file) {
        completed = true;
        eventSource.close();
        setLoading(false);
        window.location.href = `process.env.NEXT_PUBLIC_API_URL
/api/file/${data.file}`;
      }

      if (data.error) {
        completed = true;
        eventSource.close();
        setLoading(false);
        setStatus(data.error);
      }
    };

    eventSource.onerror = () => {
      if (!completed) {
        eventSource.close();
        setLoading(false);
        setStatus("Download failed. Try again.");
      }
    };
  };

  const handleDownload = async () => {
    const cleanedUrl = url.trim();

    if (!cleanedUrl) {
      setStatus("Please paste an Instagram link");
      return;
    }

    setStatus("Analyzing link...");
    setCanDownload(false);

    try {
      const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/analyze`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: cleanedUrl }),
  }
);

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanedUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || "Invalid link");
        return;
      }

      setContentType(data.type);
      setCanDownload(true);

      if (data.type === "reel") {
        setStatus("Reel detected. Choose video or audio.");
      } else {
        setStatus("Post detected. Video download supported.");
      }
    } catch {
      setStatus("Server error. Try again.");
    }
  };

  const handleVideoDownload = async (endpoint: "video" | "post" | "audio") => {
    const cleanedUrl = url.trim();
    if (!cleanedUrl) return;

    const id = uuidv4();
    setLoading(true);
    setProgress(0);

    listenToProgress(id);

    await fetch(`process.env.NEXT_PUBLIC_API_URL
/api/download/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: cleanedUrl, id }),
    });
  };

  const handleAudioDownload = async () => {
    handleVideoDownload("audio");
  };

  return (
    <main className="min-h-screen flex flex-col">
      <section className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Download Reels. Fast. Clean. Free.
        </h2>

        <div className="w-full max-w-xl flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste Instagram Reel or Post link here..."
            className="flex-1 px-4 py-3 border rounded-md outline-none
                       focus:ring-2 focus:ring-pink-500
                       bg-white dark:bg-black"
          />

          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-pink-500 text-white rounded-md font-medium"
          >
            Analyze
          </button>
        </div>

        {status && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {status}
          </p>
        )}

        {loading && (
          <div className="w-full max-w-xl mt-4">
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full">
              <div
                className="h-full bg-pink-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Downloading… {progress}%
            </p>
          </div>
        )}

        {/* REELS */}
        {canDownload && contentType === "reel" && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => handleVideoDownload("video")}
              className="px-6 py-2 rounded-md bg-black text-white"
            >
              Download Video
            </button>

            <button
              onClick={handleAudioDownload}
              className="px-6 py-2 rounded-md border border-pink-500 text-pink-500"
            >
              Download Audio
            </button>
          </div>
        )}

        {/* POSTS */}
        {canDownload && contentType === "post" && (
          <>
            {/* COMING SOON MESSAGE */}
            <div className="mt-4 text-sm text-yellow-500">
              📸 Post image downloads are <b>coming soon</b>.
            </div>

            {/* DISABLED IMAGE BUTTON */}
            <button
              disabled
              className="mt-2 px-6 py-2 rounded-md border border-dashed
                         border-gray-400 text-gray-400 cursor-not-allowed"
            >
              Download Images (Coming Soon)
            </button>

            {/* POST VIDEO DOWNLOAD */}
            <div className="mt-4">
              <button
                onClick={() => handleVideoDownload("post")}
                className="px-6 py-2 rounded-md bg-pink-500 text-white hover:scale-105 transition"
              >
                Download Post Video
              </button>
            </div>
          </>
        )}

        <p className="text-sm text-gray-500 mt-6">
          Supports public Instagram Reels & Video Posts
        </p>
      </section>

      <HowToUse />
      <FAQ />
    </main>
  );
}
