"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { handleEnrolled } from "../utils/apiCalls";
import CourseLinkModal from "../component/CourseLinkModal";

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
  const [checkDataExist, setCheckDataExist] = useState<boolean>(false);
  const [getDataCheck, setGetDataCheck] = useState<boolean>(false);
  const session = useSession();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const load = async () => {
      const email = session.data?.user?.email as string;
      const result = await handleEnrolled(email);
      setBookmarkCoursePlaylist(result);
      if (result.length > 0) {
        setCheckDataExist(false);
      } else {
        setCheckDataExist(true);
      }
    };
    if (session.data?.user !== undefined) {
      load();
    }
  }, [session.data?.user, getDataCheck]);

  return (
    <>
      <CourseLinkModal />
      <div className="w-full -z-20 py-[2rem] px-4 text-black flex justify-center mt-16">
        <div className="w-[70rem] flex flex-col items-center gap-12">
          <div className="flex flex-wrap gap-8 items-center justify-center">
            {bookmarkCoursePlaylist.length > 0 ? (
              bookmarkCoursePlaylist?.map((data, index) => {
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
                    getDataCheck={getDataCheck}
                    setGetDataCheck={setGetDataCheck}
                    key={index}
                  />
                );
              })
            ) : checkDataExist ? (
              <p className="text-xl text-slaty">
                You did not bookmark any courses
              </p>
            ) : session.data?.user ? (
              <p className="text-xl text-center text-slaty">Loading...</p>
            ) : (
              <p className="text-xl text-center text-slaty">
                Sign in and add bookmark courses
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Bookmark;
