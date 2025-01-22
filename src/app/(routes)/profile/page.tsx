'use client'
import { Leaderboard } from '@/components/Leaderboard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { getUserProfile, updateNickname } from '@/lib/firebase/profileFunctions'
import { Profile } from '@/types/profile'
import gsap from 'gsap'
import { Clock, Edit2, Medal, Search, Trophy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { FaExclamation, FaFire, FaWind } from 'react-icons/fa'
import { toast } from 'sonner'
import { formatTimeSpent } from '../../../lib/utils'

export default function Profile() {
  const letterRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const cardOneRef = useRef<HTMLDivElement | null>(null)
  const cardTwoRef = useRef<HTMLDivElement | null>(null)
  const statsRef = useRef<HTMLDivElement | null>(null)

  const { user, profile, setProfile } = useAuth()
  const [searchEmail, setSearchEmail] = useState('')
  const [searchedProfile, setSearchedProfile] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [displayedProfile, setDisplayedProfile] = useState<Profile | null>(null)
  const [isEditingNickname, setIsEditingNickname] = useState(false)
  const [newNickname, setNewNickname] = useState('')

  const handleNicknameUpdate = async () => {
    if (!displayedProfile?.email) return

    try {
      await updateNickname(displayedProfile.email, newNickname)
      setDisplayedProfile((prev) =>
        prev
          ? {
              ...prev,
              nickname: newNickname,
            }
          : null,
      )
      setIsEditingNickname(false)
      setNewNickname('')
      toast.success('Nickname updated successfully!')
    } catch (error) {
      toast.error('Failed to update nickname')
      console.error(error)
    }
  }

  useEffect(() => {
    const refetchProfile = async () => {
      if (user?.email) {
        try {
          const updatedProfile = await getUserProfile(user.email)
          setProfile(updatedProfile)
          setDisplayedProfile(updatedProfile)
        } catch (error) {
          console.error('Error refetching profile:', error)
        }
      }
    }

    refetchProfile()
  }, [user?.email])

  useEffect(() => {
    letterRefs.current = letterRefs.current.slice(0, 7)

    const tl = gsap.timeline({
      defaults: {
        duration: 1.2,
        ease: 'elastic.out(1, 0.8)',
      },
    })

    tl.fromTo(
      letterRefs.current,
      {
        y: 120,
        opacity: 0,
        rotateX: -80,
        scale: 0.8,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        scale: 1,
        stagger: {
          each: 0.1,
          ease: 'power2.inOut',
        },
      },
    )
      .fromTo(
        letterRefs.current,
        {
          filter: 'blur(10px)',
        },
        {
          filter: 'blur(0px)',
          stagger: {
            each: 0.14,
            from: 'start',
          },
          duration: 0.8,
        },
        '<0.1',
      )
      .fromTo(
        cardOneRef.current,
        {
          filter: 'blur(10px)',
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.5',
      )
      .fromTo(
        cardTwoRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
          filter: 'blur(10px)',
        },
        {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
        },
      )
      .fromTo(
        statsRef.current,
        {
          filter: 'blur(10px)',
          opacity: 0,
          x: 100,
          rotateY: 15,
          scale: 0.9,
        },
        {
          filter: 'blur(0px)',
          opacity: 1,
          x: 0,
          rotateY: 0,
          scale: 1,
          stagger: 0.2,
          duration: 1.2,
          ease: 'power2.out',
        },
        '-=0.8',
      )
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchEmail) return

    setIsSearching(true)
    try {
      const foundProfile = await getUserProfile(searchEmail)
      if (foundProfile != null) {
        setSearchedProfile(foundProfile)
        setDisplayedProfile(foundProfile)
      }
    } catch (error) {
      console.error('Error searching profile:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const viewOwnProfile = () => {
    setDisplayedProfile(profile)
    setSearchEmail('')
    setSearchedProfile(null)
  }

  const handleLeaderboardClick = async (email: string) => {
    try {
      const foundProfile = await getUserProfile(email)
      setSearchedProfile(foundProfile)
      setDisplayedProfile(foundProfile)
      setSearchEmail(email)
    } catch (error) {
      console.error('Error fetching profile from leaderboard:', error)
    }
  }

  return (
    <div className="flex gap-3 flex-col container mx-auto p-3 w-5/6 bg-background text-foreground">
      <h1 className="quiz-title flex flex-row text-7xl md:text-start text-center title pt-20">
        {['P', 'R', 'O', 'F', 'I', 'L', 'E'].map((letter, index) => (
          <p
            key={index}
            // @ts-ignore
            ref={(el) => (letterRefs.current[index] = el)}
            className="mx-3 transition-colors duration-300 cursor-default select-none text-foreground"
          >
            {letter}
          </p>
        ))}
      </h1>
      {displayedProfile?.email && (
        <div className="p-3">
          <div className="max-w-6xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                className="shadow-lg h-full bg-background text-foreground"
                ref={cardOneRef}
              >
                <CardHeader className="p-4 border-b bg-foreground/10">
                  <CardTitle className="subtitle text-foreground font-normal">
                    Personal Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-secondary/20">
                    <div className="grid grid-cols-2 p-3 items-center hover:bg-secondary/10 transition-colors">
                      <div className="text-foreground/50 font-medium">
                        Nickname
                      </div>
                      <div className="text-foreground flex items-center justify-between">
                        <span>{displayedProfile?.nickname || 'Not set'}</span>
                        {(!searchedProfile ||
                          displayedProfile?.email === user?.email) && (
                          <Dialog
                            open={isEditingNickname}
                            onOpenChange={setIsEditingNickname}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Edit2 className="h-3 w-3 text-foreground/50" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-background text-foreground">
                              <DialogHeader>
                                <DialogTitle>Edit Nickname</DialogTitle>
                                <DialogDescription className="text-foreground/70">
                                  Enter your new nickname below.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <Input
                                  placeholder="Enter new nickname"
                                  value={newNickname}
                                  onChange={(e) =>
                                    setNewNickname(e.target.value)
                                  }
                                  className="bg-background text-foreground"
                                />
                              </div>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setIsEditingNickname(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleNicknameUpdate}
                                  disabled={!newNickname.trim()}
                                >
                                  Save
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 p-3 hover:bg-secondary/10 transition-colors">
                      <div className="text-foreground/50 font-medium">
                        Email
                      </div>
                      <div className="text-foreground">
                        {displayedProfile?.email || 'john@example.com'}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 p-3 hover:bg-secondary/10 transition-colors">
                      <div className="text-foreground/50 font-medium">
                        Member Since
                      </div>
                      <div className="text-foreground">January 2024</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div
                className="relative w-full gap-2 flex flex-col mx-auto"
                ref={statsRef}
              >
                <Card className="shadow-lg bg-background text-foreground">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm text-foreground/50">
                          Time Spent
                        </div>
                        <div className="text-lg text-foreground">
                          {displayedProfile?.timeSpent
                            ? formatTimeSpent(displayedProfile.timeSpent)
                            : '0 min'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg bg-background text-foreground">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Medal className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm text-foreground/50">Rank</div>
                        <div className="text-lg text-foreground">Advanced</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg bg-background text-foreground">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-4">
                      <div className="w-4/6">
                        <form
                          onSubmit={handleSearch}
                          className="flex-1 flex gap-2"
                        >
                          <Input
                            type="email"
                            placeholder="Find a user by email..."
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                            className="border-0 shadow-none bg-background text-foreground"
                          />
                          <Button
                            type="submit"
                            disabled={isSearching}
                            variant="outline"
                          >
                            <Search className="h-2 w-2" />
                            {isSearching ? 'Searching...' : 'Search'}
                          </Button>
                          {searchedProfile && (
                            <Button onClick={viewOwnProfile}>
                              View Profile
                            </Button>
                          )}
                        </form>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div
              ref={cardTwoRef}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <Card className="shadow-lg w-6/6 col-span-3 bg-background text-foreground">
                <CardHeader className="p-4 border-b bg-foreground/10">
                  <CardTitle className="subtitle font-normal flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-secondary" />
                    <span className="text-foreground font-medium">
                      Achievements
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-secondary/20">
                    <div className="grid grid-cols-2 p-3 hover:bg-secondary/10 transition-colors">
                      <div className="text-foreground/50 font-medium">
                        Classic Quiz
                      </div>
                      <div className="text-foreground">
                        {JSON.stringify(
                          displayedProfile?.classicQuizCompleted,
                        ) || 'None'}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 p-3 hover:bg-secondary/10 transition-colors">
                      <div className="text-foreground/50 font-medium">
                        Guess the Location
                      </div>
                      <div className="text-foreground">
                        {displayedProfile?.guessTheLocationCompleted || 0}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 p-3 hover:bg-secondary/10 transition-colors">
                      <div className="text-foreground/50 font-medium">
                        Total Points
                      </div>
                      <div className="text-foreground">
                        {displayedProfile?.points || 0}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex flex-col gap-2">
                <Card className="shadow-lg bg-background text-foreground">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <FaFire className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <div className="text-sm text-foreground/50">Hard</div>
                        <div className="text-lg text-foreground">
                          {displayedProfile?.hard || 'None'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-yellow-100 rounded-lg">
                        <FaExclamation className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <div className="text-sm text-foreground/50">Medium</div>
                        <div className="text-lg text-foreground">
                          {displayedProfile?.medium || 'None'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <FaWind className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm text-foreground/50">Easy</div>
                        <div className="text-lg text-foreground">
                          {displayedProfile?.easy || 'None'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            {/* @ts-ignore */}
            <Leaderboard handleLeaderboardClick={handleLeaderboardClick} />
          </div>
        </div>
      )}
    </div>
  )
}
