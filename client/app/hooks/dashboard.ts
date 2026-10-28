import { useSession } from "next-auth/react";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { BookmarkPlaylistType } from "@/types";
import { useEffect, useState } from "react";
import {
  fetchEnrolledCourses,
  playlistOrderUpdate,
} from "../utils/backendApiCalls";

export const useDashboard = ({ getDataCheck }: { getDataCheck: boolean }) => {
  const [enrolledCoursePlaylist, setEnrolledCoursePlaylist] = useState<
    BookmarkPlaylistType[]
  >([]);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [checkDataExist, setCheckDataExist] = useState(false);
  const { data: session } = useSession();

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // console.log(active.id + " " + over.id);

    setEnrolledCoursePlaylist((items) => {
      const oldIndex = items.findIndex((item) => item.playlistId === active.id);
      const newIndex = items.findIndex((item) => item.playlistId === over.id);
      // console.log(oldIndex + " " + newIndex);
      const updatedItems = arrayMove(items, oldIndex, newIndex);
      playlistOrderUpdate({
        email: session?.user?.email || "",
        updatedItems,
      });

      return updatedItems;
    });
  };

  useEffect(() => {
    const handleEnrolled = async () => {
      if (!session?.user?.email) return;
      setDataLoading(true);

      const data = await fetchEnrolledCourses({ email: session.user.email });

      const enrolled = data.enrolledkCourse ?? [];

      const sortedEnrolled = [...enrolled].sort(
        (a, b) => a.indexOrder - b.indexOrder,
      );

      setEnrolledCoursePlaylist(sortedEnrolled);
      setCheckDataExist(enrolled.length === 0);
      setDataLoading(false);
    };

    handleEnrolled();
  }, [session?.user?.email, getDataCheck]);

  return { handleDragEnd, dataLoading, checkDataExist, enrolledCoursePlaylist };
};
