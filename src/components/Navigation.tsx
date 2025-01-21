'use client'
import { IoSunnyOutline } from "react-icons/io5";
import { FaRegMoon } from "react-icons/fa";
import SignInButton from '@/components/SignInButton'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useTheme } from "@/app/layout";

export default function Navigation() {
  const { user } = useAuth()
  const {theme , toggleTheme} = useTheme()
  return (
    <nav className="fixed top-0 dark:bg-black/80 left-0 right-0 z-50 flex flex-row items-center justify-center dark:text-white bg-white gap-8 py-4 backdrop-blur-md border-b border-black/10 shadow-sm ">
      <Link
        href="/"
        className="link"
      >
        Home
      </Link>
      <Link
        href="/quiz"
        className="link"
      >
        Quiz
      </Link>
      <Link
        href="/p-table"
        className="link"
      >
        Table
      </Link>
      <Link
        href="/about"
        className="link"
      >
        About
      </Link>

      {user ? (
        <Link
          href="/profile"
          className="link"
        >
          <span>{user.name}</span>
        </Link>
      ) : (
        <SignInButton />
      )}
      <button onClick={toggleTheme}>{theme === "light" ? <IoSunnyOutline/> : <FaRegMoon />}</button>
    </nav>
  )
}
