"use client";

import { useEffect } from "react";
import { useTheme } from "../providers/theme-provider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // keep the DOM in sync if theme changes externally
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      aria-pressed={theme === "dark"}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="text-sm px-3 py-1 rounded border dark:text-white"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
