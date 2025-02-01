"use client";
import SignInButton from "@/components/SignInButton";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState } from "react";
import { FaRegMoon } from "react-icons/fa";
import { IoMenuOutline, IoSunnyOutline } from "react-icons/io5";
import { useTheme } from "../contexts/ThemeContext";
export default function Navigation() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/quiz", label: "Quiz" },
    { href: "/p-table", label: "Table" },
    { href: "/about", label: "About" },
    { href: "/learn", label: "Learn" },
    ...(user ? [{ href: "/profile", label: "Profile" }] : []),
  ];
  return (
    <>
      <nav className="fixed md:flex hidden top-0 bg-background/80 left-0 right-0 z-50  flex-row items-center justify-center text-foreground gap-8 py-4 backdrop-blur-md border-b border-border/20 shadow-sm shadow-foreground/10">
        <div className="text-3xl pointer-events-none">⚛</div>
        <Link href="/" className="name-link">
          Home
        </Link>
        <Link href="/quiz" className="name-link">
          Quiz
        </Link>
        <Link href="/p-table" className="name-link">
          Table
        </Link>
        <Link href="/about" className="name-link">
          About
        </Link>
        <Link href="/learn" className="name-link">
          Learn
        </Link>

        {user ? (
          <Link href="/profile" className="name-link">
            Profile
          </Link>
        ) : (
          <SignInButton />
        )}
        <button onClick={toggleTheme}>
          {theme === "light" ? <IoSunnyOutline /> : <FaRegMoon />}
        </button>
      </nav>
      <nav className="flex md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-50 border border-border/50"
            >
              <IoMenuOutline className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 flex flex-col border-r border-border/50"
          >
            <nav className="flex flex-col space-y-4 pt-12">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              {!user && (
                <div className="mt-4">
                  <SignInButton />
                </div>
              )}
            </nav>

            <div className="mt-auto mb-4 flex justify-between items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="mr-2 border border-border/50"
              >
                {theme === "light" ? <FaRegMoon /> : <IoSunnyOutline />}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </>
  );
}
