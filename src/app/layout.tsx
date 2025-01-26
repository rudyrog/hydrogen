"use client";
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { ReactNode } from "react";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import "./globals.css";

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
        <body className="antialiased dark:text-white">
          <Navigation />
          <main className="md:py-0 pb-20">{children}</main>
        </body>
      </AuthProvider>
    </html>
  );
};
