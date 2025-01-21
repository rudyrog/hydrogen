"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import Navigation from "@/components/Navigation";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <ThemeConsumer>{children}</ThemeConsumer>
    </ThemeProvider>
  );
}

const ThemeConsumer: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <html lang="en" className={theme}>
      <AuthProvider>
        <body className="antialiased dark:bg-black dark:text-white">
          <Navigation />
          <main>{children}</main>
        </body>
      </AuthProvider>
    </html>
  );
};
