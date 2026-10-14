import { useEffect, useState } from "react";
import { fetchPlaylistVideos } from "@/app/utils/frontendApiCalls";
import { ChapterCompletionTracker } from "./ChapterCompletionTracker";
import PlalistVideoCard from "./PlalistVideoCard";
import { playlistType2, PlaylistVideosPropType } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const PlaylistVideosSection = ({
  id,
  videoId,
  completedChapters,
  mobile,
}: PlaylistVideosPropType) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [precentage, setPrecentage] = useState<number>(0);
  const playlistLengths = useSelector(
    (state: RootState) => state.PlaylistLengthReducer,
  );
  const [PlaylistVideos, setPlaylistVideos] = useState<playlistType2[]>([]);

  const actualId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const playlist = async () => {
      if (typeof id === "string") {
        const result = await fetchPlaylistVideos({ id });
        setPlaylistVideos(result);
      }
    };
    playlist();
  }, [id]);

  useEffect(() => {
    if (actualId && playlistLengths) {
      const percentage =
        (100 * completedChapters.length) / Number(playlistLengths);
      setPrecentage(Math.round(percentage));
    }
  }, [actualId, playlistLengths, completedChapters.length]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <>
      {mobile && (
        <ChapterCompletionTracker
          id={id}
          playlistLengths={playlistLengths}
          completedChapters={completedChapters}
          precentage={precentage}
        />
      )}
      <div className="py-2 max-h-[41.6rem] flex flex-col gap-4 rounded-xl overflow-y-auto">
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
