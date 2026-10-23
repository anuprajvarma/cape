"use client";

import Image from "next/image";
import React from "react";
import { IoPlayCircleOutline } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { FaBookmark } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { CourseCardType } from "@/types";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setCourseLinkModal } from "../redux/slices/CourseLinkModal";
import { setCourseLink } from "../redux/slices/CourseLink";
import { useCourseCardLogic } from "../hooks/courseCard";
import { useSessionsDetails } from "../hooks/sesionAndRouterDetail";

const CourseCard = ({
  title,
  channelTitle,
  thumbnails,
  id,
  bookmark,
  description,
  getDataCheck,
  setGetDataCheck,
  indexOrder,
}: CourseCardType) => {
  const { router } = useSessionsDetails();
  const { handleEnrolled, handleDeletBookmarkCourse, handleBookmark } =
    useCourseCardLogic({ getDataCheck, setGetDataCheck });
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <div className="w-full p-2 sm:w-88 max-h-80 flex flex-col bg-brand-slate-2/15 backdrop-blur-3xl rounded-3xl">
        <div className="h-52 relative">
          <Image
            src={thumbnails || "/code.jpg"}
            alt="playlist thumbnail"
            quality={100}
            sizes="(max-width: 768rem) 80rem, 160rem"
            fill
            className="rounded-3xl"
          />
        </div>
        <div className="flex flex-col gap-2 p-2 rounded-3xl">
          <div className="flex items-center gap-1">
            <div className="flex gap-1 flex-col w-full">
              <p className="text-md text-white line-clamp-1 font-semibold">
                {title}
              </p>
              <p className="text-sm text-white line-clamp-1 font-medium">
                {channelTitle}
              </p>
            </div>
          </div>
          <div className="flex justify-between py-1 text-white">
            <button
              onClick={() =>
                handleEnrolled({
                  title,
                  channelTitle,
                  thumbnails,
                  description,
                  bookmark,
                  id,
                  getDataCheck,
                  indexOrder,
                  setGetDataCheck,
                })
              }
              className="py-1 px-5 rounded-3xl bg-white hover:bg-slaty/20 hover:text-black text-black transition duration-300 cursor-pointer"
            >
              Enroll
            </button>
            <div className="flex gap-2 text-xl text-slaty/80 items-end">
              <Tooltip.Provider delayDuration={0}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button onClick={() => router.push(`/course/${id}/${1}`)}>
                      <IoPlayCircleOutline className="text-2xl hover:text-slaty hover:text-darkRed transition duration-300 cursor-pointer" />
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
              {bookmark ? (
                <Tooltip.Provider delayDuration={0}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        onClick={() =>
                          handleDeletBookmarkCourse({
                            id,
                          })
                        }
                      >
                        <FaBookmark className="text-2xl hover:text-slaty cursor-pointer" />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="top"
                        className="bg-lightSlaty text-slaty px-3 py-1 text-sm rounded-sm shadow-md z-20"
                      >
                        Unmark
                        <Tooltip.Arrow className="fill-lightSlaty" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              ) : (
                <Tooltip.Provider delayDuration={0}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        onClick={() =>
                          handleBookmark({
                            title,
                            channelTitle,
                            thumbnails,
                            description,
                            bookmark,
                            id,
                            getDataCheck,
                            indexOrder,
                            setGetDataCheck,
                          })
                        }
                      >
                        <IoBookmarkOutline className="text-2xl hover:text-slaty hover:text-darkRed cursor-pointer" />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="top"
                        className="bg-lightSlaty text-slaty px-3 py-1 text-sm rounded-sm shadow-md z-20"
                      >
                        Bookmark
                        <Tooltip.Arrow className="fill-lightSlaty" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              )}
              <Tooltip.Provider delayDuration={0}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={() => {
                        dispatch(setCourseLinkModal(true));
                        dispatch(
                          setCourseLink(
                            `https://cape-lyart.vercel.app/course/${id}/${1}`,
                          ),
                        );
                      }}
                    >
                      <IoMdShareAlt className="text-2xl hover:text-slaty transition duration-300 w-6 h-6 cursor-pointer" />
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
    </>
  );
};

export default CourseCard;
