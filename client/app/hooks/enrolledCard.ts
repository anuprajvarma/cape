import { useEffect, useState } from "react";
import { useSessionsDetails } from "./sesionAndRouterDetail";
import { fetchMultipleTypeData } from "../utils/backendApiCalls";
import { percentageCalculate } from "../utils/reusableConstant";
import { PlaylistLength } from "../utils/frontendApiCalls";
import { toast } from "react-toastify";

export const useEnrolledCardLogic = ({
  playlistId,
  getDataCheck,
  setGetDataCheck,
}: {
  playlistId: string;
  getDataCheck: boolean;
  setGetDataCheck: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { session } = useSessionsDetails();
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [playlistChapters, setPlaylistChapters] = useState<number>(0);
  const [precentage, setPrecentage] = useState<number>(0);
  useEffect(() => {
    try {
      const fetchEnrolledData = async () => {
        const data = await PlaylistLength({ id: playlistId });
        setPlaylistChapters(data.items[0].contentDetails.itemCount);
        const chapterLenght = data.items[0].contentDetails.itemCount;
        const percentage = percentageCalculate({
          completedChapters,
          chapterLenght,
        });
        setPrecentage(Math.round(percentage));
      };
      fetchEnrolledData();
    } catch (error) {
      console.log(error);
    }
  }, [playlistId, session.data?.user, completedChapters]);

  useEffect(() => {
    const getChapterData = async () => {
      const result = await fetchMultipleTypeData({
        email: session.data?.user?.email ?? "",
        playlistId,
        url: "/enrolledCourse/getChapterData",
      });
      if (result.getChapterData?.chapters) {
        setCompletedChapters(result.getChapterData?.chapters);
      }
    };

    getChapterData();
  }, [session.data?.user, playlistId, completedChapters.length, precentage]);

  const handleDeletEnrolledCourse = async ({
    playlistId,
  }: {
    playlistId: string;
  }) => {
    await fetchMultipleTypeData({
      email: session.data?.user?.email ?? "",
      playlistId,
      url: "/enrolledCourse/delete",
    });
    toast.success("course is delete", {
      hideProgressBar: true,
    });
    setGetDataCheck(!getDataCheck);
  };

  return {
    playlistChapters,
    completedChapters,
    handleDeletEnrolledCourse,
    precentage,
  };
};
