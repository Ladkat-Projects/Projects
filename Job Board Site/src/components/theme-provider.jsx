/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";

// Default initial state
const initialState = {
  theme: "system",
  setTheme: () => null,
};

// Create context for theme
const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme" }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(storageKey) || defaultTheme);

  // UseEffect to apply theme classes to the root element
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  // Context value
  const value = {
    theme,
    setTheme: (theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  // Return the provider with the value and children
  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};