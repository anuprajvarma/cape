import { ChapterCompletionPropType } from "@/types";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

export const ChapterCompletionTracker = ({
  id,
  playlistLengths,
  completedChapters,
  precentage,
}: ChapterCompletionPropType) => {
  return (
    <div className="border-b border-lightSlaty h-[3rem] bg-mediumSlaty rounded-t-xl p-2 flex justify-between items-center">
      <div className="flex flex-col text-sm">
        <div className="flex gap-2 font-semibold text-base text-slaty/90">
          <p className="text-slaty">Progress -</p>
          <div>
            {typeof id === "string" && playlistLengths[id] && (
              <p>{`${completedChapters?.length}/${playlistLengths[id]}`}</p>
            )}
          </div>
        </div>
      </div>
      <div className="w-[3rem] h-[2.5rem] rounded-lg flex flex-col gap-3 justify-center items-center">
        <CircularProgressbar
          value={precentage}
          text={`${precentage}%`}
          styles={buildStyles({
            strokeLinecap: "butt",
            textSize: "25px",
            pathColor: "#1A56DB",
            textColor: "#D1D5DB",
            trailColor: "#d6d6d6",
          })}
          className="h-[3rem]"
        />
      </div>
    </div>
  );
};
