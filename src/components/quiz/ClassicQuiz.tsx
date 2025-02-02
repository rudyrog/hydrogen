import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
//@ts-ignore
import { useAuth } from "@/contexts/AuthContext";
import {
  incrementClassicQuizCompleted,
  incrementTimeSpent,
  incrementPoints,
} from "@/lib/firebase/profileFunctions";
import { Level } from "@/types/levels";
import { Trophy, XCircle } from "lucide-react";
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

  useEffect(() => {
    if (questions.length > 0 && currentQuestion <= questions.length) {
      const questionNameLength = questions[currentQuestion - 1].Name.length;
      setInputLength(questionNameLength);
      setValues(Array(questionNameLength).fill(""));
      setIsLoading(false);

      // Focus on first input after values are reset
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
        },
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
        },
      );
      const data = await response.json();
      const shuffledQuestions = data
        .sort(() => 0.5 - Math.random())
        .slice(0, noOfQuestions);
      console.log(shuffledQuestions);
      setQuestions(shuffledQuestions);
      setCurrentQuestion(1);
      setNoOfHints(1);
    } catch (error) {
      console.error("Error fetching next batch of questions:", error);
    }
  };

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
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
    e: React.KeyboardEvent<HTMLInputElement>,
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
    return <div className="p-3">Loading...</div>;
  }
  return (
    <div className="p-3">
      {isCompleted ? (
        <div className="cmp-txt text-3xl md:h-1/2 md:w-1/2 p-4 gap-2">
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
                <InteractiveHoverButton
                  onClick={() => setGameStarted(false)}
                  className="quiz-btn subtitle font-light w-fit mt-3 text-lg"
                >
                  Choose Quiz!
                </InteractiveHoverButton>
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
                <InteractiveHoverButton
                  onClick={() => setGameStarted(false)}
                  className="quiz-btn subtitle font-light w-fit mt-3 text-lg"
                >
                  Choose Quiz!
                </InteractiveHoverButton>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="border border-foreground/20 md:h-1/2 md:w-1/2 p-4 flex flex-col items-center justify-center bg-background/70">
          <div className="text-2xl text-center font-medium p-2 flex flex-col items-center justify-center gap-1">
            {!isTimelessMode && (
              <div className="text-xl font-bold">
                {formatTime(timeRemaining)}
              </div>
            )}
            Classic{" "}
            <p className="text-sm text-foreground/60">
              ({!isTimelessMode ? `${currentQuestion} of ${noOfQuestions}` : ""}
              )
            </p>
            {isTimelessMode && (
              <p className="text-sm text-foreground/60">
                Total Questions: {totalQuestionsAnswered}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center gap-2 p-3 border border-foreground/20 text-center md:text-3xl w-fit">
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
                className={`md:w-10 w-6 h-14 text-center text-xl bg-background/0 ${
                  value ? "border-none" : "border-b-2 border-foreground/30"
                } outline-none focus:border-b-2 focus:border-foreground`}
              />
            ))}
          </div>
          <div className="p-3 text-lg text-foreground/70">Hints!</div>
          <div className="flex justify-between gap-10 md:w-2/3">
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="rounded-full border border-foreground/20 flex items-center justify-center p-3 w-16 h-16">
                {noOfHints >= 1
                  ? questions[currentQuestion - 1].AtomicNumber
                  : "AN"}
              </div>
              {noOfHints >= 1 ? "AtomicNo" : ""}
            </div>

            <div className="flex flex-col justify-center items-center gap-2">
              <div className="rounded-full border border-foreground/20 flex items-center justify-center p-3 w-16 h-16 ">
                {noOfHints >= 2
                  ? questions[currentQuestion - 1].StandardState
                  : "?"}
              </div>
              {noOfHints >= 1 ? "State" : ""}
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="rounded-full border border-foreground/20 flex items-center justify-center p-3 w-16 h-16">
                {noOfHints >= 3 ? questions[currentQuestion - 1].Symbol : "?"}
              </div>
              {noOfHints >= 1 ? "Symbol" : ""}
            </div>
          </div>
          <div className="flex gap-4 items-center justify-center">
            <InteractiveHoverButton
              onClick={() => setNoOfHints(noOfHints + 1)}
              className="btn-pr font-light w-fit mt-3 text-lg border border-foreground/20"
            >
              Add Hint
            </InteractiveHoverButton>
            {isTimelessMode && (
              <InteractiveHoverButton
                onClick={handleQuit}
                className="btn-secondary font-light w-fit mt-3 text-lg border border-foreground/20 flex items-center gap-2"
              >
                Quit
              </InteractiveHoverButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
