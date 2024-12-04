import React, { createContext, useState, useContext } from "react";

// Use require to import colors without esModuleInterop
import colors from "tailwindcss/colors";

interface ThemeContextProps {
  color: string;
  setColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [color, setColor] = useState<string>("blue");

  const updateTheme = (newColor: string) => {
    setColor(newColor);

    // Set CSS variables for each shade (100-900)
    document.documentElement.style.setProperty(
      "--color-theme-100",
      colors[newColor][100]
    );
    document.documentElement.style.setProperty(
      "--color-theme-200",
      colors[newColor][200]
    );
    document.documentElement.style.setProperty(
      "--color-theme-300",
      colors[newColor][300]
    );
    document.documentElement.style.setProperty(
      "--color-theme-400",
      colors[newColor][400]
    );
    document.documentElement.style.setProperty(
      "--color-theme-500",
      colors[newColor][500]
    );
    document.documentElement.style.setProperty(
      "--color-theme-600",
      colors[newColor][600]
    );
    document.documentElement.style.setProperty(
      "--color-theme-700",
      colors[newColor][700]
    );
    document.documentElement.style.setProperty(
      "--color-theme-800",
      colors[newColor][800]
    );
    document.documentElement.style.setProperty(
      "--color-theme-900",
      colors[newColor][900]
    );
  };

  return (
    <ThemeContext.Provider value={{ color, setColor: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
