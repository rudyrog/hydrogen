'use client'
import SignInButton from '@/components/SignInButton'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { FaRegMoon } from 'react-icons/fa'
import { IoSunnyOutline } from 'react-icons/io5'
import { useTheme } from '../contexts/ThemeContext'

export default function Navigation() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  return (
    <nav className="fixed top-0 bg-background/80 left-0 right-0 z-50 flex flex-row items-center justify-center text-foreground gap-8 py-4 backdrop-blur-md border-b border-border shadow-sm shadow-foreground/10">
      <Link
        href="/"
        className="name-link"
      >
        Home
      </Link>
      <Link
        href="/quiz"
        className="name-link"
      >
        Quiz
      </Link>
      <Link
        href="/p-table"
        className="name-link"
      >
        Table
      </Link>
      <Link
        href="/about"
        className="name-link"
      >
        About
      </Link>

      {user ? (
        <Link
          href="/profile"
          className="name-link"
        >
          Profile
        </Link>
      ) : (
        <SignInButton />
      )}
      <button onClick={toggleTheme}>
        {theme === 'light' ? <IoSunnyOutline /> : <FaRegMoon />}
      </button>
    </nav>
  )
}
