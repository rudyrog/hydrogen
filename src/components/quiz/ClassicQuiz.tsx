import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  incrementClassicQuizCompleted,
  incrementTimeSpent,
  incrementPoints,
} from "@/lib/firebase/profileFunctions";
import { Level } from "@/types/levels";
import { Trophy } from "lucide-react";
import { useTheme } from "next-themes";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";
import { Element } from "@/types/element";

export default function ClassicQuiz({
  level,
  time,
  noOfQuestions,
  setGameStarted,
  customMin,
  customMax,
}: {
  level: Level;
  time: number;
  noOfQuestions: number;
  setGameStarted: Dispatch<SetStateAction<boolean>>;
  customMin: number | null;
  customMax: number | null;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [questions, setQuestions] = useState<Element[]>([]);
  const [inputLength, setInputLength] = useState(0);
  const [values, setValues] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(time * 60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [noOfHints, setNoOfHints] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [badEnding, setBadEnding] = useState(false);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);
  const [isTimelessMode, setIsTimelessMode] = useState(time > 199);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const theme = useTheme().theme;

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

  useEffect(() => {
    if (isLoading || isCompleted) return;

    if (!isTimelessMode) {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsCompleted(true);
            setBadEnding(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLoading, isCompleted, isTimelessMode]);

  // Update progress when question changes
  useEffect(() => {
    if (currentQuestion === 1) {
      setProgress(0);
    } else {
      setProgress(((currentQuestion - 1) / noOfQuestions) * 100);
    }
  }, [currentQuestion, noOfQuestions]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestion <= questions.length) {
      const questionNameLength = questions[currentQuestion - 1].Name.length;
      setInputLength(questionNameLength);
      setValues(Array(questionNameLength).fill(""));
      setIsLoading(false);

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 0);
    }
  }, [questions, currentQuestion]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const fetchQuestions = async () => {
    try {
      const max = level === "Easy" ? 10 : level === "Medium" ? 20 : 30;
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
        .slice(0, noOfQuestions);
      setQuestions(shuffledQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchNextBatch = async () => {
    try {
      const max = level === "Easy" ? 10 : level === "Medium" ? 20 : 30;
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
        .slice(0, noOfQuestions);
      setQuestions(shuffledQuestions);
      setCurrentQuestion(1);
      setNoOfHints(1);
    } catch (error) {
      console.error("Error fetching next batch of questions:", error);
    }
  };

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValues = [...values];
    newValues[index] = e.target.value.slice(-1);
    setValues(newValues);

    if (e.target.value && index < inputLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const checkAnswer = () => {
    if (!questions[currentQuestion - 1]) return;

    const word = values.join("");
    if (
      word.toLowerCase() === questions[currentQuestion - 1].Name.toLowerCase()
    ) {
      if (user?.email) {
        incrementPoints(user.email, 1);
      }

      const newTotalQuestions = totalQuestionsAnswered + 1;
      setTotalQuestionsAnswered(newTotalQuestions);

      if (currentQuestion < questions.length) {
        setCurrentQuestion((prev) => prev + 1);
        setNoOfHints(1);
      } else {
        if (newTotalQuestions < noOfQuestions) {
          fetchNextBatch();
        } else {
          setIsCompleted(true);
          if (user?.email && !badEnding) {
            incrementClassicQuizCompleted(user?.email, level);
            incrementTimeSpent(user?.email, (time * 60 - timeRemaining) / 60);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (values.join("").length === inputLength) {
      checkAnswer();
    }
  }, [values]);

  const handleQuit = () => {
    if (isTimelessMode) {
      if (user?.email) {
        incrementClassicQuizCompleted(user.email, level);
        incrementTimeSpent(user.email, totalQuestionsAnswered / 6);
      }
    }
    setGameStarted(false);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="">
      {isCompleted ? (
        <div className="w-full max-w-2xl">
          {badEnding ? (
            <div className="flex flex-col items-center justify-center p-6 md:p-8 rounded-lg shadow-lg border border-foreground/20 bg-background/95 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-6">
                <p className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground animate-bounce">
                  You Lose!
                </p>
                <p className="text-lg md:text-xl text-foreground/60 italic">
                  Almost had it? Challenge yourself again!
                </p>
                <InteractiveHoverButton
                  onClick={() => setGameStarted(false)}
                  className="px-6 py-3 rounded-full bg-background hover:bg-foreground/10 transition-all duration-200"
                >
                  Choose New Quiz
                </InteractiveHoverButton>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 md:p-8 rounded-lg shadow-lg border border-foreground/20 bg-background/95 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-4">
                  <Trophy className="w-12 h-12 md:w-16 md:h-16 text-yellow-300 animate-pulse" />
                  <p className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
                    You Win!
                  </p>
                </div>
                <p className="text-lg md:text-xl text-foreground/60 italic">
                  Congratulations on your victory! Ready for another challenge?
                </p>
                <InteractiveHoverButton
                  onClick={() => setGameStarted(false)}
                  className="px-6 py-3 rounded-full bg-background hover:bg-foreground/10 transition-all duration-200"
                >
                  Choose New Quiz
                </InteractiveHoverButton>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <div className="rounded-lg border border-foreground/20 p-4 md:p-8 bg-background/95 backdrop-blur-sm">
            {!isTimelessMode && (
              <div className="mb-6">
                <div className="flex justify-between text-md mb-2">
                  <span>Classic Mode Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground/30 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col items-center text-center mb-6 md:mb-8">
              {!isTimelessMode && (
                <div className="text-lg md:text-xl flex flex-col gap-4">
                  {formatTime(timeRemaining)}
                  <div className="font-[monty] text-4xl md:text-6xl flex items-center justify-center">
                    {questions[currentQuestion - 1]?.AtomicNumber}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-6 md:gap-8">
              <div className="w-full overflow-x-auto py-2">
                <div
                  className={`flex items-center justify-center gap-2 md:gap-3 min-w-min 
                  ${
                    inputLength > 12
                      ? "scale-75 md:scale-90"
                      : inputLength > 8
                      ? "scale-90 md:scale-95"
                      : ""
                  }`}
                >
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
                      className={`w-7 h-9 md:w-12 md:h-14 text-xl md:text-2xl text-center transition-all duration-75 bg-transparent
                        ${
                          value
                            ? "border-b-2 border-foreground"
                            : "border-b-2 border-foreground/20"
                        } 
                        outline-none focus:border-foreground/50 transition-all duration-200`}
                    />
                  ))}
                </div>
              </div>

              <div className="w-full">
                <h3 className="font-[monty] text-lg md:text-xl text-center mb-4">
                  Hints
                </h3>
                <div className="flex justify-center gap-4 md:gap-8">
                  {[
                    {
                      value:
                        noOfHints >= 2
                          ? questions[currentQuestion - 1].StandardState
                          : "?",
                      label: noOfHints >= 1 ? "State" : "???",
                    },
                    {
                      value:
                        noOfHints >= 3
                          ? questions[currentQuestion - 1].Symbol
                          : "?",
                      label: noOfHints >= 1 ? "Symbol" : "???",
                    },
                  ].map((hint, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="rounded-lg border border-foreground/20 w-16 h-14 md:w-20 md:h-18 flex items-center justify-center text-base md:text-lg font-medium bg-background/50 hover:bg-background/70 transition-all duration-200">
                        {hint.value}
                      </div>
                      <span className="text-xs md:text-sm text-foreground/60">
                        {hint.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 md:gap-4">
                <InteractiveHoverButton
                  onClick={() => setNoOfHints(noOfHints + 1)}
                  className="px-4 md:px-6 py-2 text-sm md:text-base rounded-full bg-background hover:bg-foreground/10 transition-all duration-200 border border-border/50"
                >
                  Reveal Hint
                </InteractiveHoverButton>
                {isTimelessMode && (
                  <InteractiveHoverButton
                    onClick={handleQuit}
                    className="px-4 md:px-6 py-2 text-sm md:text-base rounded-full bg-background hover:bg-foreground/10 transition-all duration-200 flex items-center gap-2"
                  >
                    Quit Game
                  </InteractiveHoverButton>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
