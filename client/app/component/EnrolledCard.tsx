"use client";

import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { IoPlayCircleOutline } from "react-icons/io5";
import { IoMdShareAlt } from "react-icons/io";
import { useRouter } from "next/navigation";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Image from "next/image";
import { useSession } from "next-auth/react";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  enrolledCourseDataFetch,
  enrolledCourseDelete,
} from "../utils/backendApiCalls";
import { toast } from "react-toastify";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { setCourseLinkModal } from "../redux/slices/CourseLinkModal";
import { setCourseLink } from "../redux/slices/CourseLink";
import getApiKey from "../utils/reusableConstant";

interface bookmarkPlaylistType {
  title: string;
  channelTitle: string;
  thumbnail: string;
  chapterLength: string;
  channelImage: string;
  playlistId: string;
  playlistDescription: string;
  setGetDataCheck: React.Dispatch<React.SetStateAction<boolean>>;
  getDataCheck: boolean;
}

const EnrolledCard = ({
  title,
  channelTitle,
  thumbnail,
  playlistId,
  setGetDataCheck,
  getDataCheck,
}: bookmarkPlaylistType) => {
  const router = useRouter();
  const session = useSession();
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [playlistChapters, setPlaylistChapters] = useState<number>(0);
  const [precentage, setPrecentage] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();

  const apikey = getApiKey();

  useEffect(() => {
    const url = `https://www.googleapis.com/youtube/v3/playlists?${new URLSearchParams(
      {
        part: "contentDetails",
        id: playlistId,
        key: apikey,
      },
    )}`;

    try {
      const fetchEnrolledData = async () => {
        const res = await fetch(url);
        const data = await res.json();
        setPlaylistChapters(data.items[0].contentDetails.itemCount);
        const percentage =
          (100 * completedChapters.length) /
          data.items[0].contentDetails.itemCount;
        setPrecentage(Math.round(percentage));
      };
      fetchEnrolledData();
    } catch (error) {
      console.log(error);
    }
  }, [playlistId, session.data?.user, apikey, completedChapters]);

  useEffect(() => {
    const getChapterData = async () => {
      const result = await enrolledCourseDataFetch({
        email: session.data?.user?.email ?? "",
        playlistId,
      });
      if (result) {
        setCompletedChapters(result);
      }
    };

    getChapterData();
  }, [session.data?.user, playlistId, completedChapters.length, precentage]);

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
      <div className="flex flex-col sm:flex-row w-full sm:w-[37rem] md:w-[52rem] min-h-[12rem] rounded-lg bg-mediumSlaty border border-lightSlaty">
        <div className="flex w-full sm:w-[20rem] h-[12rem] relative">
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
        <div className="flex sm:w-[32rem] flex-col px-2 py-4 gap-2">
          <p className="text-xl text-white line-clamp-2 font-semibold">
            {title}
          </p>
          <div className="flex justify-between text-md text-slaty/80">
            <div className="flex gap-2 items-center justify-center">
              <p>{channelTitle}</p>
            </div>
            <div className="flex gap-2 items-center justify-center">
              <p>chapters {playlistChapters}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end text-slaty/80">
            <div className="flex gap-2 justify-between lg:justify-end w-full">
              <div className=" flex lg:hidden gap-2 font-medium text-slaty/90">
                <p className="text-slaty">Completed -</p>
                <div>
                  {playlistChapters && (
                    <p>{`${completedChapters?.length}/${playlistChapters}`}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Tooltip.Provider delayDuration={0}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        onClick={() =>
                          router.push(`/course/${playlistId}/${1}`)
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
                <Tooltip.Provider delayDuration={0}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        onClick={() => {
                          dispatch(setCourseLinkModal(true));
                          dispatch(
                            setCourseLink(
                              `https://cape-lyart.vercel.app/course/${playlistId}/${1}`,
                            ),
                          );
                        }}
                      >
                        <IoMdShareAlt className="text-2xl hover:text-slaty transition duration-300 w-6 h-6" />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="top"
                        className="bg-lightSlaty text-slaty px-3 py-1 text-sm rounded shadow-md z-20"
                      >
                        Share
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
