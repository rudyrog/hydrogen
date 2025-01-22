import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
//@ts-ignore
import { useAuth } from '@/contexts/AuthContext'
import {
  incrementClassicQuizCompleted,
  incrementTimeSpent,
} from '@/lib/firebase/profileFunctions'
import { Level } from '@/types/levels'
import { Trophy } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { InteractiveHoverButton } from '../ui/interactive-hover-button'

interface Element {
  AtomicNumber: number
  Symbol: string
  Name: string
  AtomicMass: number
  CPKHexColor: string
  ElectronConfiguration: string
  Electronegativity: number
  AtomicRadius: number
  IonizationEnergy: number
  ElectronAffinity: number
  OxidationStates: string
  StandardState: string
  MeltingPoint: number
  BoilingPoint: number
  Density: number
  GroupBlock: string
  YearDiscovered: string
}

export default function ClassicQuiz({
  level,
  time,
  noOfQuestions,
  setGameStarted,
}: {
  level: Level
  time: number
  noOfQuestions: number
  setGameStarted: Dispatch<SetStateAction<boolean>>
}) {
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [questions, setQuestions] = useState<Element[]>([])
  const [inputLength, setInputLength] = useState(0)
  const [values, setValues] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState(time * 60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [noOfHints, setNoOfHints] = useState(1)
  const [isCompleted, setIsCompleted] = useState(false)
  const [badEnding, setBadEnding] = useState(false)
  const { user } = useAuth()
  const theme = useTheme().theme
  useEffect(() => {
    fetchQuestions()

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  useEffect(() => {
    if (isLoading || isCompleted) return

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setIsCompleted(true)
          setBadEnding(true)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isLoading, isCompleted])

  useEffect(() => {
    if (questions.length > 0 && currentQuestion <= questions.length) {
      const questionNameLength = questions[currentQuestion - 1].Name.length
      setInputLength(questionNameLength)
      setValues(Array(questionNameLength).fill(''))
      setIsLoading(false)
    }
  }, [questions, currentQuestion])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const fetchQuestions = async () => {
    try {
      const max = level === 'Easy' ? 10 : level === 'Medium' ? 20 : 30
      const response = await fetch(
        `http://localhost:3000/api/v1/getQuestion?min=1&max=${max}`,
      )
      const data = await response.json()
      const shuffledQuestions = data
        .sort(() => 0.5 - Math.random())
        .slice(0, noOfQuestions)
      setQuestions(shuffledQuestions)
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValues = [...values]
    newValues[index] = e.target.value.slice(-1)
    setValues(newValues)

    if (e.target.value && index < inputLength - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const checkAnswer = () => {
    if (!questions[currentQuestion - 1]) return

    const word = values.join('')
    if (
      word.toLowerCase() === questions[currentQuestion - 1].Name.toLowerCase()
    ) {
      if (currentQuestion < questions.length) {
        setCurrentQuestion((prev) => prev + 1)
        setNoOfHints(1)
        inputRefs.current[0]?.focus()
      } else {
        setIsCompleted(true)
        if (user?.email && !badEnding) {
          incrementClassicQuizCompleted(user?.email, level)
          incrementTimeSpent(user?.email, (time * 60 - timeRemaining) / 60)
        }
      }
    }
  }

  useEffect(() => {
    if (values.join('').length === inputLength) {
      checkAnswer()
    }
  }, [values])

  if (isLoading) {
    return <div className="p-3">Loading...</div>
  }

  return (
    <div className="p-3">
      {isCompleted ? (
        <div className="cmp-txt text-3xl h-1/2 w-1/2 p-4 gap-2">
          <div className="text-lg">
            {badEnding ? (
              <div className="flex flex-col items-center justify-center gap-8 p-8 text-center rounded-sm shadow-lg border border-foreground/20">
                <div className="flex flex-row items-center gap-4">
                  <p className="text-6xl tracking-tighter text-foreground">
                    You Lose!
                  </p>
                </div>
                <p className="text-xl text-foreground/50">
                  Almost had it? Challenge yourself again!
                </p>
                {theme === 'light' ? (
                  <InteractiveHoverButton
                    onClick={() => setGameStarted(false)}
                    className="quiz-btn subtitle font-light w-fit mt-3 text-lg"
                  >
                    Choose Quiz!
                  </InteractiveHoverButton>
                ) : (
                  <InteractiveHoverButton
                    onClick={() => setGameStarted(false)}
                    className="quiz-btn subtitle font-light w-fit mt-3 text-lg bg-white text-black"
                  >
                    Choose Quiz!
                  </InteractiveHoverButton>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-8 p-8 text-center rounded-sm shadow-lg border border-foreground/20">
                <div className="flex flex-row items-center justify-center gap-4">
                  <Trophy className="w-10 h-10 text-yellow-300" />
                  <p className="text-6xl tracking-tighter text-foreground">
                    You Win!
                  </p>
                </div>
                <p className="text-xl text-foreground/50">
                  Congratulations on your victory! Ready for another challenge?
                </p>
                {theme === 'light' ? (
                  <InteractiveHoverButton
                    onClick={() => setGameStarted(false)}
                    className="quiz-btn subtitle font-light w-fit mt-3 text-lg"
                  >
                    Choose Quiz!
                  </InteractiveHoverButton>
                ) : (
                  <InteractiveHoverButton
                    onClick={() => setGameStarted(false)}
                    className="quiz-btn subtitle font-light w-fit mt-3 text-lg bg-white text-black"
                  >
                    Choose Quiz!
                  </InteractiveHoverButton>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="border border-foreground/20 h-1/2 w-1/2 p-4 flex flex-col items-center justify-center bg-background/70">
          <div className="text-2xl text-center font-medium p-2 flex flex-col items-center justify-center gap-1">
            <div className="text-xl font-bold">{formatTime(timeRemaining)}</div>
            Classic{' '}
            <p className="text-sm text-foreground/60">
              ({currentQuestion} of {questions.length})
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 border border-foreground/40 text-center text-3xl w-fit">
            {values.map((value, index) => (
              <input
                key={index}
                //@ts-ignore
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={value}
                maxLength={1}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-10 h-14 text-center text-xl bg-background ${
                  value ? 'border-none' : 'border-b-2 border-foreground/30'
                } outline-none focus:border-b-2 focus:border-foreground`}
              />
            ))}
          </div>
          <div className="p-3 text-lg text-foreground/70">Hints!</div>
          <div className="flex justify-between gap-10 w-2/3">
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="rounded-full border border-foreground/20 flex items-center justify-center p-3 w-16 h-16">
                {noOfHints >= 1
                  ? questions[currentQuestion - 1].AtomicNumber
                  : 'AN'}
              </div>
              {noOfHints >= 1 ? 'AtomicNo' : ''}
            </div>

            <div className="flex flex-col justify-center items-center gap-2">
              <div className="rounded-full border border-foreground/20 flex items-center justify-center p-3 w-16 h-16 ">
                {noOfHints >= 2
                  ? questions[currentQuestion - 1].StandardState
                  : '?'}
              </div>
              {noOfHints >= 1 ? 'State' : ''}
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="rounded-full border border-foreground/20 flex items-center justify-center p-3 w-16 h-16">
                {noOfHints >= 3 ? questions[currentQuestion - 1].Symbol : '?'}
              </div>
              {noOfHints >= 1 ? 'Symbol' : ''}
            </div>
          </div>
          <InteractiveHoverButton
            onClick={() => setNoOfHints(noOfHints + 1)}
            className="btn-pr font-light w-fit mt-3 text-lg border border-foreground/20"
          >
            Add Hint
          </InteractiveHoverButton>
        </div>
      )}
    </div>
  )
}
