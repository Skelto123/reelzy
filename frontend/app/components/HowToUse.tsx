"use client";

import { useState } from "react";

const steps = [
  {
    title: "Download Instagram Reels",
    desc:
      "Copy the Instagram Reel link, paste it into ReelZy, tap Get Reel, and download the video instantly in high quality.",
  },
  {
    title: "Download Reel Audio (MP3)",
    desc:
      "Paste the Reel link, select Get Audio, and save the audio as an MP3 file within seconds — clean and fast.",
  },
];

export default function HowToUse() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="max-w-4xl mx-auto px-4 py-24 mt-20">
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
        How to use <span className="text-pink-500">ReelZy</span>
      </h3>

      <div className="space-y-5">
        {steps.map((item, index) => {
          const active = open === index;

          return (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 dark:border-gray-800
                         bg-white/70 dark:bg-black/60 backdrop-blur
                         transition-all duration-300"
            >
              <button
                onClick={() => setOpen(active ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5"
              >
                <span className="text-lg font-medium">
                  {item.title}
                </span>

                <span
                  className={`transition-transform duration-300 text-pink-500 ${
                    active ? "rotate-180" : ""
                  }`}
                >
                  ⌄
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  active ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-6 pb-6 text-sm text-gray-600 dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
