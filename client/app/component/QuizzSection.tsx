import { useEffect, useRef, useState } from "react";
import { fetchQuizzScore, saveQuizzes } from "../utils/backendApiCalls";
import { fetchQuizzes } from "../utils/frontendApiCalls";
import { QuizzType } from "@/types";
import { useSession } from "next-auth/react";

export const QuizzSection = ({
  videoTitle,
  id,
  videoId,
  Completed,
  quizzcheck,
  countedScore,
  setCompleted,
  setCountedScore,
}: {
  videoTitle: string;
  id: string;
  videoId: string;
  Completed: number;
  quizzcheck: boolean;
  countedScore: number;
  setCompleted: React.Dispatch<React.SetStateAction<number>>;
  setCountedScore: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const session = useSession();
  const quizScrollRef = useRef<HTMLDivElement>(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const [DbScore, setDbScore] = useState<string>("");
  const [dataFetching, setDataFetching] = useState<boolean>(false);
  const [questions, setQuestion] = useState<string[]>([]);
  const [quizz, setQuizz] = useState<QuizzType[]>([]);
  const [chooseOption, setChooseOption] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserScore = async () => {
      const data = await fetchQuizzScore({
        playlistId: id,
        videoId,
        email: session.data?.user?.email ?? "",
      });
      if (data.userScore?.score !== undefined) {
        setDbScore(data.userScore?.score);
      }
    };

    if (Completed === 10 || Completed === 0) {
      fetchUserScore();
    }
  }, [Completed, id, videoId, session.data?.user?.email]);

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
    container.addEventListener("touchstart", handleActivity, { passive: true });
    container.addEventListener("wheel", handleActivity, { passive: true });

    return () => {
      clearTimeout(timer);
      container.removeEventListener("scroll", handleActivity);
      container.removeEventListener("touchstart", handleActivity);
      container.removeEventListener("wheel", handleActivity);
    };
  }, [Completed, quizzcheck]);

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
  return (
    <>
      {quizzcheck &&
        (DbScore !== "" || Completed === 10 ? (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <p className="sm:px-12 py-2 text-xl">
              Congratulations! You have completed the test
            </p>
            <div className="flex gap-2 text-xl font-semibold">
              <p>Score -</p>
              <p>{`${DbScore ? DbScore : countedScore}/10`}</p>
            </div>
          </div>
        ) : quizz.length > 0 ? (
          <div
            ref={quizScrollRef}
            className="sm:px-12 sm:py-2 w-full h-full prose prose-lg prose-headings:my-0 prose-p:my-0 prose-li:my-0 prose-hr:my-6 prose-a:text-blue-600 hover:prose-a:underline max-w-none overflow-auto scrollbar-hide relative"
          >
            <div
              className={`sticky top-0 z-50 flex justify-end text-white transition-all  duration-300 ${
                showCompleted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-full pointer-events-none"
              }`}
            >
              <p className="text-sm text-center bg-lightSlaty rounded-lg px-4 py-2">{`Completed - ${Completed}/${quizz.length} `}</p>
            </div>
            {quizz.map((quizz, index) => (
              <div key={index} className="py-2 flex flex-col gap-2">
                <div className="text-white flex gap-2 font-semibold text-xl">
                  <p>{quizz.question}</p>
                </div>
                <div>
                  <div className="list-disc pl-6 flex flex-col gap-2">
                    {quizz.options.map((option, idx) => (
                      <button
                        type="button"
                        onClick={() =>
                          checkAnswer(option, quizz.answer, quizz.question)
                        }
                        key={idx}
                        aria-pressed={chooseOption.includes(option)}
                        className={`hover:text-slaty flex gap-4 text-slaty/80 text-start rounded-lg border border-lightSlaty hover:bg-blue-600/25 px-8 py-2 transition duration-300 ${
                          chooseOption.includes(option)
                            ? "text-slaty bg-blue-600/25"
                            : ""
                        }`}
                      >
                        <span aria-hidden="true">
                          {chooseOption.includes(option) ? "🔵" : "◯"}
                        </span>
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : dataFetching ? (
          <div className="w-full h-full flex flex-col justify-center items-center gap-4">
            <div className="px-4 py-1 rounded-lg hover:bg-slaty/10 transition duration-300 border border-lightSlaty">
              loading...
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center gap-4">
            <button
              className="px-4 py-1 rounded-lg hover:bg-slaty/10 transition duration-300 border border-lightSlaty"
              onClick={quizzHandler}
            >
              Click me
            </button>
          </div>
        ))}
    </>
  );
};
