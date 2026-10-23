import { useEffect, useRef, useState } from "react";
import { fetchQuizzScore } from "../utils/backendApiCalls";
import { QuizzSectionPropType } from "@/types";
import { useSession } from "next-auth/react";
import { useQuizzSection } from "../hooks/quizzSection";

export const QuizzSection = ({
  videoTitle,
  id,
  videoId,
  Completed,
  quizzcheck,
  countedScore,
  setCompleted,
  setCountedScore,
}: QuizzSectionPropType) => {
  const session = useSession();
  const quizScrollRef = useRef<HTMLDivElement | null>(null);
  const [DbScore, setDbScore] = useState<string>("");
  const {
    quizz,
    showCompleted,
    checkAnswer,
    chooseOption,
    dataFetching,
    quizzHandler,
  } = useQuizzSection({
    id,
    videoTitle,
    videoId,
    quizScrollRef,
    Completed,
    quizzcheck,
    setCompleted,
    setCountedScore,
  });

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
            className="sm:px-12 sm:py-2 w-full h-full prose prose-lg prose-headings:my-0 prose-p:my-0 prose-li:my-0 prose-hr:my-6 prose-a:text-blue-600 prose-a:hover:underline max-w-none overflow-auto scrollbar-hide relative"
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
