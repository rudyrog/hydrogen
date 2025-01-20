import { useEffect, useRef, useState } from "react";
//@ts-ignore
import { InteractiveHoverButton } from "../ui/interactive-hover-button";
import { incrementClassicQuizCompleted } from "@/lib/firebase/profileFunctions";
import { useAuth } from "@/contexts/AuthContext";

interface Element {
  AtomicNumber: number;
  Symbol: string;
  Name: string;
  AtomicMass: number;
  CPKHexColor: string;
  ElectronConfiguration: string;
  Electronegativity: number;
  AtomicRadius: number;
  IonizationEnergy: number;
  ElectronAffinity: number;
  OxidationStates: string;
  StandardState: string;
  MeltingPoint: number;
  BoilingPoint: number;
  Density: number;
  GroupBlock: string;
  YearDiscovered: string;
}

export default function ClassicQuiz({
  level,
  time,
  noOfQuestions,
}: {
  level: "Easy" | "Medium" | "Hard";
  time: number;
  noOfQuestions: number;
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

  useEffect(() => {
    if (isLoading || isCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, isCompleted]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestion <= questions.length) {
      const questionNameLength = questions[currentQuestion - 1].Name.length;
      setInputLength(questionNameLength);
      setValues(Array(questionNameLength).fill(""));
      setIsLoading(false);
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
        `http://localhost:3000/api/v1/getQuestion?min=1&max=${max}`,
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
      if (currentQuestion < questions.length) {
        setCurrentQuestion((prev) => prev + 1);
        setNoOfHints(1);
        inputRefs.current[0]?.focus();
      } else {
        setIsCompleted(true);
        if (user?.email) incrementClassicQuizCompleted(user?.email);
      }
    }
  };

  useEffect(() => {
    if (values.join("").length === inputLength) {
      checkAnswer();
    }
  }, [values]);

  if (isLoading) {
    return <div className="p-3">Loading...</div>;
  }

  return (
    <div className="p-3">
      {isCompleted ? (
        <div className="cmp-txt text-3xl border border-black/20 h-1/2 w-1/2 p-4 gap-2">
          {timeRemaining === 0 ? "Time's up!" : "Finished!"}
          <br />
          <p className="text-lg">
            {/* Time remaining: {formatTime(timeRemaining)} */}
            Heisenberg Approved
          </p>
        </div>
      ) : (
        <div className="border border-black/20 h-1/2 w-1/2 p-4 flex flex-col items-center justify-center">
          <div className="text-2xl text-center font-medium p-2 flex flex-col items-center justify-center gap-1">
            <div className="text-xl font-bold">{formatTime(timeRemaining)}</div>
            Classic{" "}
            <p className="text-sm">
              ({currentQuestion} of {questions.length})
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 border border-black/40 text-center text-3xl w-fit">
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
                className={`w-10 h-14 text-center text-xl ${
                  value ? "border-none" : "border-b-2 border-black/30"
                } outline-none focus:border-b-2 focus:border-black`}
              />
            ))}
          </div>
          <div className="p-3 text-lg">Hints!</div>
          <div className="flex justify-between gap-10 w-2/3">
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="rounded-full border border-black/20 flex items-center justify-center p-3 w-16 h-16">
                {noOfHints >= 1
                  ? questions[currentQuestion - 1].AtomicNumber
                  : "AN"}
              </div>
              {noOfHints >= 1 ? "AtomicNo" : ""}
            </div>

            <div className="flex flex-col justify-center items-center gap-2">
              <div className="rounded-full border border-black/20 flex items-center justify-center p-3 w-16 h-16 ">
                {noOfHints >= 2
                  ? questions[currentQuestion - 1].StandardState
                  : "?"}
              </div>
              {noOfHints >= 1 ? "State" : ""}
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="rounded-full border border-black/20 flex items-center justify-center p-3 w-16 h-16">
                {noOfHints >= 3 ? questions[currentQuestion - 1].Symbol : "?"}
              </div>
              {noOfHints >= 1 ? "Symbol" : ""}
            </div>
          </div>
          <InteractiveHoverButton
            onClick={() => setNoOfHints(noOfHints + 1)}
            className="font-light w-fit mt-3 text-lg border border-black/15"
          >
            Add Hint
          </InteractiveHoverButton>
        </div>
      )}
    </div>
  );
}
