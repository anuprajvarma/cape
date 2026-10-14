import { useEffect, useState } from "react";
import { fetchVideoDetail } from "@/app/utils/frontendApiCalls";
import { ChapterCompletionTracker } from "./ChapterCompletionTracker";
import PlalistVideoCard from "./PlalistVideoCard";
import { PlaylistVideosPropType } from "@/types";

export const PlaylistVideos = ({
  id,
  videoId,
  playlistLengths,
  playlists,
  completedChapters,
  mobile,
  setVideoTitle,
  setVideoDescription,
}: PlaylistVideosPropType) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [precentage, setPrecentage] = useState<number>(0);

  const actualId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const playlist = async () => {
      if (typeof videoId === "string") {
        const result = await fetchVideoDetail({ videoId });
        if (result) {
          setVideoTitle(result[0]?.snippet.title);
          setVideoDescription(result[0]?.snippet.description);
        }
      }
    };
    if (videoId) {
      playlist();
    }
  }, [videoId]);

  useEffect(() => {
    if (actualId && playlistLengths[actualId]) {
      const percentage =
        (100 * completedChapters.length) / Number(playlistLengths[actualId]);
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
        {playlists?.map((data, index) => {
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
