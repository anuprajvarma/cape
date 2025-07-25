"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { IoPlayCircleOutline } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { FaBookmark } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdShareAlt } from "react-icons/io";
import { CourseCardType } from "@/types";
import { playlist } from "../utils/apiCalls";
import * as Tooltip from "@radix-ui/react-tooltip";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setIsOpen } from "../redux/slices/LoginModalSlice";
import { setCourseLinkModal } from "../redux/slices/CourseLinkModal";
import { setCourseLink } from "../redux/slices/CourseLink";

const CourseCard = ({
  title,
  channelTitle,
  thumbnails,
  length,
  channelThumb,
  id,
  bookmark,
  description,
  getDataCheck,
  setGetDataCheck,
}: CourseCardType) => {
  const router = useRouter();
  const session = useSession();
  // console.log(id);
  const [firstVideoId, setFirstVideoId] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const load = async () => {
      const result = await playlist(id);
      setFirstVideoId(result);
    };
    load();
  }, [id]);

  const handleEnrolled = async ({
    title,
    channelTitle,
    thumbnails,
    length,
    channelThumb,
    description,
    id,
    getDataCheck,
    setGetDataCheck,
  }: CourseCardType) => {
    if (session.status === "authenticated") {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/enrolledCourse`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            channelTitle,
            thumbnails,
            length,
            channelThumb,
            id,
            description,
            firstVideoId,
            bookmark: true,
            email: session.data?.user?.email,
          }),
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.isExist) {
            // console.log(data.isExist);
            toast.success("course is already exist", {
              hideProgressBar: true,
            });
          } else {
            // console.log(data.isExist);
            toast.success("course is enrolled", {
              hideProgressBar: true,
            });
          }
        });
      setGetDataCheck(!getDataCheck);
    } else {
      dispatch(setIsOpen(true));
    }
  };

  const handleDeletBookmarkCourse = async ({ id }: { id: string }) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/bookmarkCourse/delete`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.data?.user?.email,
          id,
        }),
        credentials: "include",
      }
    );
    const data = await res.json();
    if (data.deleteBookmarCourseHandler) {
      toast.success("course is unmark", {
        hideProgressBar: true,
      });
    }
    setGetDataCheck(!getDataCheck);
  };

  const handleBookmark = async ({
    title,
    channelTitle,
    thumbnails,
    length,
    channelThumb,
    id,
    getDataCheck,
    setGetDataCheck,
  }: CourseCardType) => {
    if (session.status === "authenticated") {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/bookmarkCourse`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            channelTitle,
            thumbnails,
            length,
            channelThumb,
            id,
            bookmark: true,
            firstVideoId,
            email: session.data?.user?.email,
          }),
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.isExist) {
            toast.success("course is already bookmark", {
              hideProgressBar: true,
            });
          } else {
            toast.success("course is bookmarke", {
              hideProgressBar: true,
            });
          }
        });
      setGetDataCheck(!getDataCheck);
    } else {
      dispatch(setIsOpen(true));
    }
  };

  return (
    <>
      <div className="w-full sm:w-[20rem] h-[346px] flex flex-col gap-3 bg-mediumSlaty border border-lightSlaty rounded-lg">
        <div className="flex h-[13rem] relative">
          <Image
            src={thumbnails || "/code.jpg"}
            alt="playlist thumbnail"
            quality={100}
            sizes="80px"
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center gap-1">
            <div className="flex flex-col gap-2 w-full">
              <p className="text-lg text-white line-clamp-1 font-semibold">
                {title}
              </p>
              <div className="flex justify-between text-sm items-center text-slaty/80">
                <div className="flex gap-2 items-center">
                  <div className="flex w-[26px] h-[26px] relative">
                    <Image
                      src={channelThumb || "/code.jpg"}
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
                <p>chapters {length}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between pt-2 text-slaty">
            <button
              onClick={() =>
                handleEnrolled({
                  title,
                  channelTitle,
                  thumbnails,
                  length,
                  channelThumb,
                  description,
                  bookmark,
                  id,
                  getDataCheck,
                  setGetDataCheck,
                })
              }
              className="py-[4px] px-5 rounded-md bg-lightSlaty hover:bg-slaty/20 hover:text-slaty text-slaty/80 transition duration-300"
            >
              Enroll
            </button>
            <div className="flex gap-2 text-xl text-slaty/80 items-end">
              <Tooltip.Provider delayDuration={0}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={() =>
                        router.push(`/course/${id}/${firstVideoId}`)
                      }
                    >
                      <IoPlayCircleOutline className="text-2xl hover:text-slaty hover:text-darkRed transition duration-300" />
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
                        <AiOutlineDelete className="text-2xl hover:text-slaty transition duration-300" />
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
              ) : (
                <></>
              )}
              {bookmark ? (
                <Tooltip.Provider delayDuration={0}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <FaBookmark className="text-2xl hover:text-slaty cursor-pointer" />
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="top"
                        className="bg-lightSlaty text-slaty px-3 py-1 text-sm rounded shadow-md z-20"
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
                            length,
                            channelThumb,
                            description,
                            bookmark,
                            id,
                            getDataCheck,
                            setGetDataCheck,
                          })
                        }
                      >
                        <IoBookmarkOutline className="text-2xl hover:text-slaty hover:text-darkRed" />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="top"
                        className="bg-lightSlaty text-slaty px-3 py-1 text-sm rounded shadow-md z-20"
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
                            `https://cape-lyart.vercel.app/course/${id}/${firstVideoId}`
                          )
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
    </>
  );
};

export default CourseCard;
