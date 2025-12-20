"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");

  const handleAnalyze = async () => {
    const cleanedUrl = url.trim();
    if (!cleanedUrl) {
      setStatus("Please paste an Instagram Reel link");
      return;
    }

    try {
      setStatus("Analyzing...");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analyze`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: cleanedUrl }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || "Invalid link");
        return;
      }

      setStatus("Reel detected. You can download now.");
    } catch {
      setStatus("Server error. Try again.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-3xl font-bold">ReelZy</h1>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste Instagram Reel link"
        className="w-full max-w-md px-4 py-2 border rounded"
      />

      <button
        onClick={handleAnalyze}
        className="px-6 py-2 bg-pink-500 text-white rounded"
      >
        Analyze
      </button>

      {status && <p className="text-sm text-gray-600">{status}</p>}
    </main>
  );
}
