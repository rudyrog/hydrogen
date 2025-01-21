'use client'
import { GuessTheLocation } from '@/components/quiz/GuessTheLocation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import ClassicQuiz from '../../../components/quiz/ClassicQuiz'

export default function Quiz() {
  const [isTimed, setIsTimed] = useState<boolean>(false)
  const [time, setTime] = useState<number>(3)
  const [level, setLevel] = useState<'Easy' | 'Medium' | 'Hard'>('Medium')
  const [gameMode, setGameMode] = useState<'classic' | 'location'>('classic')
  const [gameStarted, setGameStarted] = useState<boolean>(false)

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
    <div className="flex gap-3 flex-col ">
      <h1 className="quiz-title flex flex-row text-7xl md:text-start text-center title pt-20 container mx-auto p-3 w-5/6">
        {['Q', 'U', 'I', 'Z'].map((letter, index) => (
          <p
            key={index}
            //  @ts-ignore
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
                    return 2
                  case 3:
                    return 4
                  case 5:
                    return 6
                  case 10:
                    return 10
                  default:
                    return 10
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
                  return 2
                case 3:
                  return 4
                case 5:
                  return 6
                case 10:
                  return 10
                default:
                  return 10
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
              className={`w-96 cursor-pointer${
                gameMode === 'classic'
                  ? 'border border-black transition-all duration-300 shadow-md shadow-gray-400 text-black rounded-none card'
                  : 'border border-gray-200 card bg-gray-100/50 text-black/80 rounded-none'
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
                  ? 'border border-black transition-all duration-300 shadow-md shadow-gray-400 text-black rounded-none card'
                  : 'border card border-gray-200 bg-gray-100/50 text-black/80 rounded-none'
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
          {/* Time Settings */}
          <div className="flex flex-col container mx-auto p-3 w-5/6 gap-2 ">
            <div className="time flex items-center space-x-2">
              <Checkbox
                className="h-6 w-6 rounded-sm border border-black/30 data-[state=checked]:bg-white data-[state=checked]:text-black bg-gray-200/50"
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
              <div className="time border border-black/30 p-3 w-1/3 h-fit shadow-md shadow-gray-300">
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
                      className={`btn-pr ${
                        time === option
                          ? 'bg-emerald-400 text-black transition-all duration-500'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                      onClick={() => handleTimeChange(option)}
                    >
                      {option} Min{option > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="time border border-black/30 p-3 w-1/3 h-fit shadow-md shadow-gray-300">
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
                    className={`btn-pr ${
                      _level === level
                        ? _level === 'Easy'
                          ? 'bg-emerald-400 text-black transition-all duration-500'
                          : _level === 'Medium'
                          ? 'bg-yellow-400 text-black transition-all duration-500'
                          : 'bg-red-500 text-black transition-all duration-500'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                    // @ts-ignore
                    onClick={() => handleLevelChange(_level)}
                  >
                    {_level}
                  </button>
                ))}
              </div>
            </div>

            <InteractiveHoverButton
              onClick={() => setGameStarted(true)}
              className="quiz-btn subtitle font-light w-fit mt-3 text-lg border border-black/15"
            >
              Start Quiz!
            </InteractiveHoverButton>
          </div>
        </>
      )}
    </div>
  )
}
