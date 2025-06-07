"use client";

import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { IoPlayCircleOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Image from "next/image";
import { useSession } from "next-auth/react";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  enrolledCourseDataFetch,
  enrolledCourseDelete,
} from "../utils/apiCalls";
import { toast } from "react-toastify";

interface bookmarkPlaylistType {
  title: string;
  channelTitle: string;
  thumbnail: string;
  chapterLength: string;
  channelImage: string;
  playlistId: string;
  playlistDescription: string;
  firstVideoId: string;
  setGetDataCheck: React.Dispatch<React.SetStateAction<boolean>>;
  getDataCheck: boolean;
}

const EnrolledCard = ({
  title,
  channelTitle,
  thumbnail,
  chapterLength,
  channelImage,
  playlistId,
  playlistDescription,
  firstVideoId,
  setGetDataCheck,
  getDataCheck,
}: bookmarkPlaylistType) => {
  const router = useRouter();
  const session = useSession();
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [precentage, setPrecentage] = useState<number>(0);

  const actualId = Array.isArray(playlistId) ? playlistId[0] : playlistId;

  useEffect(() => {
    if (actualId) {
      const percentage =
        (100 * completedChapters.length) / Number(chapterLength);
      setPrecentage(Math.round(percentage));
    }
    console.log(precentage);
    const getChapterData = async () => {
      const result = await enrolledCourseDataFetch({
        email: session.data?.user?.email ?? "",
        playlistId,
      });
      if (result) {
        console.log(`data ka length hai`);
        setCompletedChapters(result);
      }
    };
    getChapterData();
  }, [
    session.data?.user,
    playlistId,
    actualId,
    chapterLength,
    completedChapters.length,
    precentage,
  ]);

  const handleDeletEnrolledCourse = async ({
    playlistId,
  }: {
    playlistId: string;
  }) => {
    await enrolledCourseDelete({
      email: session.data?.user?.email ?? "",
      playlistId,
    });
    toast.success("course is delete", {
      hideProgressBar: true,
    });
    setGetDataCheck(!getDataCheck);
  };

  return (
    <div className="flex justify-center lg:justify-between gap-8">
      <div className="flex flex-col sm:flex-row w-[20rem] sm:w-[37rem] md:w-[52rem] min-h-[12rem] rounded-lg bg-mediumSlaty border border-lightSlaty">
        <div className="flex w-full sm:w-[24rem] h-[13rem] relative">
          <Image
            src={thumbnail || "/code.jpg"}
            alt="playlist thumbnail"
            quality={100}
            sizes="80px"
            fill
            style={{ objectFit: "cover" }}
            className="rounded-md"
          />
        </div>
        <div className="flex sm:w-[32rem] flex-col p-2 gap-2">
          <p className="text-xl text-white line-clamp-1 font-semibold">
            {title}
          </p>
          <div className="flex justify-between text-md text-slaty/80">
            <div className="flex gap-2 items-center justify-center">
              <div className="flex w-[2rem] h-[2rem] relative">
                <Image
                  src={channelImage || "/code.jpg"}
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
              <p>chapters {chapterLength}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end text-slaty/80">
            <p className="line-clamp-3 text-base">{playlistDescription}</p>
            <div className="flex gap-2 justify-between lg:justify-end w-full">
              <div className=" flex lg:hidden gap-2 font-medium text-slaty/90">
                <p className="text-slaty">Completed -</p>
                <div>
                  {chapterLength && (
                    <p>{`${completedChapters?.length}/${chapterLength}`}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Tooltip.Provider delayDuration={0}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        onClick={() =>
                          router.push(`/course/${playlistId}/${firstVideoId}`)
                        }
                      >
                        <IoPlayCircleOutline className="text-2xl hover:text-slaty transition duration-300 w-6 h-6" />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="top"
                        className="bg-lightSlaty text-slaty px-3 py-1 text-sm rounded shadow-md z-20"
                      >
                        Play
                        <Tooltip.Arrow className="fill-lightSlaty" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
                <Tooltip.Provider delayDuration={0}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        onClick={() =>
                          handleDeletEnrolledCourse({ playlistId })
                        }
                      >
                        <AiOutlineDelete className="text-2xl hover:text-slaty transition duration-300 w-6 h-6" />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="top"
                        className="bg-lightSlaty text-slaty px-3 py-1 text-sm rounded shadow-md z-20"
                      >
                        Delete
                        <Tooltip.Arrow className="fill-lightSlaty" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[25rem] rounded-lg border bg-mediumSlaty  border-lightSlaty hidden lg:flex flex-col gap-3 justify-center items-center">
        <CircularProgressbar
          value={precentage}
          text={`${precentage}%`}
          styles={buildStyles({
            strokeLinecap: "butt",
            textSize: "20px",
            pathColor: "#1A56DB",
            textColor: "#D1D5DB",
            trailColor: "#d6d6d6",
          })}
          className="h-[6rem]"
        />
        <p className="text-xl text-slaty/80">Progress</p>
      </div>
    </div>
  );
};

export default EnrolledCard;
