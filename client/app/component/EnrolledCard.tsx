"use client";

import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { IoPlayCircleOutline } from "react-icons/io5";
import { IoMdShareAlt } from "react-icons/io";
import { useRouter } from "next/navigation";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Image from "next/image";
import * as Tooltip from "@radix-ui/react-tooltip";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { setCourseLinkModal } from "../redux/slices/CourseLinkModal";
import { setCourseLink } from "../redux/slices/CourseLink";
import { EnrolledCardPropType } from "@/types";
import { useEnrolledCardLogic } from "../hooks/enrolledCard";

const EnrolledCard = ({
  title,
  channelTitle,
  thumbnail,
  playlistId,
  setGetDataCheck,
  getDataCheck,
}: EnrolledCardPropType) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    playlistChapters,
    completedChapters,
    handleDeletEnrolledCourse,
    precentage,
  } = useEnrolledCardLogic({ playlistId, getDataCheck, setGetDataCheck });

  return (
    <div className="flex justify-center lg:justify-between gap-8">
      <div className="flex flex-col sm:flex-row w-full sm:w-148 md:w-208 min-h-48 bg-brand-slate-2/15 backdrop-blur-3xl rounded-3xl p-4 text-white gap-4 border border-brand-slate-1/20">
        <div className="flex w-full sm:w-[20rem] h-42 relative rounded-3xl">
          <Image
            src={thumbnail || "/code.jpg"}
            alt="playlist thumbnail"
            quality={100}
            fill
            className="rounded-3xl object-cover"
          />
        </div>
        <div className="flex sm:w-lg flex-col px-2 py-8 gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-lg text-white line-clamp-2 font-semibold">
              {title}
            </p>
            <div className="flex justify-between text-sm text-slaty/80">
              <div className="flex gap-2 items-center justify-center">
                <p>{channelTitle}</p>
              </div>
              <div className="flex gap-2 items-center justify-center">
                <p>chapters {playlistChapters}</p>
              </div>
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
                        className="bg-lightSlaty text-slaty px-3 py-1 text-sm rounded-sm shadow-md z-20"
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
                        className="bg-lightSlaty text-slaty px-3 py-1 text-sm rounded-sm shadow-md z-20"
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
                        className="bg-lightSlaty text-slaty px-3 py-1 text-sm rounded-sm shadow-md z-20"
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
      <div className="w-100 bg-mediumSlaty  border-lightSlaty hidden lg:flex flex-col gap-3 justify-center items-center bg-brand-slate-2/15 backdrop-blur-3xl rounded-3xl border border-brand-slate-1/20 text-white">
        <CircularProgressbar
          value={precentage}
          text={`${precentage}%`}
          styles={buildStyles({
            strokeLinecap: "butt",
            textSize: "20px",
            pathColor: "#42B72E",
            textColor: "#D1D5DB",
            trailColor: "#d6d6d6",
          })}
          className="h-24"
        />
        <p className="text-xl text-slaty/80">Progress</p>
      </div>
    </div>
  );
};

export default EnrolledCard;
