"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { handleEnrolled } from "../utils/apiCalls";

const CourseCard = dynamic(() => import("../component/CourseCard"), {
  ssr: false,
});

interface bookmarkPlaylistType {
  title: string;
  channelTitle: string;
  thumbnail: string;
  chapterLength: string;
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
    const load = async () => {
      const email = session.data?.user?.email as string;
      const result = await handleEnrolled(email);
      setBookmarkCoursePlaylist(result);
    };
    load();
  }, [session.data?.user]);

  return (
    <div className="w-full -z-20 py-[2rem] px-4 text-black border-t border-slaty flex justify-center">
      <div className="w-[70rem] flex flex-col items-center gap-12">
        <div className="flex flex-wrap gap-8 items-center justify-center">
          {bookmarkCoursePlaylist?.map((data, index) => {
            if (!hasMounted) return null;

            return (
              <CourseCard
                title={data.title}
                channelTitle={data.channelTitle}
                thumbnails={data.thumbnail}
                length={data.chapterLength}
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
