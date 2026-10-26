import { useEffect, useState } from "react";
import { fetchPlaylistVideos } from "@/app/utils/frontendApiCalls";
import PlalistVideoCard from "./PlalistVideoCard";
import { playlistType2, PlaylistVideosPropType } from "@/types";
// import { useSelector } from "react-redux";
// import { RootState } from "../redux/store";
import Link from "next/link";

export const PlaylistVideosSection = ({
  id,
  videoId,
  setIsOpenMenu,
  completedChapters,
}: PlaylistVideosPropType) => {
  const [hasMounted, setHasMounted] = useState(false);
  // const playlistLengths = useSelector(
  //   (state: RootState) => state.PlaylistLengthReducer,
  // );
  const [PlaylistVideos, setPlaylistVideos] = useState<playlistType2[]>([]);

  // const actualId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const playlist = async () => {
      if (typeof id === "string") {
        const result = await fetchPlaylistVideos({ id });
        setPlaylistVideos(result);
      }
    };
    playlist();
  }, [id]);

  // useEffect(() => {
  //   if (actualId && playlistLengths) {
  //     const percentage =
  //       (100 * completedChapters.length) / Number(playlistLengths);
  //     setPrecentage(Math.round(percentage));
  //   }
  // }, [actualId, playlistLengths, completedChapters.length]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <>
      {/* {mobile && (
        <ChapterCompletionTracker
          id={id}
          playlistLengths={playlistLengths}
          completedChapters={completedChapters}
          precentage={precentage}
        />
      )} */}
      <div className="flex justify-between w-full px-2 h-16 text-brand-slate-1 ">
        <div className="flex justify-between items-center w-40 text-sm font-semibold">
          <Link
            href="/courses"
            className={`cursor-pointer hover:text-darkRed transition duration-300 hover:text-white py-2 px-3`}
          >
            Discover
          </Link>
          <Link
            href="/bookmark"
            className={`cursor-pointer hover:text-darkRed transition duration-300 hover:text-white py-2 px-3 `}
          >
            List
          </Link>
          <Link
            href="/dashboard"
            className={`cursor-pointer hover:text-darkRed transition duration-300 hover:text-white py-2 px-3`}
          >
            Score
          </Link>
        </div>
        <button
          className="cursor-pointer px-2 hover:text-white"
          onClick={() => setIsOpenMenu(false)}
        >
          X
        </button>
      </div>
      <div className="py-2 h-11/12 flex flex-col gap-4 rounded-xl overflow-y-auto">
        {PlaylistVideos?.map((data, index) => {
          const id = data.snippet?.playlistId;
          const videoid = data.snippet?.resourceId.videoId;
          const isChecked = completedChapters?.includes(videoid);
          if (!hasMounted) return null;
          return (
            <PlalistVideoCard
              title={data.snippet?.title}
              channelTitle={data.snippet?.channelTitle}
              thumbnails={data.snippet?.thumbnails.high?.url}
              id={id}
              isChecked={isChecked}
              videoId={videoid}
              currentvideoId={videoId as string}
              key={index}
              index={index}
            />
          );
        })}
      </div>
    </>
  );
};
