import { useAuth } from '@/contexts/AuthContext'
import elements from '@/data/elements.json'
import {
  incrementGuessTheLocationCompleted,
  incrementTimeSpent,
} from '@/lib/firebase/profileFunctions'
import { Element } from '@/types/element'
import { Trophy } from 'lucide-react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { AuroraText } from '../ui/aurora-text'
import { InteractiveHoverButton } from '../ui/interactive-hover-button'

export const GuessTheLocation = ({
  level,
  time,
  noOfQuestions,
  setGameStarted,
}: {
  level: string
  time: number
  noOfQuestions: number
  setGameStarted: Dispatch<SetStateAction<boolean>>
}) => {
  const [questions, setQuestions] = useState<Element[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [isGameCompleted, setIsGameCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState(time * 60)
  const [badEnding, setBadEnding] = useState(false)
  const [hintElements, setHintElements] = useState<number[]>([])
  const [hintUsed, setHintUsed] = useState(false)

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
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getHint = () => {
    if (hintUsed) return

    const currentElement = questions[currentQuestion - 1]
    const otherElements = elements
      .filter((e) => e.AtomicNumber !== currentElement.AtomicNumber)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    const hintArray = [...otherElements, currentElement]
      .sort(() => 0.5 - Math.random())
      .map((e) => e.AtomicNumber)

    setHintElements(hintArray)
    setHintUsed(true)
  }

  useEffect(() => {
    // Reset hints and hint usage when question changes
    setHintElements([])
    setHintUsed(false)
  }, [currentQuestion])

  useEffect(() => {
    if (isLoading || isGameCompleted) return

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setBadEnding(true)
          setIsGameCompleted(true)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isLoading, isGameCompleted])

  return (
    !isLoading && (
      <div className="flex flex-col gap-6">
        <div className="container mx-auto flex flex-row gap-3 w-4/5 items-center">
          {isGameCompleted ? (
            badEnding ? (
              <div className="flex flex-col items-center justify-center gap-8 p-8 text-center rounded-sm shadow-lg border border-black/30">
                <div className="flex flex-row items-center gap-4">
                  {' '}
                  <AuroraText className="text-6xl font-bold tracking-tighter">
                    You Lose!
                  </AuroraText>
                </div>
                <p className="text-xl text-gray-600">
                  Almost had it? Challenge yourself again!
                </p>
                <InteractiveHoverButton onClick={() => setGameStarted(false)}>
                  Choose Quiz!
                </InteractiveHoverButton>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-8 p-8 text-center rounded-sm shadow-lg border border-black/30">
                <div className="flex flex-row items-center gap-4">
                  <AuroraText className="text-6xl font-bold tracking-tighter flex flex-row items-center gap-3">
                    <Trophy className="w-10 h-10" />
                    You Win!
                  </AuroraText>
                </div>
                <p className="text-xl text-gray-600">
                  Congratulations on your victory! Ready for another challenge?
                </p>
                <InteractiveHoverButton onClick={() => setGameStarted(false)}>
                  Choose Quiz!
                </InteractiveHoverButton>
              </div>
            )
          ) : (
            <div className="p-3 rounded-3xl border w-fit text-xl">
              {currentQuestion} / {noOfQuestions} | {formatTime(timeRemaining)}
              <div className="flex items-center gap-4">
                <div>Find {questions[currentQuestion - 1].Name}!</div>
                <InteractiveHoverButton
                  onClick={getHint}
                  disabled={hintUsed}
                  className={hintUsed ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {hintUsed ? 'Hint Used' : 'Get Hint'}
                </InteractiveHoverButton>
              </div>
            </div>
          )}
        </div>
        {!isGameCompleted && (
          <div className="relative w-screen flex items-end justify-center mb-10">
            <HiddenPeriodicTable
              currentQuestionElementNumber={
                questions[currentQuestion - 1].AtomicNumber
              }
              setCurrentQuestion={setCurrentQuestion}
              currentQuestion={currentQuestion}
              noOfQuestions={noOfQuestions}
              setIsGameCompleted={setIsGameCompleted}
              totalTime={time}
              timeRemaining={timeRemaining}
              hintElements={hintElements}
            />
          </div>
        )}
      </div>
    )
  )
}

const HiddenPeriodicTable = ({
  currentQuestionElementNumber,
  setCurrentQuestion,
  currentQuestion,
  noOfQuestions,
  setIsGameCompleted,
  totalTime,
  timeRemaining,
  hintElements,
}: {
  currentQuestionElementNumber: number
  setCurrentQuestion: Dispatch<SetStateAction<number>>
  currentQuestion: number
  noOfQuestions: number
  setIsGameCompleted: Dispatch<SetStateAction<boolean>>
  totalTime: number
  timeRemaining: number
  hintElements: number[]
}) => {
  const { user } = useAuth()
  const checkAnswer = (element: Element) => {
    if (element.AtomicNumber === currentQuestionElementNumber) {
      if (currentQuestion < noOfQuestions)
        setCurrentQuestion(currentQuestion + 1)
      else {
        setIsGameCompleted(true)
        if (user?.email) {
          incrementGuessTheLocationCompleted(user.email)
          incrementTimeSpent(user.email, (totalTime * 60 - timeRemaining) / 60)
        }
      }
    }
  }

  const ElementCard = ({ element }: { element: Element | undefined }) => {
    if (!element) return <div className="w-16 h-16 invisible" />

    const isHinted = hintElements.includes(element.AtomicNumber)

    return (
      <button
        onClick={() => checkAnswer(element)}
        className={`w-16 h-16 p-1 text-center border rounded cursor-pointer flex flex-col justify-around items-center transition-all duration-300 ${
          isHinted ? 'ring-4 ring-black ' : ''
        }`}
        style={{
          backgroundColor: `#${element.CPKHexColor || '808080'}`,
          gridColumn: getGridColumn(element.AtomicNumber),
          gridRow: getGridRow(element.AtomicNumber),
        }}
      >
        <div className="text-xs">{element.AtomicNumber}</div>
        <div className="text-xs font-bold">?</div>
      </button>
    )
  }

  const renderLanthanidesAndActinides = () => {
    const lanthanides = elements.filter(
      (e) => e.AtomicNumber >= 57 && e.AtomicNumber <= 70,
    )
    const actinides = elements.filter(
      (e) => e.AtomicNumber >= 89 && e.AtomicNumber <= 102,
    )

    return (
      <div className="">
        <div className="flex justify-center gap-2 mt-2">
          {lanthanides.map((element) => (
            <ElementCard
              key={element.AtomicNumber}
              //@ts-ignore
              element={element}
            />
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-2">
          {actinides.map((element) => (
            <ElementCard
              key={element.AtomicNumber}
              //@ts-ignore
              element={element}
            />
          ))}
        </div>
      </div>
    )
  }

  const getGridColumn = (atomicNumber: number): string => {
    if (atomicNumber === 1) return '1'
    if (atomicNumber === 2) return '18'

    if (
      atomicNumber === 3 ||
      atomicNumber === 11 ||
      atomicNumber === 19 ||
      atomicNumber === 37 ||
      atomicNumber === 55 ||
      atomicNumber === 87
    )
      return '1'
    if (
      atomicNumber === 4 ||
      atomicNumber === 12 ||
      atomicNumber === 20 ||
      atomicNumber === 38 ||
      atomicNumber === 56 ||
      atomicNumber === 88
    )
      return '2'

    if (atomicNumber >= 5 && atomicNumber <= 10) return String(atomicNumber + 8)
    if (atomicNumber >= 13 && atomicNumber <= 18) return String(atomicNumber)
    if (atomicNumber >= 31 && atomicNumber <= 36)
      return String(atomicNumber - 18)
    if (atomicNumber >= 49 && atomicNumber <= 54)
      return String(atomicNumber - 36)
    if (atomicNumber >= 81 && atomicNumber <= 86)
      return String(atomicNumber - 68)
    if (atomicNumber >= 113 && atomicNumber <= 118)
      return String(atomicNumber - 100)

    if (atomicNumber >= 21 && atomicNumber <= 30)
      return String(atomicNumber - 18)
    if (atomicNumber >= 39 && atomicNumber <= 48)
      return String(atomicNumber - 36)
    if (atomicNumber >= 71 && atomicNumber <= 80)
      return String(atomicNumber - 68)
    if (atomicNumber >= 103 && atomicNumber <= 112)
      return String(atomicNumber - 100)

    if (atomicNumber >= 57 && atomicNumber <= 70)
      return String(atomicNumber - 56)
    if (atomicNumber >= 89 && atomicNumber <= 102)
      return String(atomicNumber - 88)

    return '1'
  }

  const getGridRow = (atomicNumber: number): string => {
    if (atomicNumber <= 2) return '1'
    if (atomicNumber <= 10) return '2'
    if (atomicNumber <= 18) return '3'
    if (atomicNumber <= 36) return '4'
    if (atomicNumber <= 54) return '5'
    if (atomicNumber <= 86) return '6'
    if (atomicNumber <= 118) return '7'

    if (atomicNumber >= 57 && atomicNumber <= 70) return '9'
    if (atomicNumber >= 89 && atomicNumber <= 102) return '10'

    return '1'
  }

  return (
    <div className="">
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(18, 4rem)',
          gridTemplateRows: 'repeat(7, 4rem)',
          gridGap: '0.3rem',
        }}
      >
        {elements.map((element) => (
          <ElementCard
            key={element.AtomicNumber}
            //@ts-ignore
            element={element}
          />
        ))}
      </div>
      {renderLanthanidesAndActinides()}
    </div>
  )
}
