import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
      // Default to light mode for the premium plumbers clean look but support prefers
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      id="theme-toggle-btn"
      onClick={() => setDarkMode(!darkMode)}
      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all duration-200 border border-slate-200 dark:border-slate-700 pointer-events-auto"
      aria-label="Toggle Theme"
    >
      {darkMode ? (
        <Sun className="w-4 h-4 text-amber-500 animate-pulse" />
      ) : (
        <Moon className="w-4 h-4 text-blue-brand" />
      )}
    </button>
  );
}
