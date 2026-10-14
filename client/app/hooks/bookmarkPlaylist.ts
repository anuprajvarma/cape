import { useEffect, useState } from "react";
import { SessionAndRouterDetails } from "./sesionAndRouterDetail";
import { fetchBookmarkedCourses } from "../utils/backendApiCalls";
import { BookmarkType } from "@/types";

export const BookmarkPlaylisitHook = ({
  getDataCheck,
}: {
  getDataCheck: boolean;
}) => {
  const { session } = SessionAndRouterDetails();
  const [bookmarkCoursePlaylist, setBookmarkCoursePlaylist] = useState<
    BookmarkType[]
  >([]);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [checkDataExist, setCheckDataExist] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      setDataLoading(true);
      const email = session.data?.user?.email as string;
      const result = await fetchBookmarkedCourses(email);
      if (result) {
        setBookmarkCoursePlaylist(result);
        if (result.length > 0) {
          setCheckDataExist(false);
        } else {
          setCheckDataExist(true);
        }
      }
      setDataLoading(false);
    };
    if (session.data?.user !== undefined) {
      load();
    }
  }, [session.data?.user, getDataCheck]);
  return { bookmarkCoursePlaylist, dataLoading, checkDataExist };
};
