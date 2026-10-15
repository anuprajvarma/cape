import { RefObject, useEffect, useState } from "react";
import { saveQuizzes } from "../utils/backendApiCalls";
import { fetchQuizzes } from "../utils/frontendApiCalls";
import { QuizzType } from "@/types";

export const useQuizzSection = ({
  id,
  videoTitle,
  videoId,
  quizScrollRef,
  Completed,
  quizzcheck,
  setCompleted,
  setCountedScore,
}: {
  id: string;
  videoTitle: string;
  videoId: string;
  quizScrollRef: RefObject<HTMLDivElement | null>;
  Completed: number;
  quizzcheck: boolean;
  setCompleted: React.Dispatch<React.SetStateAction<number>>;
  setCountedScore: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [questions, setQuestion] = useState<string[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [dataFetching, setDataFetching] = useState<boolean>(false);
  const [quizz, setQuizz] = useState<QuizzType[]>([]);
  const [chooseOption, setChooseOption] = useState<string[]>([]);

  useEffect(() => {
    const container = quizScrollRef.current;
    if (!container) return;

    let timer: ReturnType<typeof setTimeout>;

    const handleActivity = () => {
      setShowCompleted(true);

      clearTimeout(timer);
      timer = setTimeout(() => {
        setShowCompleted(false);
      }, 2000);
    };

    handleActivity();

    container.addEventListener("scroll", handleActivity, { passive: true });
    container.addEventListener("touchstart", handleActivity, {
      passive: true,
    });
    container.addEventListener("wheel", handleActivity, { passive: true });

    return () => {
      clearTimeout(timer);
      container.removeEventListener("scroll", handleActivity);
      container.removeEventListener("touchstart", handleActivity);
      container.removeEventListener("wheel", handleActivity);
    };
  }, [Completed, quizzcheck, quizScrollRef]);

  const checkAnswer = (option: string, answer: string, question: string) => {
    console.log(
      `Selected Option: ${option} | Correct Answer: ${answer} | Question: ${question}`,
    );
    const selectedOption = option;
    const correctAnswer = answer;
    const isQuestionExists = questions.includes(question);
    if (!isQuestionExists) {
      setCompleted((prev) => prev + 1);
      setChooseOption((prev) => [...prev, selectedOption]);
      setQuestion((prev) => [...prev, question]);
      if (selectedOption === correctAnswer) {
        setCountedScore((prev) => prev + 1);

        console.log("Correct Answer!");
      } else {
        console.log("Wrong Answer! Try again. ");
      }
    }
  };

  const quizzHandler = async () => {
    try {
      setDataFetching(true);
      const result = await fetchQuizzes({ videoTitle });

      setDataFetching(false);
      setQuizz(result ?? []);

      await saveQuizzes({
        id,
        videoId,
        quizz: result ?? [],
      });
    } catch (error) {
      console.error("Error fetching from OpenRouter or saving to DB:", error);
    }
  };

  return {
    quizz,
    showCompleted,
    checkAnswer,
    chooseOption,
    dataFetching,
    quizzHandler,
  };
};
