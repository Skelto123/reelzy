"use client";
import { useTheme } from "@/app/providers/theme-provider";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full border-b px-6 py-4 flex items-center justify-between
                       bg-white text-black
                       dark:bg-black dark:text-white">
      <h1 className="text-xl font-bold">
        <span>Reel</span>
        <span className="text-pink-500">Zy</span>
      </h1>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="text-sm px-3 py-1 border rounded
                     bg-white text-black
                     dark:bg-black dark:text-white
                     transition"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>

        {/* Install App */}
        <button className="text-sm px-4 py-1.5 bg-black text-white rounded
                           dark:bg-white dark:text-black">
          Install App
        </button>
      </div>
    </header>
  );
}
