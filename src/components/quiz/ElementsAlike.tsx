import React, { useEffect, useState } from 'react'

export default function ElementsAlike(
    {
        level,
        time,
        noOfQuestions,
        setGameStarted
    } : {
        level: string,
        time: number,
        noOfQuestions: number,
        setGameStarted: React.Dispatch<React.SetStateAction<boolean>>
    }
) {
     const [currentQuestion, setCurrentQuestion] = useState(1);
      const [questions, setQuestions] = useState<Element[]>([]);
  const [isTimelessMode, setIsTimelessMode] = useState(time > 199);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
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
  
   const formatTime = (seconds: number) => {
     const minutes = Math.floor(seconds / 60);
     const remainingSeconds = seconds % 60;
     return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
   };
    const fetchQuestions = async () => {
      try {
        const max = level === "Easy" ? 10 : level === "Medium" ? 20 : 30;
        const response = await fetch(`/api/v1/getQuestion?min=1&max=200`);
        const data = await response.json();
        const shuffledQuestions = data
          .sort(() => 0.5 - Math.random())
          .slice(0, 25);
          console.log(shuffledQuestions)
        setQuestions(shuffledQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
  return <div>ElementsAlike</div>;
}
