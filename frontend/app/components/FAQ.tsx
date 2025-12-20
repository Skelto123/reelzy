"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Is ReelZy free to use?",
    a: "Yes. ReelZy is completely free to download public Instagram Reels and audio for personal use.",
  },
  {
    q: "Do I need to log in to download Reels?",
    a: "No login or account is required. Just paste the link and download instantly.",
  },
  {
    q: "Can I download private Instagram Reels?",
    a: "No. ReelZy supports only publicly available Instagram content.",
  },
  {
    q: "Is it safe to use ReelZy?",
    a: "Yes. ReelZy does not store your downloads or collect personal data.",
  },
  {
    q: "Does ReelZy work on mobile?",
    a: "Yes. ReelZy is fully responsive and works smoothly on mobile, tablet, and desktop devices.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="max-w-4xl mx-auto px-4 py-24">
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Frequently Asked <span className="text-pink-500">Questions</span>
      </h3>

      <div className="space-y-5">
        {faqs.map((item, index) => {
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
                  {item.q}
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
                  {item.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
