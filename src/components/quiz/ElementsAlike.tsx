import { Element } from '@/types/element'
import { Clock } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'
import { useTheme } from '../../contexts/ThemeContext'

const Groups = [
  'Nonmetal',
  'Noble gas',
  'Alkali metal',
  'Alkaline earth metal',
  'Metalloid',
  'Halogen',
  'Post-transition metal',
]

function getRandomGroups(arr: string[], n: number): string[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]]
  }
  return shuffled.slice(0, n)
}

interface ElementsAlikeProps {
  level: 'Easy' | 'Medium' | 'Hard'
  time: number
  noOfQuestions: number
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ElementsAlike({
  level,
  time,
  noOfQuestions,
  setGameStarted,
}: ElementsAlikeProps) {
  const { theme } = useTheme()
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [questions, setQuestions] = useState<Element[]>([])
  const [isTimelessMode] = useState(time > 199)
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(time * 60)
  const [badEnding, setBadEnding] = useState(false)
  const [currentGroup, setCurrentGroup] = useState(0)
  const [questionGroups, setQuestionGroups] = useState<string[]>([])
  const [selectedElements, setSelectedElements] = useState<string[]>([])
  const [currentGroupElements, setCurrentGroupElements] = useState<Element[]>(
    [],
  )

  useEffect(() => {
    const initializeGame = async () => {
      const selectedGroups = getRandomGroups(Groups, noOfQuestions)
      setQuestionGroups(selectedGroups)
      if (selectedGroups.length > 0) {
        await fetchQuestions(selectedGroups[0])
      }
    }

    initializeGame()

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [noOfQuestions])

  useEffect(() => {
    if (isLoading || isCompleted || isTimelessMode) return

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
  }, [isLoading, isCompleted, isTimelessMode])

  const fetchQuestions = async (group: string) => {
    try {
      setIsLoading(true)
      const [questionsResponse, groupResponse] = await Promise.all([
        fetch(`/api/v1/getQuestion?min=1&max=200`),
        fetch(`/api/v1/getGroupElements?group=${encodeURIComponent(group)}`),
      ])

      if (!questionsResponse.ok || !groupResponse.ok) {
        throw new Error('Failed to fetch questions or group elements')
      }

      const questionsData = await questionsResponse.json()
      const groupData = await groupResponse.json()
      setCurrentGroupElements(groupData)
      let shuffledQuestions = [
        ...questionsData.slice(0, 25 - groupData.length),
        ...groupData,
      ]
      const uniqueQuestions = Array.from(
        new Map(
          shuffledQuestions.map((q: Element) => [q.AtomicNumber, q]),
        ).values(),
      )
      shuffledQuestions = uniqueQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, 25)

      setQuestions(shuffledQuestions)
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function areAllElementsCorrect(
    selectedElements: string[],
    currentGroupElements: { AtomicNumber: number }[],
  ): boolean {
    const groupAtomicNumbers = new Set(
      currentGroupElements.map((element) => element.AtomicNumber.toString()),
    )
    return selectedElements.every((atomicNumber) =>
      groupAtomicNumbers.has(atomicNumber),
    )
  }

  const handleNextQuestion = async () => {
    if (areAllElementsCorrect(selectedElements, currentGroupElements)) {
      if (currentQuestion < noOfQuestions) {
        setCurrentQuestion((prev) => prev + 1)
        setCurrentGroup((prev) => prev + 1)
        setSelectedElements([])
        await fetchQuestions(questionGroups[currentGroup + 1])
      } else {
        setIsCompleted(true)
      }
    } else {
      toast('The elements which you chose are incorrect, try again!')
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background py-8">
      <Toaster />
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-6">
          <div className="flex justify-between items-center mb-8">
            {!isTimelessMode && (
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-foreground dark:text-foreground" />
                <span className="text-lg font-medium text-foreground dark:text-foreground">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}

            <h1 className="text-4xl text-normal text-foreground font-[Monty]">
              {questionGroups[currentGroup]}
            </h1>

            <span className="text-lg font-medium text-foreground">
              {currentQuestion} / {noOfQuestions}
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-background rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-background rounded-full animate-bounce delay-100" />
              <div className="w-3 h-3 bg-background rounded-full animate-bounce delay-200" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-full p-8 flex items-center justify-center">
                <div className="flex flex-col">
                  {[...Array(5)].map((_, rowIndex) => (
                    <div
                      key={rowIndex}
                      className={`flex -my-4 ${
                        rowIndex % 2 === 0 ? 'ml-14' : ''
                      }`}
                    >
                      {[...Array(5)].map((_, colIndex) => {
                        const element = questions[rowIndex * 5 + colIndex]
                        return (
                          <div
                            key={`${rowIndex}-${colIndex}`}
                            className="relative group"
                            onClick={() => {
                              if (element) {
                                console.log(selectedElements)
                                setSelectedElements((prev) =>
                                  prev.includes(element.AtomicNumber.toString())
                                    ? prev.filter(
                                        (id) =>
                                          id !==
                                          element.AtomicNumber.toString(),
                                      )
                                    : [
                                        ...prev,
                                        element.AtomicNumber.toString(),
                                      ],
                                )
                              }
                            }}
                          >
                            <div className="w-28 h-32 relative">
                              <div className="absolute w-full h-full">
                                <svg
                                  viewBox="0 0 100 100"
                                  className="w-full h-full"
                                >
                                  <polygon
                                    points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25"
                                    className={`
                                        ${
                                          element &&
                                          selectedElements.includes(
                                            element.AtomicNumber.toString(),
                                          )
                                            ? 'fill-green-300 dark:fill-green-800'
                                            : 'fill-background dark:fill-background'
                                        }
                                        stroke-foreground/50 dark:stroke-foreground/50
                                        stroke transition-colors duration-200
                                      `}
                                  />
                                </svg>
                              </div>
                              {element && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="flex flex-col items-center justify-center text-center hover:text-yellow-500 transition-colors duration-200">
                                    <span
                                      className="text-base font-bold 
                                        transition-colors duration-200"
                                    >
                                      {element.Symbol}
                                    </span>
                                    <span
                                      className="text-sm 
                                        transition-colors duration-200 text-truncate"
                                    >
                                      {element.Name}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-background hover:bg-background dark:bg-background dark:hover:bg-background text-foreground rounded-lg transition-colors duration-200 font-semibold border border-border/50"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
