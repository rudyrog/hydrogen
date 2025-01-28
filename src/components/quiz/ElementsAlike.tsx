import React, { useEffect, useState } from "react";

const Groups = [
  "Nonmetal",
  "Noble gas",
  "Alkali metal",
  "Alkaline earth metal",
  "Metalloid",
  "Halogen",
  "Post-transition metal",
];

function getRandomGroups(arr: string[], n: number): string[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled.slice(0, n);
}

interface ElementsAlikeProps {
  level: "Easy" | "Medium" | "Hard";
  time: number;
  noOfQuestions: number;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ElementsAlike({
  level,
  time,
  noOfQuestions,
  setGameStarted,
}: ElementsAlikeProps) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [questions, setQuestions] = useState<Element[]>([]);
  const [isTimelessMode] = useState(time > 199);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(time * 60);
  const [badEnding, setBadEnding] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(0);
  const [questionGroups, setQuestionGroups] = useState<string[]>([]);

  // Initialize groups and fetch first question
  useEffect(() => {
    const initializeGame = async () => {
      const selectedGroups = getRandomGroups(Groups, noOfQuestions);
      setQuestionGroups(selectedGroups);

      // Only fetch questions after groups are set
      if (selectedGroups.length > 0) {
        await fetchQuestions(selectedGroups[0]);
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    initializeGame();
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [noOfQuestions]);

  // Timer effect
  useEffect(() => {
    if (isLoading || isCompleted || isTimelessMode) return;

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
  }, [isLoading, isCompleted, isTimelessMode]);

  const fetchQuestions = async (group: string) => {
    try {
      setIsLoading(true);
      const max = level === "Easy" ? 10 : level === "Medium" ? 20 : 30;

      const [questionsResponse, groupResponse] = await Promise.all([
        fetch(`/api/v1/getQuestion?min=1&max=200`),
        fetch(`/api/v1/getGroupElements?group=${encodeURIComponent(group)}`),
      ]);

      if (!questionsResponse.ok || !groupResponse.ok) {
        throw new Error("Failed to fetch questions or group elements");
      }

      const questionsData = await questionsResponse.json();
      const groupData = await groupResponse.json();
      console.log(questionsData, groupData);
      let shuffledQuestions = questionsData
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
      shuffledQuestions = shuffledQuestions + groupData;
      setQuestions(shuffledQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for moving to next question
  const handleNextQuestion = async () => {
    if (currentQuestion < noOfQuestions) {
      setCurrentQuestion((prev) => prev + 1);
      setCurrentGroup((prev) => prev + 1);
      await fetchQuestions(questionGroups[currentGroup + 1]);
    } else {
      setIsCompleted(true);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (isCompleted) {
    return (
      <div className="text-center">
        <h1>Game Completed!</h1>
        {badEnding && <p>Time's up!</p>}
        {/* Add your game completion UI here */}
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1>Elements Alike</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {!isTimelessMode && (
            <p className="text-lg">
              Time Remaining: {formatTime(timeRemaining)}
            </p>
          )}
          <p className="text-lg">
            Current Group: {questionGroups[currentGroup]}
          </p>
          <p className="text-lg">
            Question {currentQuestion} of {noOfQuestions}
          </p>
          {/* Add your question display and answer UI here */}
          <button
            onClick={handleNextQuestion}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  );
}
