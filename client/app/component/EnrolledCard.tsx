"use client";

import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { IoPlayCircleOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Image from "next/image";
import { useSession } from "next-auth/react";

const percentage = 5;

interface bookmarkPlaylistType {
  title: string;
  channelTitle: string;
  thumbnail: string;
  chapterLenth: string;
  channelImage: string;
  playlistId: string;
  playlistDescription: string;
  firstVideoId: string;
}

const EnrolledCard = ({
  title,
  channelTitle,
  thumbnail,
  chapterLenth,
  channelImage,
  playlistId,
  playlistDescription,
  firstVideoId,
}: bookmarkPlaylistType) => {
  const router = useRouter();
  const session = useSession();

  const handleDeletEnrolledCourse = async ({
    playlistId,
  }: {
    playlistId: string;
  }) => {
    const res = await fetch("http://localhost:5002/api/enrolledCourse/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.data?.user?.email,
        playlistId,
      }),
      credentials: "include",
    });
    const data = await res.json();
    console.log(`handleDeletBookmarkCourse ${data.deleteBookmarCourseHandler}`);
  };

  return (
    <div className="flex justify-between gap-8">
      <div className="flex w-[50rem] border border-slaty rounded-lg">
        <div className="flex w-[20rem] relative">
          <Image
            src={thumbnail}
            alt="playlist thumbnail"
            quality={100}
            sizes="80px"
            fill
            style={{ objectFit: "cover" }}
            className="rounded-md"
          />
        </div>
        <div className="flex w-[30rem] flex-col p-2 gap-2">
          <p className="text-md text-slaty line-clamp-1 font-semibold">
            {title}
          </p>
          <div className="flex justify-between text-sm">
            <div className="flex gap-2 items-center justify-center">
              <div className="flex w-[2rem] h-[2rem] relative">
                <Image
                  src={channelImage}
                  alt="playlist thumbnail"
                  quality={100}
                  sizes="80px"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-full"
                />
              </div>
              <p>{channelTitle}</p>
            </div>
            <div className="flex gap-2 items-center justify-center">
              <p>chapters {chapterLenth}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="line-clamp-2 text-base">{playlistDescription}</p>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  router.push(`/course/${playlistId}/${firstVideoId}`)
                }
              >
                <IoPlayCircleOutline className="text-xl hover:text-darkRed transition duration-300 w-5 h-5" />
              </button>
              <button onClick={() => handleDeletEnrolledCourse({ playlistId })}>
                <AiOutlineDelete className="text-xl hover:text-darkRed transition duration-300 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[20rem] h-[10rem] rounded-lg border border-slaty flex flex-col gap-3 justify-center items-center">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            strokeLinecap: "butt",
            textSize: "20px",
            pathColor: "#BF2F1F",
            textColor: "#4A4844",
            trailColor: "#d6d6d6",
          })}
          className="h-[5rem]"
        />
        <p className="text-xl">Progress</p>
      </div>
    </div>
  );
};

export default EnrolledCard;
