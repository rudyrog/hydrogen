"use client";

import Link from "next/link";
import SignInButton from "@/components/SignInButton";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex flex-row items-center justify-center gap-8 py-4 backdrop-blur-md border-b border-black/10 shadow-sm bg-white">
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

      {user ? (
        <div className="flex items-center gap-4">
          <Link href="/profile" className="link">
            <span>{user.name}</span>
          </Link>
        </div>
      ) : (
        <SignInButton />
      )}
    </nav>
  );
}
