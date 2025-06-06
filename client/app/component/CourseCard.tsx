"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { IoPlayCircleOutline } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { FaBookmark } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { CourseCardType } from "@/types";
import { playlist } from "../utils/apiCalls";

const CourseCard = ({
  title,
  channelTitle,
  thumbnails,
  length,
  channelThumb,
  id,
  bookmark,
  description,
}: CourseCardType) => {
  const router = useRouter();
  const session = useSession();
  // console.log(id);
  const [firstVideoId, setFirstVideoId] = useState("");

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
  }: CourseCardType) => {
    // console.log("enrolled");
    await fetch("http://localhost:5002/api/enrolledCourse", {
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
    })
      .then((res) => res.json())
      .then((data) =>
        console.log(`enrolledCourse data ${data.enrolledkCourse}`)
      );
  };

  const handleDeletBookmarkCourse = async ({ id }: { id: string }) => {
    const res = await fetch("http://localhost:5002/api/bookmarkCourse/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.data?.user?.email,
        id,
      }),
      credentials: "include",
    });
    const data = await res.json();
    console.log(`handleDeletBookmarkCourse ${data.deleteBookmarCourseHandler}`);
  };

  const handleBookmark = async ({
    title,
    channelTitle,
    thumbnails,
    length,
    channelThumb,
    id,
  }: CourseCardType) => {
    // console.log("bookmark");
    await fetch("http://localhost:5002/api/bookmarkCourse", {
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
    })
      .then((res) => res.json())
      .then((data) =>
        console.log(`enrolledCourse data ${data.enrolledkCourse}`)
      );
  };

  return (
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
              })
            }
            className="py-[4px] px-5 rounded-md bg-lightSlaty hover:bg-slaty/20 hover:text-slaty text-slaty/80 transition duration-300"
          >
            Enroll
          </button>
          <div className="flex gap-2 text-xl text-slaty/80 items-end">
            <button
              onClick={() => router.push(`/course/${id}/${firstVideoId}`)}
            >
              <IoPlayCircleOutline className="text-2xl hover:text-slaty hover:text-darkRed transition duration-300" />
            </button>
            {bookmark ? (
              <button
                onClick={() =>
                  handleDeletBookmarkCourse({
                    id,
                  })
                }
              >
                <AiOutlineDelete className="text-2xl hover:text-slaty transition duration-300" />
              </button>
            ) : (
              <></>
            )}
            {bookmark ? (
              <FaBookmark className="text-2xl hover:text-slaty cursor-pointer" />
            ) : (
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
                  })
                }
              >
                <IoBookmarkOutline className="text-2xl hover:text-slaty hover:text-darkRed" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
