"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CourseLinkModal from "../component/CourseLinkModal";

// dynamically import EnrolledCard to avoid SSR issues
const EnrolledCard = dynamic(() => import("../component/EnrolledCard"), {
  ssr: false,
});

interface BookmarkPlaylistType {
  title: string;
  channelTitle: string;
  thumbnail: string;
  chapterLength: string;
  channelImage: string;
  playlistId: string;
  playlistDescription: string;
  firstVideoId: string;
}

// Single sortable item component
function SortableItem({
  id,
  data,
  setGetDataCheck,
  getDataCheck,
}: {
  id: string;
  data: BookmarkPlaylistType;
  setGetDataCheck: React.Dispatch<React.SetStateAction<boolean>>;
  getDataCheck: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <EnrolledCard
        title={data.title}
        channelTitle={data.channelTitle}
        thumbnail={data.thumbnail}
        chapterLength={data.chapterLength}
        playlistId={data.playlistId}
        playlistDescription={data.playlistDescription}
        channelImage={data.channelImage}
        firstVideoId={data.firstVideoId}
        setGetDataCheck={setGetDataCheck}
        getDataCheck={getDataCheck}
      />
    </div>
  );
}

const Dashboard: React.FC = () => {
  const [enrolledCoursePlaylist, setEnrolledCoursePlaylist] = useState<
    BookmarkPlaylistType[]
  >([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [getDataCheck, setGetDataCheck] = useState(false);
  const [checkDataExist, setCheckDataExist] = useState(false);
  const { data: session } = useSession();

  // initialize drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setEnrolledCoursePlaylist((items) => {
      const oldIndex = items.findIndex((item) => item.playlistId === active.id);
      const newIndex = items.findIndex((item) => item.playlistId === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // fetch enrolled courses
  useEffect(() => {
    const handleEnrolled = async () => {
      if (!session?.user?.email) return;

      console.log(`Fetching enrolled data for: ${session.user.email}`);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/enrolledCourse/getData`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
          credentials: "include",
        }
      );

      const data = await res.json();
      const enrolled = data.enrolledkCourse ?? [];

      setEnrolledCoursePlaylist(enrolled);
      setCheckDataExist(enrolled.length === 0);
    };

    handleEnrolled();
  }, [session?.user?.email, getDataCheck]);

  if (!hasMounted) return null;

  return (
    <>
      <CourseLinkModal />
      <div className="w-full py-8 px-4 text-black flex justify-center mt-16">
        <div className="w-[70rem] flex flex-col gap-12">
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
                  <SortableItem
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
              ) : session?.user ? (
                <p className="text-xl text-center text-slaty">Loading...</p>
              ) : (
                <p className="text-xl text-center text-slaty">
                  Sign in to see your enrolled courses.
                </p>
              )}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
