import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import elements from "@/data/elements.json";
import { Element } from "@/types/element";

export const GuessTheLocation = ({
  level,
  time,
  noOfQuestions,
}: {
  level: string;
  time: number;
  noOfQuestions: number;
}) => {
  const [questions, setQuestions] = useState<Element[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(time * 60);
  const [badEnding, setBadEnding] = useState(false);

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
      const response = await fetch(
        `http://localhost:3000/api/v1/getQuestion?min=1&max=${max}`,
      );
      const data = await response.json();
      const shuffledQuestions = data
        .sort(() => 0.5 - Math.random())
        .slice(0, noOfQuestions);
      setQuestions(shuffledQuestions);
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

  useEffect(() => {
    if (isLoading || isGameCompleted) return;

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
  }, [isLoading, isGameCompleted]);

  return (
    !isLoading && (
      <div className="flex flex-col gap-12 py-8">
        <div className="container mx-auto flex flex-col gap-3 w-4/5">
          {currentQuestion} / {noOfQuestions} | {formatTime(timeRemaining)}
          <div className="p-3 rounded-3xl border w-fit text-3xl">
            {isGameCompleted ? (
              badEnding ? (
                <div>You suck</div>
              ) : (
                <div>Yoooo you won!!!</div>
              )
            ) : (
              <div>Find {questions[currentQuestion - 1].Name}!</div>
            )}
          </div>
        </div>
        {!isGameCompleted && (
          <div className="relative w-screen  flex items-end justify-center ">
            <HiddenPeriodicTable
              currentQuestionElementNumber={
                questions[currentQuestion - 1].AtomicNumber
              }
              setCurrentQuestion={setCurrentQuestion}
              currentQuestion={currentQuestion}
              noOfQuestions={noOfQuestions}
              setIsGameCompleted={setIsGameCompleted}
            />
          </div>
        )}
      </div>
    )
  );
};

// ITS CHAOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOS
//

const HiddenPeriodicTable = ({
  currentQuestionElementNumber,
  setCurrentQuestion,
  currentQuestion,
  noOfQuestions,
  setIsGameCompleted,
}: {
  currentQuestionElementNumber: number;
  setCurrentQuestion: Dispatch<SetStateAction<number>>;
  currentQuestion: number;
  noOfQuestions: number;
  setIsGameCompleted: Dispatch<SetStateAction<boolean>>;
}) => {
  const checkAnswer = (element: Element) => {
    console.log(element, currentQuestionElementNumber);

    if (element.AtomicNumber === currentQuestionElementNumber) {
      console.log(element);
      if (currentQuestion < noOfQuestions)
        setCurrentQuestion(currentQuestion + 1);
      else setIsGameCompleted(true);
    }
  };
  const ElementCard = ({ element }: { element: Element | undefined }) => {
    if (!element) return <div className="w-16 h-16 invisible" />;

    return (
      <div
        onClick={() => checkAnswer(element)}
        className="w-16 h-16 p-1 text-center border rounded transition-transform hover:scale-105 cursor-pointer flex flex-col justify-between"
        style={{
          backgroundColor: `#${element.CPKHexColor || "808080"}`,
          gridColumn: getGridColumn(element.AtomicNumber),
          gridRow: getGridRow(element.AtomicNumber),
        }}
      >
        <div className="text-xs">{element.AtomicNumber}</div>
        <div className="text-sm font-bold">?</div>
        <div className="text-xs truncate">?</div>
      </div>
    );
  };
  const renderLanthanidesAndActinides = () => {
    const lanthanides = elements.filter(
      (e) => e.AtomicNumber >= 57 && e.AtomicNumber <= 70,
    );
    const actinides = elements.filter(
      (e) => e.AtomicNumber >= 89 && e.AtomicNumber <= 102,
    );

    return (
      <div className="">
        <div className="flex justify-center gap-1 mt-1">
          {lanthanides.map((element) => (
            <ElementCard
              key={element.AtomicNumber}
              //@ts-ignore
              element={element}
            />
          ))}
        </div>
        <div className="flex justify-center gap-1 mt-1">
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

    // For p-block elements
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

    // For d-block elements
    if (atomicNumber >= 21 && atomicNumber <= 30)
      return String(atomicNumber - 18);
    if (atomicNumber >= 39 && atomicNumber <= 48)
      return String(atomicNumber - 36);
    if (atomicNumber >= 71 && atomicNumber <= 80)
      return String(atomicNumber - 68);
    if (atomicNumber >= 103 && atomicNumber <= 112)
      return String(atomicNumber - 100);

    // For f-block elements (lanthanides and actinides)
    if (atomicNumber >= 57 && atomicNumber <= 70)
      return String(atomicNumber - 56);
    if (atomicNumber >= 89 && atomicNumber <= 102)
      return String(atomicNumber - 88);

    return "1";
  };

  const getGridRow = (atomicNumber: number): string => {
    // Main block
    if (atomicNumber <= 2) return "1";
    if (atomicNumber <= 10) return "2";
    if (atomicNumber <= 18) return "3";
    if (atomicNumber <= 36) return "4";
    if (atomicNumber <= 54) return "5";
    if (atomicNumber <= 86) return "6";
    if (atomicNumber <= 118) return "7";

    // f-block
    if (atomicNumber >= 57 && atomicNumber <= 70) return "9"; // Lanthanides
    if (atomicNumber >= 89 && atomicNumber <= 102) return "10"; // Actinides

    return "1";
  };

  return (
    <div className="">
      <div
        className="grid "
        style={{
          gridTemplateColumns: "repeat(18, 4rem)",
          gridTemplateRows: "repeat(7, 4rem)",
          gridGap: "0.08rem",
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
