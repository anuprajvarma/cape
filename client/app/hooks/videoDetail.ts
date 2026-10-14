import { useEffect, useState } from "react";
import { fetchVideoDetail } from "../utils/frontendApiCalls";

export const VideoDetail = ({
  videoId,
}: {
  videoId: string | string[] | undefined;
}) => {
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoDescription, setVideoDescription] = useState<string>("");

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

  return { videoTitle, videoDescription };
};
