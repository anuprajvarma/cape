"use client";

import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useSession } from "next-auth/react";
import {
  DndContext,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CourseLinkModal } from "../component/CourseLinkModal";
import { BookmarkPlaylistType } from "@/types";
import { SortEnrolledCourses } from "../component/SortEnrolledCourses";
import {
  fetchEnrolledCourses,
  playlistOrderUpdate,
} from "../utils/backendApiCalls";

const Dashboard: React.FC = () => {
  const [enrolledCoursePlaylist, setEnrolledCoursePlaylist] = useState<
    BookmarkPlaylistType[]
  >([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [getDataCheck, setGetDataCheck] = useState(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [checkDataExist, setCheckDataExist] = useState(false);
  const { data: session } = useSession();

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 5 },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 5 },
  });

  const sensors = useSensors(isMobile ? touchSensor : mouseSensor);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    console.log(active.id + " " + over.id);

    setEnrolledCoursePlaylist((items) => {
      const oldIndex = items.findIndex((item) => item.playlistId === active.id);
      const newIndex = items.findIndex((item) => item.playlistId === over.id);
      console.log(oldIndex + " " + newIndex);
      const updatedItems = arrayMove(items, oldIndex, newIndex);
      playlistOrderUpdate({
        email: session?.user?.email || "",
        updatedItems,
      });

      return updatedItems;
    });
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

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

  if (!hasMounted) return null;

  return (
    <>
      <CourseLinkModal />
      <div className="w-full h-[90vh] py-8 px-4 text-black flex justify-center mt-16">
        <div className="w-[70rem] h-full flex flex-col gap-12">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={enrolledCoursePlaylist.map((item) => item.playlistId)}
              strategy={verticalListSortingStrategy}
            >
              {enrolledCoursePlaylist.length > 0 ? (
                enrolledCoursePlaylist.map((data) => (
                  <SortEnrolledCourses
                    key={data.playlistId}
                    id={data.playlistId}
                    data={data}
                    setGetDataCheck={setGetDataCheck}
                    getDataCheck={getDataCheck}
                  />
                ))
              ) : checkDataExist ? (
                <p className="text-xl text-center text-slaty">
                  You have not enrolled in any courses.
                </p>
              ) : dataLoading ? (
                <p className="text-xl text-center text-slaty">Loading...</p>
              ) : (
                <div className="h-full w-full flex justify-center items-center">
                  <p className="text-xl text-center text-slaty">
                    You are not Sign in
                  </p>
                </div>
              )}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
