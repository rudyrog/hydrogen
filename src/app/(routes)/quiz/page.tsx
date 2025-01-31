'use client'
import ElementsAlike from '@/components/quiz/ElementsAlike'
import { GuessTheLocation } from '@/components/quiz/GuessTheLocation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { Label } from '@/components/ui/label'
import { Level } from '@/types/levels'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { Toaster, toast } from 'sonner'
import ClassicQuiz from '../../../components/quiz/ClassicQuiz'
import { useTheme } from '../../../contexts/ThemeContext'

export default function Quiz() {
  const [isTimed, setIsTimed] = useState<boolean>(true)
  const [isCustom, setIsCustom] = useState<boolean>(false)
  const [time, setTime] = useState<number>(3)
  const [customTime, setCustomTime] = useState<number>(3)
  const [level, setLevel] = useState<Level>('Medium')
  const [customLevel, setCustomLevel] = useState<Level>('Medium')
  const [gameMode, setGameMode] = useState<
    'classic' | 'location' | 'elementsAlike'
  >('classic')
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [customQuestions, setCustomQuestions] = useState<number>(5)
  const [minElement , setMinElement ] = useState<number |null>(null)
  const [maxElement , setMaxElement] = useState<number | null>(null)
  const theme = useTheme().theme
  const timeOptions = [1, 3, 5, 10]
  const levels: Level[] = ['Easy', 'Medium', 'Hard']
  const letterRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const handleTimeChange = (newTime: number) => {
    setTime(newTime)
  }

  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel)
  }

  const handleGameModeChange = (
    newGameMode: 'classic' | 'location' | 'elementsAlike',
  ) => {
    setGameMode(newGameMode)
  }

  const startGame = () => {
    if (isCustom) {
      setTime(customTime)
      setLevel(customLevel)
    }
    setGameStarted(true)
  }

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
        { opacity: 1, filter: 'blur(0px)', stagger: 0.2, ease: 'power2.inOut' },
        '<0.5',
      )
      .fromTo(
        '.card2',
        { opacity: 0, filter: 'blur(10px)' },
        { opacity: 1, filter: 'blur(0px)', stagger: 0.2, ease: 'power2.inOut' },
        '1',
      )
      .fromTo(
        '.card3',
        { opacity: 0, filter: 'blur(10px)' },
        { opacity: 1, filter: 'blur(0px)', stagger: 0.2, ease: 'power2.inOut' },
        '1',
      )
      .fromTo(
        '.time',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, stagger: 0.2, ease: 'power2.inOut' },
      )
      .fromTo(
        '.quiz-btn',
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 2, ease: 'power2.inOut' },
        '<0.1',
      )
  }, [])

  return (
    <div className="flex gap-3 flex-col dark:shadow-none bg-background pb-5">
      <Toaster />
      <h1 className="quiz-title flex flex-row text-3xl sm:text-4xl md:text-5xl lg:text-8xl text-center md:text-start title mt-16 md:mt-20 lg:mt-24 container mx-auto w-full sm:w-11/12 md:w-5/6">
        {["Q", "U", "I", "Z"].map((letter, index) => (
          <p
            key={index}
            //@ts-ignore
            ref={(el) => (letterRefs.current[index] = el)}
            className="mx-1 sm:mx-2 md:mx-3 transition-colors duration-300 cursor-default select-none"
          >
            {letter}
          </p>
        ))}
      </h1>
      {gameStarted ? (
        gameMode === "classic" ? (
          <div className="container mx-auto p-2 sm:p-3 md:p-4 w-full sm:w-11/12 md:w-5/6">
            <ClassicQuiz
              level={level}
              time={isTimed || isCustom ? time : 200}
              customMin={minElement}
              customMax={maxElement}
              noOfQuestions={
                isCustom
                  ? customQuestions
                  : (function (time) {
                      switch (time) {
                        case 1:
                          return 3;
                        case 3:
                          return 5;
                        case 5:
                          return 10;
                        case 10:
                          return 15;
                        default:
                          return 3;
                      }
                    })(time)
              }
              setGameStarted={setGameStarted}
            />
          </div>
        ) : gameMode === "location" ? (
          <GuessTheLocation
            level={level}
            time={isTimed || isCustom ? time : 200}
            customMin={minElement}
            customMax={maxElement}
            noOfQuestions={
              isCustom
                ? customQuestions
                : (function (time) {
                    switch (time) {
                      case 1:
                        return 3;
                      case 3:
                        return 5;
                      case 5:
                        return 10;
                      case 10:
                        return 15;
                      default:
                        return 3;
                    }
                  })(time)
            }
            setGameStarted={setGameStarted}
          />
        ) : gameMode === "elementsAlike" ? (
          <ElementsAlike
            //@ts-ignore
            level={level}
            time={isTimed || isCustom ? time : 200}
            noOfQuestions={
              //isCustom
              //? customQuestions
              (function (time) {
                switch (time) {
                  case 1:
                    return 1;
                  case 3:
                    return 2;
                  case 5:
                    return 4;
                  case 10:
                    if (level === "Hard" || level === "hard") return 9;
                    else {
                      return 6;
                    }
                  default:
                    return 3;
                }
              })(time)
            }
            setGameStarted={setGameStarted}
          />
        ) : null
      ) : (
        <>
          <div className="flex gap-3 flex-col sm:flex-col md:flex-row container mx-auto p-2 sm:p-3 md:p-4 w-full sm:w-11/12 md:w-5/6">
            <Card
              className={`w-full md:w-1/3 cursor-pointer ${
                gameMode === "classic"
                  ? "border border-border dark:border-border/70 dark:border-2 transition-all duration-300 shadow-lg shadow-foreground/20 text-foreground rounded-lg card dark:shadow-none"
                  : "border border-border/50 dark:border-border/10 dark:border-2 card text-foreground/50 rounded-lg bg-foreground/10"
              }`}
              onClick={() => handleGameModeChange("classic")}
            >
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="font-medium subtitle text-base sm:text-lg md:text-xl">
                  Classic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base">
                  We'll drop some hints, and it's up to you to guess the
                  element! Can you crack the code? Let's find out!
                </p>
              </CardContent>
            </Card>

            <Card
              className={`w-full md:w-1/3 cursor-pointer ${
                gameMode === "location"
                  ? "border border-border dark:border-border/70 dark:border-2 transition-all duration-300 shadow-lg shadow-foreground/20 text-foreground rounded-lg card2 dark:shadow-none"
                  : "border border-border/50 dark:border-border/10 dark:border-2 card2 text-foreground/50 rounded-lg bg-foreground/10"
              }`}
              onClick={() => handleGameModeChange("location")}
            >
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="font-medium subtitle text-base sm:text-lg md:text-xl">
                  Guess The Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base">
                  We'll give you the name of an element, and your challenge is
                  to find its spot on the periodic table! Can you pinpoint its
                  exact location? Let the search begin!
                </p>
              </CardContent>
            </Card>

            <Card
              className={`w-full ${
                !isTimed ? "opacity-25 " : ""
              } md:w-1/3 cursor-pointer ${
                gameMode === "elementsAlike"
                  ? "border border-border dark:border-border/70 dark:border-2 transition-all duration-300 shadow-lg shadow-foreground/20 text-foreground rounded-lg card3 dark:shadow-none"
                  : "border border-border/50 dark:border-border/10 dark:border-2 card3 text-foreground/50 rounded-lg bg-foreground/10"
              }`}
              onClick={() => {
                if (isTimed) handleGameModeChange("elementsAlike");
                else
                  toast(
                    "This mode is only available for timed quiz! Kindly select 'Time the Quiz'"
                  );
              }}
            >
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="font-medium subtitle text-base sm:text-lg md:text-xl">
                  Elements Alike
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base">
                  We will give you a group and you have to find the elements
                  belonging to that group! Good luck with this quest!
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col container mx-auto px-2 sm:px-3 md:px-4 w-full sm:w-11/12 md:w-5/6 gap-3">
            <div className="space-y-2 sm:space-y-3">
              <div className="time flex items-center space-x-2">
                <Checkbox
                  className="h-5 w-5 sm:h-6 sm:w-6 rounded-md border-2 border-border/50 data-[state=checked]:bg-background data-[state=checked]:text-foreground bg-background/50"
                  disabled={isCustom}
                  id="timed-quiz"
                  checked={isTimed}
                  onCheckedChange={(checked) => {
                    if (gameMode === "elementsAlike") {
                      setGameMode("classic");
                    }
                    setIsTimed(checked as boolean);
                  }}
                />
                <label htmlFor="timed-quiz" className="text-base sm:text-lg">
                  Time the Quiz
                </label>
              </div>
              <div className="time flex items-center space-x-2">
                <Checkbox
                  className="h-5 w-5 sm:h-6 sm:w-6 rounded-md border-2 border-border/50 data-[state=checked]:bg-background data-[state=checked]:text-foreground bg-background/50"
                  id="custom-quiz"
                  checked={isCustom}
                  disabled={gameMode === "elementsAlike"}
                  onCheckedChange={(checked) => setIsCustom(checked as boolean)}
                />
                <label htmlFor="custom-quiz" className="text-base sm:text-lg">
                  Custom Quiz
                </label>
              </div>
            </div>

            {isTimed && !isCustom && (
              <div className="time border dark:border-2 border-border/50 p-2 sm:p-3 md:p-4 w-full md:w-1/2 lg:w-1/3 h-fit shadow-md shadow-foreground/20 dark:shadow-none rounded-lg">
                <label className="text-base sm:text-lg">Duration</label>
                <div className="flex flex-wrap gap-2 pt-2">
                  {timeOptions.map((option) => (
                    <button
                      key={option}
                      className={
                        time === option
                          ? "bg-emerald-500 text-black transition-all duration-500 px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base rounded-md border-2 border-transparent"
                          : "border border-border/50 dark:border-border/10 dark:border-2 card text-foreground/50 rounded-md bg-foreground/10 px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base"
                      }
                      onClick={() => handleTimeChange(option)}
                    >
                      {option} Min{option > 1 ? "s" : ""}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isCustom && gameMode != "elementsAlike" ? (
              <div className="custom-config space-y-3 sm:space-y-4 border dark:border-2 border-border/50 p-2 sm:p-3 md:p-4 w-full md:w-1/2 lg:w-1/3 h-fit shadow-md shadow-foreground/20 dark:shadow-none rounded-lg">
                <div>
                  <Label htmlFor="custom-time" className="text-sm sm:text-base">
                    Custom Time (minutes)
                  </Label>
                  <Input
                    id="custom-time"
                    type="number"
                    min="1"
                    max="30"
                    value={customTime}
                    onChange={(e) => {
                      setCustomTime(Number(e.target.value));
                      //@ts-ignore
                      setTime(e.target.value);
                    }}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm sm:text-base">
                    Custom Difficulty
                  </Label>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {levels.map((_level) => (
                      <button
                        key={_level}
                        className={
                          _level === customLevel
                            ? _level === "Easy"
                              ? "bg-emerald-400 text-black transition-all duration-500 px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base rounded-md border-2 border-transparent"
                              : _level === "Medium"
                              ? "bg-yellow-400 text-black transition-all duration-500 px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base rounded-md border-2 border-transparent"
                              : "bg-red-500 text-black transition-all duration-500 px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base rounded-md border-2 border-transparent"
                            : "border border-border/50 dark:border-border/10 dark:border-2 card text-foreground/50 rounded-lg bg-foreground/10 px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base"
                        }
                        onClick={() => setCustomLevel(_level)}
                      >
                        {_level}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="custom-questions"
                    className="text-sm sm:text-base"
                  >
                    Number of Questions
                  </Label>
                  <Input
                    id="custom-questions"
                    type="number"
                    min="1"
                    max={gameMode === "classic" ? 112 : 10}
                    value={customQuestions}
                    onChange={(e) => setCustomQuestions(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="custom-time" className="text-sm sm:text-base">
                    Minimum Element
                  </Label>
                  <Input
                    id="custom-time"
                    type="number"
                    min="1"
                    max="30"
                    value={minElement ? minElement : ""}
                    placeholder="Atomic Number"
                    onChange={(e) => {
                      //@ts-ignore
                      setMinElement(e.target.value);
                    }}
                    className="mt-2"
                  />
                </div>{" "}
                <div>
                  <Label htmlFor="custom-time" className="text-sm sm:text-base">
                    Maximum Element
                  </Label>
                  <Input
                    id="custom-time"
                    type="number"
                    min="1"
                    max="30"
                    placeholder="Atomic Number"
                    value={maxElement ? maxElement : ""}
                    onChange={(e) => {
                      //@ts-ignore
                      setMaxElement(e.target.value);
                    }}
                    className="mt-2"
                  />
                </div>
              </div>
            ) : (
              <div className="time border dark:border-2 border-border/50 p-2 sm:p-3 md:p-4 w-full md:w-1/2 lg:w-1/3 h-fit shadow-md shadow-foreground/20 dark:shadow-none rounded-lg">
                <label htmlFor="level" className="text-base sm:text-lg">
                  Choose Difficulty
                </label>
                <div className="flex flex-wrap gap-2 pt-2">
                  {levels.map((_level) => (
                    <button
                      key={_level}
                      className={
                        _level === level
                          ? _level === "Easy"
                            ? "bg-emerald-400 text-black transition-all duration-500 px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base rounded-md border-2 border-transparent"
                            : _level === "Medium"
                            ? "bg-yellow-400 text-black transition-all duration-500 px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base rounded-md border-2 border-transparent"
                            : "bg-red-500 text-black transition-all duration-500 px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base rounded-md border-2 border-transparent"
                          : "border border-border/50 dark:border-border/10 dark:border-2 card text-foreground/50 rounded-lg bg-foreground/10 px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base"
                      }
                      onClick={() => handleLevelChange(_level)}
                    >
                      {_level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <InteractiveHoverButton
              onClick={startGame}
              className="quiz-btn subtitle font-light w-fit mt-2 sm:mt-3 text-base sm:text-lg border-border/30 border-2"
            >
              Choose Quiz!
            </InteractiveHoverButton>
          </div>
        </>
      )}
    </div>
  );
}
// "Nonmetal",
//     "Noble gas",
// "Alkali metal",
// "Alkaline earth metal",
// "Metalloid",
// "Halogen",
// "Post-transition metal",
