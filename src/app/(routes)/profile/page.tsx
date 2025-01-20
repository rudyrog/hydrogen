'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import gsap from 'gsap'
import { Clock, Medal, Target, Trophy } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function Profile() {
  const letterRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const cardOneRef = useRef<HTMLDivElement | null>(null)
  const cardTwoRef = useRef<HTMLDivElement | null>(null)
  const statsRef = useRef<HTMLDivElement | null>(null)

  const { user, profile } = useAuth()

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

  return (
    <div className="flex gap-3 flex-col container mx-auto p-3 w-5/6">
      <h1 className="quiz-title flex flex-row text-7xl md:text-start text-center title pt-20">
        {['P', 'R', 'O', 'F', 'I', 'L', 'E'].map((letter, index) => (
          <p
            key={index}
            //@ts-ignore
            ref={(el) => (letterRefs.current[index] = el)}
            className="mx-3 transition-colors duration-300 cursor-default select-none"
          >
            {letter}
          </p>
        ))}
      </h1>
      <div className="p-3">
        <div className="max-w-6xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className="shadow-lg h-full"
              ref={cardOneRef}
            >
              <CardHeader className="p-4 bg-slate-50 border-b">
                <CardTitle className="subtitle text-slate-800 font-normal">
                  Personal Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  <div className="grid grid-cols-2 p-3 hover:bg-slate-50 transition-colors">
                    <div className="text-slate-600 font-medium">Name</div>
                    <div className="text-slate-900">
                      {user?.name || 'John Doe'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 p-3 hover:bg-slate-50 transition-colors">
                    <div className="text-slate-600 font-medium">Email</div>
                    <div className="text-slate-900">
                      {user?.email || 'john@example.com'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 p-3 hover:bg-slate-50 transition-colors">
                    <div className="text-slate-600 font-medium">
                      Member Since
                    </div>
                    <div className="text-slate-900">January 2024</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div
              className="relative w-full gap-2 flex flex-col mx-auto"
              ref={statsRef}
            >
              <Card className="shadow-lg">
                <CardContent className="p-2">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Time Spent</div>
                      <div className="text-lg text-slate-900">4.5 hrs</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-2">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Accuracy</div>
                      <div className="text-lg text-slate-900">85%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-2">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Medal className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Rank</div>
                      <div className="text-lg text-slate-900">Advanced</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div ref={cardTwoRef}>
            <Card className="shadow-lg w-6/6">
              <CardHeader className="p-4 bg-slate-50 border-b">
                <CardTitle className="subtitle text-slate-800 font-normal">
                  Quiz Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  <div className="p-4 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span className="text-slate-800 font-medium">
                        Achievements
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 p-3 hover:bg-slate-50 transition-colors">
                    <div className="text-slate-600 font-medium">
                      Classic Quiz
                    </div>
                    <div className="text-slate-900">
                      {JSON.stringify(profile?.classicQuizCompleted) || 'None'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 p-3 hover:bg-slate-50 transition-colors">
                    <div className="text-slate-600 font-medium">
                      Guess the Location
                    </div>
                    <div className="text-slate-900">None</div>
                  </div>
                  <div className="grid grid-cols-2 p-3 hover:bg-slate-50 transition-colors">
                    <div className="text-slate-600 font-medium">
                      Total Points
                    </div>
                    <div className="text-slate-900">0</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
