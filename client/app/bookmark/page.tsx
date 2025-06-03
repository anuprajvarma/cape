"use client";

import React, { useEffect, useState } from "react";
import CourseCard from "../component/CourseCard";
import { useSession } from "next-auth/react";

interface bookmarkPlaylistType {
  title: string;
  channelTitle: string;
  thumbnail: string;
  chapterLenth: string;
  channelImage: string;
  playlistId: string;
  playlistDescription: string;
  firstVideoId: string;
  bookmark: boolean;
}

const Bookmark = () => {
  const [bookmarkCoursePlaylist, setBookmarkCoursePlaylist] = useState<
    bookmarkPlaylistType[]
  >([]);
  const [hasMounted, setHasMounted] = useState(false);
  const session = useSession();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    // console.log("step 1");
    const handleEnrolled = async () => {
      // console.log("step 2");
      const res = await fetch(
        "http://localhost:5002/api/bookmarkCourse/getData",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.data?.user?.email,
          }),
          credentials: "include",
        }
      );
      const data = await res.json();
      // console.log(`bookmark ${data.bookmarkCourse}`);
      setBookmarkCoursePlaylist(data.bookmarkCourse);
    };
    handleEnrolled();
  }, [session.data?.user]);

  return (
    <div className="w-full -z-20 py-[2rem] px-4 text-black border-t border-slaty flex justify-center">
      <div className="w-[80rem] flex flex-col items-center gap-12">
        <div className="flex flex-wrap gap-16 items-start justify-start">
          {bookmarkCoursePlaylist?.map((data, index) => {
            if (!hasMounted) return null;

            return (
              <CourseCard
                title={data.title}
                channelTitle={data.channelTitle}
                thumbnails={data.thumbnail}
                lenth={data.chapterLenth}
                id={data.playlistId}
                bookmark={data.bookmark}
                description={data.playlistDescription}
                channelThumb={data.channelImage}
                key={index}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Bookmark;
