'use client'

import SignInButton from '@/components/SignInButton'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function Navigation() {
  const { user } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex flex-row items-center justify-center gap-8 py-4 backdrop-blur-md border-b border-black/10 shadow-sm bg-white">
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
    </nav>
  )
}
