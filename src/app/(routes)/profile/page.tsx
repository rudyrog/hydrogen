'use client'
import { Leaderboard } from '@/components/Leaderboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import {
  getUserProfile,
  updateNickname,
  updateRank,
} from '@/lib/firebase/profileFunctions'
// @ts-ignore
import { Profile } from '@/types/profile'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog'
import gsap from 'gsap'
import { Clock, Edit2, Medal, Trophy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { FaExclamation, FaFire, FaWind } from 'react-icons/fa'
import { IoPersonCircle } from 'react-icons/io5'
import { toast } from 'sonner'
import { Button } from '../../../components/ui/button'
import { DialogFooter, DialogHeader } from '../../../components/ui/dialog'
import { InteractiveHoverButton } from '../../../components/ui/interactive-hover-button'
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
  const [rank, setRank] = useState('')

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
          setRank(updatedProfile.rank)
          await updateRank(user.email, updatedProfile.points)
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
                className="shadow-lg h-full bg-background text-foreground border-border/10 dark:border-border/50 border-2"
                ref={cardOneRef}
              >
                <CardHeader className="p-4 border-b dark:border-border/20 bg-foreground/10 rounded-t-md">
                  <CardTitle className="subtitle font-normal flex items-center gap-2">
                    <IoPersonCircle className="h-7 w-7" />
                    <span className="text-foreground">Personal Info</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-secondary/20">
                    <div className="grid grid-cols-2 p-3 items-center">
                      <div className="text-foreground/50 font-medium flex items-center gap-3">
                        <p>Nickname</p>
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
                                className="h-3 w-3"
                              >
                                <Edit2 className="h-1 w-1 text-foreground/50" />
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
                      <div className="text-foreground flex items-center">
                        <span>{displayedProfile?.nickname || 'Not set'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 p-3 dark:border-b dark:border-border/50">
                      <div className="text-foreground/50 font-medium">
                        Email
                      </div>
                      <div className="text-foreground">
                        {displayedProfile?.email || 'john@example.com'}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 p-3 dark:border-t dark:border-border/50">
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
                <Card className="shadow-lg bg-background text-foreground border-border/10 dark:border-border/50 border-2 rounded-xl">
                  <CardContent className="py-2 px-3">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-xl">
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

                <Card className="shadow-lg bg-background text-foreground border-border/10 dark:border-border/50 border-2 rounded-xl">
                  <CardContent className="py-2 px-3">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <Medal className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm text-foreground/50">Rank</div>
                        <div className="text-lg text-foreground">
                          {displayedProfile.rank}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <form
                  onSubmit={handleSearch}
                  className="flex gap-2 w-full items-center shadow-lg bg-background text-foreground border-border/10 dark:border-border/50 border-2 rounded-xl h-full"
                >
                  <div className="flex-1 p-3">
                    <Input
                      type="email"
                      placeholder="Find a user by email..."
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      className="appearance-none border-none shadow-none bg-background text-foreground h-full"
                    />
                  </div>
                  {!searchedProfile ? (
                    <div className="flex gap-1 p-3">
                      <InteractiveHoverButton
                        type="submit"
                        disabled={isSearching}
                        className="border border-border/30 dark:border-border/50 text-foreground font-normal"
                      >
                        {isSearching ? 'Searching...' : 'Search'}
                      </InteractiveHoverButton>
                    </div>
                  ) : (
                    <div className="flex gap-1 p-3">
                      <InteractiveHoverButton
                        type="button"
                        onClick={viewOwnProfile}
                        className="border border-border/30 dark:border-border/50 text-foreground font-normal"
                      >
                        {user?.email === searchEmail ? user.name : 'No Results'}
                      </InteractiveHoverButton>
                    </div>
                  )}
                </form>
              </div>
            </div>
            <div
              ref={cardTwoRef}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <Card className="shadow-lg w-6/6 col-span-3 bg-background text-foreground border-border/10 dark:border-border/50 border-2">
                <CardHeader className="p-4 border-b border dark:border-border/20 bg-foreground/10 rounded-t-md">
                  <CardTitle className="subtitle font-normal flex items-center gap-2">
                    <Trophy className="h-5 w-6 text-foreground" />
                    <span className="text-foreground">Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-secondary/20">
                    <div className="grid grid-cols-2 p-3">
                      <div className="text-foreground/50 font-medium">
                        Classic Quiz
                      </div>
                      <div className="text-foreground">
                        {JSON.stringify(
                          displayedProfile?.classicQuizCompleted,
                        ) || 'None'}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 p-3 dark:border-t dark:border-border/50">
                      <div className="text-foreground/50 font-medium">
                        Guess the Location
                      </div>
                      <div className="text-foreground">
                        {displayedProfile?.guessTheLocationCompleted || 0}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 p-3 dark:border-t dark:border-border/50">
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
                <Card className="shadow-lg bg-background text-foreground border-border/10 dark:border-border/50 border-2">
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

                <Card className="shadow-lg border-border/10 dark:border-border/50 border-2">
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

                <Card className="shadow-lg border-border/10 dark:border-border/50 border-2">
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
