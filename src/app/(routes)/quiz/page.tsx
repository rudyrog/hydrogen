'use client'
import { GuessTheLocation } from '@/components/quiz/GuessTheLocation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { Level } from '@/types/levels'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import ClassicQuiz from '../../../components/quiz/ClassicQuiz'
import { useTheme } from '../../../contexts/ThemeContext'

export default function Quiz() {
  const [isTimed, setIsTimed] = useState<boolean>(false)
  const [time, setTime] = useState<number>(3)
  const [level, setLevel] = useState<Level>('Medium')
  const [gameMode, setGameMode] = useState<'classic' | 'location'>('classic')
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const theme = useTheme().theme
  const handleTimeChange = (newTime: number) => {
    setTime(newTime)
  }

  const handleLevelChange = (newLevel: 'Easy' | 'Medium' | 'Hard') => {
    setLevel(newLevel)
  }

  const handleGameModeChange = (newGameMode: 'classic' | 'location') => {
    setGameMode(newGameMode)
  }

  const timeOptions = [1, 3, 5, 10]
  const levels = ['Easy', 'Medium', 'Hard']
  const letterRefs = useRef<(HTMLParagraphElement | null)[]>([])

  useEffect(() => {
    letterRefs.current = letterRefs.current.slice(0, 4)

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
            each: 0.08,
            from: 'start',
          },
          duration: 0.8,
        },
        '<0.1',
      )
      .fromTo(
        '.card',
        { opacity: 0, filter: 'blur(10px)' },
        { opacity: 1, filter: 'blur(0px)' },
      )
      .fromTo(
        '.time',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, stagger: 0.2, ease: 'power2.inOut' },
        '<0.1',
      )
      .fromTo(
        '.quiz-btn',
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 2, ease: 'power2.inOut' },
        '<0.1',
      )
  }, [])

  return (
    <div className="flex gap-3 flex-col dark:shadow-none bg-background">
      <h1 className="quiz-title flex flex-row text-7xl md:text-start text-center title pt-20 container mx-auto p-3 w-5/6">
        {['Q', 'U', 'I', 'Z'].map((letter, index) => (
          <p
            key={index}
            // @ts-ignore
            ref={(el) => (letterRefs.current[index] = el)}
            className="mx-3 transition-colors duration-300 cursor-default select-none"
          >
            {letter}
          </p>
        ))}
      </h1>
      {gameStarted === true ? (
        gameMode === 'classic' ? (
          <div className="container mx-auto p-3 w-5/6">
            <ClassicQuiz
              level={level}
              time={time}
              noOfQuestions={(function (time) {
                switch (time) {
                  case 1:
                    return 3
                  case 3:
                    return 5
                  case 5:
                    return 10
                  case 10:
                    return 15
                  default:
                    return 3
                }
              })(time)}
              setGameStarted={setGameStarted}
            />
          </div>
        ) : gameMode === 'location' ? (
          <GuessTheLocation
            level={level}
            time={time}
            noOfQuestions={(function (time) {
              switch (time) {
                case 1:
                  return 3
                case 3:
                  return 5
                case 5:
                  return 10
                case 10:
                  return 15
                default:
                  return 3
              }
            })(time)}
            setGameStarted={setGameStarted}
          />
        ) : (
          <></>
        )
      ) : (
        <>
          <div className="flex gap-3 container mx-auto p-3 w-5/6">
            <Card
              className={`w-96 cursor-pointer ${
                gameMode === 'classic'
                  ? 'border border-border dark:border-border/70 dark:border-2 transition-all duration-300 shadow-lg shadow-foreground/20 text-foreground rounded-lg card dark:shadow-none'
                  : 'border border-border/50 dark:border-border/10 dark:border-2 card text-foreground/50 rounded-lg bg-foreground/10'
              }`}
              onClick={() => handleGameModeChange('classic')}
            >
              <CardHeader>
                <CardTitle className="font-medium subtitle">Classic</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We'll drop some hints, and it's up to you to guess the
                  element! Can you crack the code? Let's find out!
                </p>
              </CardContent>
            </Card>

            <Card
              className={`w-96 cursor-pointer ${
                gameMode === 'location'
                  ? 'border border-border dark:border-border/70 dark:border-2 transition-all duration-300 shadow-lg shadow-foreground/20 text-foreground rounded-lg card dark:shadow-none'
                  : 'border border-border/50 dark:border-border/10 dark:border-2 card text-foreground/50 rounded-lg bg-foreground/10'
              }`}
              onClick={() => handleGameModeChange('location')}
            >
              <CardHeader>
                <CardTitle className="font-medium subtitle">
                  Guess The Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We'll give you the name of an element, and your challenge is
                  to find its spot on the periodic table! Can you pinpoint its
                  exact location? Let the search begin!
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col container mx-auto px-3 w-5/6 gap-2 ">
            <div className="time flex items-center space-x-2">
              <Checkbox
                className="h-6 w-6 rounded-md border-2 border-border/50 data-[state=checked]:bg-background data-[state=checked]:text-foreground bg-background/50"
                id="timed-quiz"
                checked={isTimed}
                onCheckedChange={(checked) => setIsTimed(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-lg"
              >
                Time the Quiz
              </label>
            </div>

            {isTimed && (
              <div className="time border dark:border-2 border-border/50 p-3 w-1/3 h-fit shadow-md shadow-foreground/20 dark:shadow-none rounded-lg">
                <label
                  htmlFor=""
                  className="text-lg"
                >
                  Duration
                </label>
                <div className="flex gap-2 pt-2">
                  {timeOptions.map((option) => (
                    <button
                      key={option}
                      className={
                        time === option
                          ? 'bg-emerald-500 text-black transition-all duration-500 px-3 py-1 rounded-md border-2 border-transparent'
                          : 'border border-border/50 dark:border-border/10 dark:border-2 card text-foreground/50 rounded-md bg-foreground/10 px-3 py-1'
                      }
                      onClick={() => handleTimeChange(option)}
                    >
                      {option} Min{option > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="time border dark:border-2 border-border/50 p-3 w-1/3 h-fit shadow-md shadow-foreground/20 dark:shadow-none rounded-lg">
              <label
                htmlFor="level"
                className="text-lg"
              >
                Choose Difficulty
              </label>
              <div className="flex gap-2 pt-2">
                {levels.map((_level) => (
                  <button
                    key={_level}
                    className={
                      _level === level
                        ? _level === 'Easy'
                          ? 'bg-emerald-400 text-black transition-all duration-500 px-3 py-1 rounded-md border-2 border-transparent'
                          : _level === 'Medium'
                          ? 'bg-yellow-400 text-black transition-all duration-500 px-3 py-1 rounded-md border-2 border-transparent'
                          : 'bg-red-500 text-black transition-all duration-500 px-3 py-1 rounded-md border-2 border-transparent'
                        : 'border border-border/50 dark:border-border/10 dark:border-2 card text-foreground/50 rounded-lg bg-foreground/10 px-3 py-1'
                    }
                    //@ts-ignore
                    onClick={() => handleLevelChange(_level)}
                  >
                    {_level}
                  </button>
                ))}
              </div>
            </div>
            <InteractiveHoverButton
              onClick={() => setGameStarted(true)}
              className="quiz-btn subtitle font-light w-fit mt-3 text-lg border-border/30 border-2"
            >
              Choose Quiz!
            </InteractiveHoverButton>
          </div>
        </>
      )}
    </div>
  )
}
