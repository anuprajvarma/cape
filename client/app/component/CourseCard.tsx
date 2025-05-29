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

const CourseCard = ({
  title,
  channelTitle,
  thumbnails,
  lenth,
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
    async function playlist() {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${id}&maxResults=3&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      );
      const data = await res.json();
      setFirstVideoId(data.items[0].snippet?.resourceId.videoId);
    }
    playlist();
  }, [id]);

  const handleEnrolled = async ({
    title,
    channelTitle,
    thumbnails,
    lenth,
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
        lenth,
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
    lenth,
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
        lenth,
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
    <div>
      <div className="w-[20rem] border border-slaty rounded-lg">
        <div className="flex h-[12rem] relative">
          <Image
            src={thumbnails}
            alt="playlist thumbnail"
            quality={100}
            sizes="80px"
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
        <div className="p-2">
          <div className="flex items-center gap-1">
            <div className="flex flex-col w-full">
              <p className="text-md text-slaty line-clamp-1 font-semibold">
                {title}
              </p>
              <div className="flex justify-between text-sm items-center">
                <div className="flex gap-2 items-center">
                  <div className="flex w-[26px] h-[26px] relative">
                    <Image
                      src={channelThumb}
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
                <p>chapters {lenth}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between pt-2">
            <button
              onClick={() =>
                handleEnrolled({
                  title,
                  channelTitle,
                  thumbnails,
                  lenth,
                  channelThumb,
                  description,
                  bookmark,
                  id,
                })
              }
              className="py-[2px] px-3 border border-slaty rounded-md hover:bg-slaty/10 transition duration-300"
            >
              Enroll
            </button>
            <div className="flex gap-2 text-xl items-end">
              <button
                onClick={() => router.push(`/course/${id}/${firstVideoId}`)}
              >
                <IoPlayCircleOutline className="text-xl hover:text-darkRed transition duration-300 w-5 h-5" />
              </button>
              {bookmark ? (
                <button
                  onClick={() =>
                    handleDeletBookmarkCourse({
                      id,
                    })
                  }
                >
                  <AiOutlineDelete className="text-xl hover:text-darkRed transition duration-300 w-5 h-5" />
                </button>
              ) : (
                <></>
              )}
              {bookmark ? (
                <FaBookmark className="cursor-pointer" />
              ) : (
                <button
                  onClick={() =>
                    handleBookmark({
                      title,
                      channelTitle,
                      thumbnails,
                      lenth,
                      channelThumb,
                      description,
                      bookmark,
                      id,
                    })
                  }
                >
                  <IoBookmarkOutline className="hover:text-darkRed" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
