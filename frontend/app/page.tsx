"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [url, setUrl] = useState("");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-3xl font-bold">ReelZy</h1>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste Instagram Reel link"
        className="w-full max-w-md px-4 py-3 border rounded-md"
      />

      {/* VIDEO DOWNLOAD */}
      <form method="POST" action={`${API}/api/video`}>
        <input type="hidden" name="url" value={url} />
        <button
          type="submit"
          className="px-6 py-3 bg-black text-white rounded-md"
        >
          Download Video
        </button>
      </form>

      {/* AUDIO DOWNLOAD */}
      <form method="POST" action={`${API}/api/audio`}>
        <input type="hidden" name="url" value={url} />
        <button
          type="submit"
          className="px-6 py-3 border border-pink-500 text-pink-500 rounded-md"
        >
          Download Audio
        </button>
      </form>

      <p className="text-sm text-gray-500">
        First request may take 20–30 seconds (free server cold start)
      </p>
    </main>
  );
}
