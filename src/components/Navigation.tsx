"use client";
import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex flex-row items-center justify-center gap-8 py-4 backdrop-blur-md border-b border-black/10 shadow-sm bg-white/50">
      <Link href="/" className="link">
        Home
      </Link>
      <Link href="/quiz" className="link">
        Quiz
      </Link>
      <Link href="/p-table" className="link">
        Periodic Table
      </Link>
      <Link href="/about" className="link">
        About
      </Link>
    </nav>
  );
}
