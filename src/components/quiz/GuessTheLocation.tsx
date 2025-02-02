import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import elements from "@/data/elements.json";
import {
  incrementGuessTheLocationCompleted,
  incrementTimeSpent,
  incrementPoints,
} from "@/lib/firebase/profileFunctions";
import { Element } from "@/types/element";
import { Level } from "@/types/levels";
import { Trophy, XCircle } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AuroraText } from "../ui/aurora-text";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";

export const GuessTheLocation = ({
  level,
  time,
  noOfQuestions,
  setGameStarted,
  customMin,
  customMax,
}: {
  level: string;
  time: number;
  noOfQuestions: number;
  setGameStarted: Dispatch<SetStateAction<boolean>>;
  customMin: number | null;
  customMax: number | null;
}) => {
  const [questions, setQuestions] = useState<Element[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(time * 60);
  const [badEnding, setBadEnding] = useState(false);
  const [hintElements, setHintElements] = useState<number[]>([]);
  const [hintUsed, setHintUsed] = useState(false);
  const [isTimelessMode, setIsTimelessMode] = useState(time > 199);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);

  const { user } = useAuth();

  useEffect(() => {
    fetchQuestions();

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const fetchQuestions = async () => {
    try {
      const max = level === "Easy" ? 10 : level === "Medium" ? 20 : 30;
      const batchSize = 10; // Fetch 10 questions at a time
      let fetchedQuestions: Element[] = [];

      while (fetchedQuestions.length < noOfQuestions) {
        const response = await fetch(
          `/api/v1/getQuestion?min=${customMin ? customMin : 1}&max=${
            customMax ? customMax : max
          }`,
          {
            method: "GET",
            headers: {
              "x-api-key": process.env.NEXT_PUBLIC_API_SECRET_KEY || "",
            },
          }
        );
        const data = await response.json();
        const shuffledQuestions = data
          .sort(() => 0.5 - Math.random())
          .slice(0, batchSize);
        fetchedQuestions = [...fetchedQuestions, ...shuffledQuestions];

        if (fetchedQuestions.length >= noOfQuestions) {
          break;
        }
      }

      setQuestions(fetchedQuestions.slice(0, noOfQuestions));
      setCurrentQuestion(1);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getHint = () => {
    if (hintUsed) return;

    const currentElement = questions[currentQuestion - 1];
    const otherElements = elements
      .filter((e) => e.AtomicNumber !== currentElement.AtomicNumber)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const hintArray = [...otherElements, currentElement]
      .sort(() => 0.5 - Math.random())
      .map((e) => e.AtomicNumber);

    setHintElements(hintArray);
    setHintUsed(true);
  };

  useEffect(() => {
    setHintElements([]);
    setHintUsed(false);
  }, [currentQuestion]);

  useEffect(() => {
    if (isLoading || isGameCompleted || isTimelessMode) return;

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setBadEnding(true);
          setIsGameCompleted(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, isGameCompleted, isTimelessMode]);

  const handleQuit = () => {
    if (isTimelessMode) {
      if (user?.email) {
        //@ts-ignore
        incrementGuessTheLocationCompleted(user.email, level);
        incrementTimeSpent(user.email, totalQuestionsAnswered / 6); // Approximate time spent
      }
    }
    setGameStarted(false);
  };

  return (
    !isLoading && (
      <div className="flex flex-col gap-6">
        <div className="container mx-auto flex flex-row gap-3 w-4/5 items-center">
          {isGameCompleted ? (
            badEnding ? (
              <div className="flex flex-col items-center justify-center gap-8 p-8 text-center rounded-sm shadow-lg border border-black/30">
                <div className="flex flex-row items-center gap-4">
                  {" "}
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
              {time < 199 ? currentQuestion + " / " + noOfQuestions : ""} |{" "}
              {time < 199 ? formatTime(timeRemaining) : "Infinite!"}
              {isTimelessMode && (
                <div className="text-sm text-gray-600">
                  Total Questions: {totalQuestionsAnswered}
                </div>
              )}
              <div className="flex items-center gap-4">
                <div>Find {questions[currentQuestion - 1].Name}!</div>
                <InteractiveHoverButton
                  onClick={getHint}
                  disabled={hintUsed}
                  className={hintUsed ? "opacity-50 cursor-not-allowed" : ""}
                >
                  {hintUsed ? "Hint Used" : "Get Hint"}
                </InteractiveHoverButton>
              </div>
            </div>
          )}
        </div>
        {!isGameCompleted && (
          <div className="relative md:overflow-x-auto overflow-x-scroll w-screen md:flex p-5 items-end justify-center mb-10">
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
              //@ts-ignore
              level={level}
              isTimelessMode={isTimelessMode}
              setTotalQuestionsAnswered={setTotalQuestionsAnswered}
              fetchQuestions={fetchQuestions}
            />
          </div>
        )}
        {isTimelessMode && !isGameCompleted && (
          <div className="flex justify-center">
            <InteractiveHoverButton
              onClick={handleQuit}
              className="btn-secondary font-light w-fit mt-3 text-lg border border-foreground/20 flex items-center gap-2"
            >
              <XCircle className="w-5 h-5" /> Quit
            </InteractiveHoverButton>
          </div>
        )}
      </div>
    )
  );
};

const HiddenPeriodicTable = ({
  currentQuestionElementNumber,
  setCurrentQuestion,
  currentQuestion,
  noOfQuestions,
  setIsGameCompleted,
  totalTime,
  timeRemaining,
  hintElements,
  level,
  isTimelessMode,
  setTotalQuestionsAnswered,
  fetchQuestions,
}: {
  currentQuestionElementNumber: number;
  setCurrentQuestion: Dispatch<SetStateAction<number>>;
  currentQuestion: number;
  noOfQuestions: number;
  setIsGameCompleted: Dispatch<SetStateAction<boolean>>;
  totalTime: number;
  timeRemaining: number;
  hintElements: number[];
  level: Level;
  isTimelessMode: boolean;
  setTotalQuestionsAnswered: Dispatch<SetStateAction<number>>;
  fetchQuestions: () => Promise<void>;
}) => {
  const theme = useTheme();
  const { user } = useAuth();

  const checkAnswer = (element: Element) => {
    if (element.AtomicNumber === currentQuestionElementNumber) {
      // Increment points
      if (user?.email) {
        incrementPoints(user.email, 1);
      }

      // Update total questions answered
      if (isTimelessMode) {
        setTotalQuestionsAnswered((prev) => prev + 1);
      }

      if (currentQuestion < noOfQuestions) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        if (isTimelessMode) {
          fetchQuestions();
          setCurrentQuestion(1);
        } else {
          // Regular mode completion
          setIsGameCompleted(true);
          if (user?.email) {
            incrementGuessTheLocationCompleted(user.email, level);

            incrementTimeSpent(
              user.email,
              (totalTime * 60 - timeRemaining) / 60
            );
          }
        }
      }
    }
  };

  const ElementCard = ({ element }: { element: Element | undefined }) => {
    if (!element) return <div className="w-16 h-16 invisible" />;

    const isHinted = hintElements.includes(element.AtomicNumber);

    return (
      <button
        onClick={() => checkAnswer(element)}
        className={`md:w-16 md:h-16 w-12 h-12 p-1 text-center border border-border/50 dark:border-border/50 rounded cursor-pointer flex flex-col justify-around items-center transition-transform hover:scale-105 ${
          isHinted ? "ring-4 ring-black dark:ring-white" : ""
        }`}
        style={{
          backgroundColor: `#${
            // @ts-ignore
            theme === "dark" && element.CPKHexColor
              ? ((r, g, b) => {
                  const lightenFactor = 0.2;
                  return [
                    Math.min(255, Math.round(parseInt(r, 16) * lightenFactor))
                      .toString(16)
                      .padStart(2, "0"),
                    Math.min(255, Math.round(parseInt(g, 16) * lightenFactor))
                      .toString(16)
                      .padStart(2, "0"),
                    Math.min(255, Math.round(parseInt(b, 16) * lightenFactor))
                      .toString(16)
                      .padStart(2, "0"),
                  ].join("");
                })(
                  element.CPKHexColor.slice(0, 2),
                  element.CPKHexColor.slice(2, 4),
                  element.CPKHexColor.slice(4, 6)
                )
              : element.CPKHexColor || "808080"
          }`,
          gridColumn: getGridColumn(element.AtomicNumber),
          gridRow: getGridRow(element.AtomicNumber),
        }}
      >
        <div className="text-xs dark:text-black">{element.AtomicNumber}</div>
        <div className="text-xs font-bold dark:text-black">?</div>
      </button>
    );
  };

  const renderLanthanidesAndActinides = () => {
    const lanthanides = elements.filter(
      (e) => e.AtomicNumber >= 57 && e.AtomicNumber <= 70
    );
    const actinides = elements.filter(
      (e) => e.AtomicNumber >= 89 && e.AtomicNumber <= 102
    );

    return (
      <div className="w-[200vw] md:w-auto">
        <div className="flex md:justify-center md:gap-2 gap-5 mt-2">
          {lanthanides.map((element) => (
            <ElementCard
              key={element.AtomicNumber}
              //@ts-ignore
              element={element}
            />
          ))}
        </div>
        <div className="flex md:justify-center gap-2 mt-2">
          {actinides.map((element) => (
            <ElementCard
              key={element.AtomicNumber}
              //@ts-ignore
              element={element}
            />
          ))}
        </div>
      </div>
    );
  };

  const getGridColumn = (atomicNumber: number): string => {
    if (atomicNumber === 1) return "1";
    if (atomicNumber === 2) return "18";

    if (
      atomicNumber === 3 ||
      atomicNumber === 11 ||
      atomicNumber === 19 ||
      atomicNumber === 37 ||
      atomicNumber === 55 ||
      atomicNumber === 87
    )
      return "1";
    if (
      atomicNumber === 4 ||
      atomicNumber === 12 ||
      atomicNumber === 20 ||
      atomicNumber === 38 ||
      atomicNumber === 56 ||
      atomicNumber === 88
    )
      return "2";

    if (atomicNumber >= 5 && atomicNumber <= 10)
      return String(atomicNumber + 8);
    if (atomicNumber >= 13 && atomicNumber <= 18) return String(atomicNumber);
    if (atomicNumber >= 31 && atomicNumber <= 36)
      return String(atomicNumber - 18);
    if (atomicNumber >= 49 && atomicNumber <= 54)
      return String(atomicNumber - 36);
    if (atomicNumber >= 81 && atomicNumber <= 86)
      return String(atomicNumber - 68);
    if (atomicNumber >= 113 && atomicNumber <= 118)
      return String(atomicNumber - 100);

    if (atomicNumber >= 21 && atomicNumber <= 30)
      return String(atomicNumber - 18);
    if (atomicNumber >= 39 && atomicNumber <= 48)
      return String(atomicNumber - 36);
    if (atomicNumber >= 71 && atomicNumber <= 80)
      return String(atomicNumber - 68);
    if (atomicNumber >= 103 && atomicNumber <= 112)
      return String(atomicNumber - 100);

    if (atomicNumber >= 57 && atomicNumber <= 70)
      return String(atomicNumber - 56);
    if (atomicNumber >= 89 && atomicNumber <= 102)
      return String(atomicNumber - 88);

    return "1";
  };

  const getGridRow = (atomicNumber: number): string => {
    if (atomicNumber <= 2) return "1";
    if (atomicNumber <= 10) return "2";
    if (atomicNumber <= 18) return "3";
    if (atomicNumber <= 36) return "4";
    if (atomicNumber <= 54) return "5";
    if (atomicNumber <= 86) return "6";
    if (atomicNumber <= 118) return "7";

    if (atomicNumber >= 57 && atomicNumber <= 70) return "9";
    if (atomicNumber >= 89 && atomicNumber <= 102) return "10";

    return "1";
  };

  return (
    <div className="">
      <div
        className="grid md:gap-[0.3rem] gap-[0.0rem]"
        style={{
          gridTemplateColumns: "repeat(18, 4rem)",
          gridTemplateRows: "repeat(7, 4rem)",
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
  );
};
