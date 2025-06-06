"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

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
  const session = useSession();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    // console.log("step 1");
    const handleEnrolled = async () => {
      // console.log("step 2");
      const res = await fetch(
        "http://localhost:5002/api/enrolledCourse/getData",
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
    };
    handleEnrolled();
  }, [session.data?.user?.email]);

  return (
    <div className="w-full -z-20 py-[2rem] px-4 text-black flex justify-center">
      <div className="w-[70rem] flex flex-col gap-12">
        {enrolledCoursePlaylist.map((data, index) => {
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
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
