"use client";

import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { IoPlayCircleOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Image from "next/image";

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
          <p className="line-clamp-2 text-lg">{title}</p>
          <div className="flex justify-between text-sm">
            <div className="flex gap-2">
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
            <div className="flex gap-2">
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
                <IoPlayCircleOutline />
              </button>
              <AiOutlineDelete className="text-xl" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-[20rem] h-[11rem] rounded-lg border border-slaty flex flex-col gap-3 justify-center items-center">
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
