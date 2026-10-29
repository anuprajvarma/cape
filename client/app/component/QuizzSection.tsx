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

  // console.log("quizz " + quizz);

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
          <div className="w-full h-200 md:h-full flex flex-col justify-center items-center">
            <p className="sm:px-12 py-2 text-xl text-brand-slate-1">
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
            className="sm:px-4 sm:py-2 w-full md:h-full h-200 prose prose-lg prose-headings:my-0 prose-p:my-0 prose-li:my-0 prose-hr:my-6 prose-a:text-blue-600 prose-a:hover:underline max-w-none overflow-auto scrollbar-hide relative"
          >
            <div
              className={`sticky top-0 z-50 flex justify-end text-white transition-all  duration-300 ${
                showCompleted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-full pointer-events-none"
              }`}
            >
              <p className="text-sm text-center bg-lightSlaty rounded-lg px-4 py-2 text-brand-slate-1">{`Completed - ${Completed}/${quizz.length} `}</p>
            </div>
            {quizz.map((quizz, index) => (
              <div key={index} className="py-2 flex flex-col gap-2 w-full">
                <p className="text-white flex gap-2 font-semibold text-md sm:text-xl px-2">
                  {quizz.question}
                </p>
                <div className="w-full">
                  <div className="list-disc w-full pl-6 flex flex-col gap-2">
                    {quizz.options.map((option, idx) => (
                      <button
                        type="button"
                        onClick={() =>
                          checkAnswer(option, quizz.answer, quizz.question)
                        }
                        key={idx}
                        aria-pressed={chooseOption.includes(option)}
                        className={`hover:text-slaty w-11/12 flex gap-4 text-slaty/80 text-start border-lightSlaty px-4 py-1.5 hover:bg-slaty/10 rounded-lg cursor-pointer hover:bg-white/20 hover:backdrop-blur-2xl text-brand-slate-1 hover:text-white transition duration-500 border border-brand-slate-1/20 ${
                          chooseOption.includes(option)
                            ? "text-white bg-white/20 backdrop-blur-2xl border border-brand-slate-1/20"
                            : ""
                        }`}
                      >
                        <div className="flex justify-center items-center">
                          {chooseOption.includes(option) ? (
                            <div className="w-4 h-4 bg-white/20 backdrop-blur-2xl rounded-full"></div>
                          ) : (
                            "◯"
                          )}
                        </div>
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : dataFetching ? (
          <div className="w-full h-200 md:h-full flex flex-col justify-center items-center gap-4">
            <div className="px-4 py-1.5 hover:bg-slaty/10 rounded-lg cursor-pointer hover:bg-white/20 hover:backdrop-blur-2xl text-brand-slate-1 hover:text-white transition duration-500 border border-brand-slate-1/20">
              loading...
            </div>
          </div>
        ) : (
          <div className="w-full h-200 md:h-full flex flex-col justify-center items-center gap-4">
            <button
              className="px-4 py-1.5 hover:bg-slaty/10 rounded-lg cursor-pointer hover:bg-white/20 hover:backdrop-blur-2xl text-brand-slate-1 hover:text-white transition duration-500 border border-brand-slate-1/20"
              onClick={quizzHandler}
            >
              Click me
            </button>
          </div>
        ))}
    </>
  );
};
