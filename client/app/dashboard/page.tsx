"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CourseLinkModal from "../component/CourseLinkModal";

const EnrolledCard = dynamic(() => import("../component/EnrolledCard"), {
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
}

const Dashboard = () => {
  const [enrolledCoursePlaylist, setenrolledCoursePlaylist] = useState<
    bookmarkPlaylistType[]
  >([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [getDataCheck, setGetDataCheck] = useState<boolean>(false);
  const [checkDataExist, setCheckDataExist] = useState<boolean>(false);
  const session = useSession();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const handleEnrolled = async () => {
      console.log(
        `handleEnrolled called for email: ${session.data?.user?.email}`
      );
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/enrolledCourse/getData`,
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
      setenrolledCoursePlaylist(data.enrolledkCourse);
      if (data.enrolledkCourse.length > 0) {
        setCheckDataExist(false);
      } else {
        setCheckDataExist(true);
      }
    };
    if (session.data?.user?.email != undefined) {
      handleEnrolled();
    }
  }, [session.data?.user?.email, getDataCheck]);

  return (
    <>
      <CourseLinkModal />
      <div className="w-full -z-20 py-[2rem] px-4 text-black flex justify-center">
        <div className="w-[70rem] flex flex-col gap-12">
          {enrolledCoursePlaylist.length > 0 ? (
            enrolledCoursePlaylist.map((data, index) => {
              if (!hasMounted) return null;

              return (
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
                  key={index}
                />
              );
            })
          ) : checkDataExist ? (
            <p className="text-xl text-center text-slaty">
              You did not enrolled any courses
            </p>
          ) : (
            <p className="text-xl text-center text-slaty">Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
