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
      <div className="w-full h-full -z-20 py-8 px-4 text-black flex justify-center mt-16">
        <div className="w-full h-full flex flex-col items-center gap-12">
          <div className="flex flex-wrap gap-8 h-full justify-center">
            {bookmarkCoursePlaylist.length > 0 ? (
              bookmarkCoursePlaylist?.map((data, index) => {
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
              })
            ) : checkDataExist ? (
              <p className="text-xl text-brand-slate-1">
                You did not bookmark any courses
              </p>
            ) : dataLoading ? (
              <p className="text-xl text-center text-slaty">Loading...</p>
            ) : (
              <div className="h-full w-full flex justify-center items-center">
                <p className="text-xl text-center text-brand-slate-1">
                  You are not Sign in
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
