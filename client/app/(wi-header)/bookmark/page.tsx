"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { CourseLinkModal } from "../../component/CourseLinkModal";
import { useBookmarkPlaylist } from "../../hooks/bookmarkPlaylist";

const CourseCard = dynamic(() => import("../../component/CourseCard"), {
  ssr: false,
});

export default function Bookmark() {
  const [hasMounted, setHasMounted] = useState(false);
  const [getDataCheck, setGetDataCheck] = useState<boolean>(false);
  const { bookmarkCoursePlaylist, checkDataExist, dataLoading } =
    useBookmarkPlaylist({ getDataCheck });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <>
      <CourseLinkModal />
      <div className="w-full h-screen -z-20 py-8 px-4 text-black flex justify-center pt-16 sm:pt-28">
        <div className="w-full h-full flex flex-col items-center justify-center gap-12">
          {bookmarkCoursePlaylist.length > 0 ? (
            <div className="w-full h-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center gap-6">
              {bookmarkCoursePlaylist?.map((data, index) => {
                if (!hasMounted) return null;

                return (
                  <CourseCard
                    title={data.title}
                    channelTitle={data.channelTitle}
                    thumbnails={data.thumbnail}
                    id={data.playlistId}
                    bookmark={data.bookmark}
                    description={data.playlistDescription}
                    getDataCheck={getDataCheck}
                    setGetDataCheck={setGetDataCheck}
                    indexOrder={index}
                    key={index}
                  />
                );
              })}
            </div>
          ) : checkDataExist ? (
            <p className="text-xl text-brand-slate-1">
              You did not bookmark any courses
            </p>
          ) : dataLoading ? (
            <p className="text-xl text-center text-slaty">Loading...</p>
          ) : (
            <p className="text-xl text-center text-brand-slate-1">
              You are not Sign in
            </p>
          )}
        </div>
      </div>
    </>
  );
}
