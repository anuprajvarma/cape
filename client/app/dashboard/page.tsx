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
  TouchSensor,
  MouseSensor,
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
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [checkDataExist, setCheckDataExist] = useState(false);
  const { data: session } = useSession();

  // initialize drag sensors

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5, // Start dragging after moving 5px
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // Wait 200ms before activating
        tolerance: 5, // or small movement tolerance
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );
  // handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    console.log(active.id + " " + over.id);

    setEnrolledCoursePlaylist((items) => {
      const oldIndex = items.findIndex((item) => item.playlistId === active.id);
      const newIndex = items.findIndex((item) => item.playlistId === over.id);
      console.log(oldIndex + " " + newIndex);
      const updatedItems = arrayMove(items, oldIndex, newIndex);

      // ✅ Immediately send update to backend
      updatePlaylistOrder(updatedItems);

      return updatedItems;
    });
  };

  async function updatePlaylistOrder(updatedItems: BookmarkPlaylistType[]) {
    console.log(updatedItems);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/enrolledCourse/updateOrder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session?.user?.email,
            newOrder: updatedItems.map((p) => p.playlistId),
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update order");
      console.log("✅ Order updated successfully");
    } catch (err) {
      console.error("❌ Error updating order:", err);
    }
  }

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // fetch enrolled courses
  useEffect(() => {
    const handleEnrolled = async () => {
      if (!session?.user?.email) return;
      setDataLoading(true);
      try {
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

        const sortedEnrolled = [...enrolled].sort(
          (a, b) => a.indexOrder - b.indexOrder
        );

        setEnrolledCoursePlaylist(sortedEnrolled);
        setCheckDataExist(enrolled.length === 0);
      } catch (error) {
        setDataLoading(false);
        console.log(error);
      }
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
