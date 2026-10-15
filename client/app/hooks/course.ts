import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useSessionsDetails } from "./sesionAndRouterDetail";
import { useEffect, useState } from "react";
import {
  fetchfirstVideoIdOfPlaylist,
  fetchVideoDetail,
  PlaylistLength,
} from "../utils/frontendApiCalls";
import { fetchMultipleTypeData } from "../utils/backendApiCalls";
import { setPlayListLength } from "@/app/redux/slices/PlaylistLengthSlice";

export const useCourse = ({
  id,
  videoId,
}: {
  id: string | string[] | undefined;
  videoId: string | string[] | undefined;
}) => {
  const { router, session } = useSessionsDetails();
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoDescription, setVideoDescription] = useState<string>("");
  const checkboxTrack = useSelector((state: RootState) => state.checkbox);
  const dispatch = useDispatch<AppDispatch>();

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
    const fetchLengths = async () => {
      const data = await PlaylistLength({ id });
      dispatch(setPlayListLength(data.items[0].contentDetails.itemCount));
    };

    fetchLengths();
  }, [id]);

  useEffect(() => {
    const load = async () => {
      const result = await fetchfirstVideoIdOfPlaylist(id);
      router.push(`/course/${id}/${result}`);
    };
    if (videoId === "1") {
      load();
    }
  }, [id, videoId, router]);

  useEffect(() => {
    const getChapterData = async () => {
      if (typeof id === "string") {
        const result = await fetchMultipleTypeData({
          email: session.data?.user?.email ?? "",
          playlistId: id,
          url: "/enrolledCourse/getChapterData",
        });
        if (result.getChapterData?.chapters) {
          setCompletedChapters(result.getChapterData?.chapters);
        }
      }
    };
    getChapterData();
  }, [session.data?.user, id, checkboxTrack]);
  return { completedChapters, videoTitle, videoDescription };
};
