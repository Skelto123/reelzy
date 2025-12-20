"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Header() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // hide if already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone
    ) {
      setShowInstall(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      setShowInstall(false);
    }

    setDeferredPrompt(null);
  };

  return (
    <header className="w-full border-b px-6 py-4 flex items-center justify-between bg-white dark:bg-black">
      <h1 className="text-xl font-bold">
        <span className="text-black dark:text-white">Reel</span>
        <span className="text-pink-500 animate-pulse">Zy</span>
      </h1>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {showInstall && (
          <button
            onClick={handleInstall}
            className="text-sm px-4 py-1 rounded bg-black text-white dark:bg-white dark:text-black"
          >
            Install App
          </button>
        )}
      </div>
    </header>
  );
}
