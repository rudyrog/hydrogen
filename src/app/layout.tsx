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
      <head>
        <title>Hydrogen</title>
        <meta
          name="description"
          content="Learn the periodic table in a fun way!"
        />
        <meta
          name="keywords"
          content="chemistry , elements , games , game , hydrogen , periodic table , study "
        />
        <meta
          name="author"
          content="Parv Shah, Rudra Mehta, Devansh Jani, Hrishit Patel"
        />
        <meta property="og:title" content="Hydrogen" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://learnhydrogen.vercel.app/" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </head>
      <AuthProvider>
        <body className="antialiased bg-pattern dark:text-white body">
          <Navigation />
          <main className="md:py-0 pb-20">{children}</main>
        </body>
      </AuthProvider>
    </html>
  );
};
