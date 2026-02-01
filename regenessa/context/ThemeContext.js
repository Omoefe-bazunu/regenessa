"use client";
import { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  useEffect(() => {
    // Apply system theme on mount
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

    if (systemTheme.matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Listen for system theme changes
    const handleThemeChange = (e) => {
      if (e.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    systemTheme.addEventListener("change", handleThemeChange);

    return () => {
      systemTheme.removeEventListener("change", handleThemeChange);
    };
  }, []);

  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
