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
  console.log(id);
  const [firstVideoId, setFirstVideoId] = useState("");

  const apikey = "AIzaSyDsn4O1rfKUNB9BmVrj73iyskrx26E77CY";
  useEffect(() => {
    async function playlist() {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${id}&maxResults=3&key=${apikey}`
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
    console.log("enrolled");
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

  const handleBookmark = async ({
    title,
    channelTitle,
    thumbnails,
    lenth,
    channelThumb,
    id,
  }: CourseCardType) => {
    console.log("bookmark");
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
            <div className="flex w-[2rem] h-[2rem] relative">
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
            <div className="flex flex-col w-full">
              <p className="text-md text-slaty line-clamp-1 font-semibold">
                {title}
              </p>
              <div className="flex justify-between text-sm">
                <p>{channelTitle}</p>
                <p>chapters {lenth}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between pt-1">
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
              className="py-[2px] px-3 border border-slaty rounded-md"
            >
              Enroll
            </button>
            <div className="flex gap-2 text-xl items-end">
              <button
                onClick={() => router.push(`/course/${id}/${firstVideoId}`)}
              >
                <IoPlayCircleOutline />
              </button>
              {bookmark ? <AiOutlineDelete className="text-xl" /> : <></>}
              {bookmark ? (
                <FaBookmark />
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
                  <IoBookmarkOutline />
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
