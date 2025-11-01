"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { setPopularPlaylist } from "../redux/slices/playlistSlice";
import { fetchPlaylist } from "../utils/apiCalls";

const CourseCard = dynamic(() => import("./CourseCard"), {
  ssr: false,
});

const YOUTUBE_API_KEY = [
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_1,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_2,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_3,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_4,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_5,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_6,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_7,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_8,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_9,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_10,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_11,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_12,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_13,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_14,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_15,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_16,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_17,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_18,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_19,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_20,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_21,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_22,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_23,
];

function getRotatedKey(): string {
  const now = new Date();
  const hour = now.getUTCHours(); // use UTC for consistency
  const index = hour % YOUTUBE_API_KEY.length;
  return YOUTUBE_API_KEY[index]!;
}

const apikey = getRotatedKey();

const PopularCourses = () => {
  const playlists = useSelector((state: RootState) => state.playlist);
  const dispatch = useDispatch<AppDispatch>();
  const [playlistLengths, setPlaylistLengths] = useState<
    Record<string, string>
  >({});
  const [channelThumbnail, setChannelThumbnail] = useState<
    Record<string, string>
  >({});
  const [hasMounted, setHasMounted] = useState(false);
  const [getDataCheck, setGetDataCheck] = useState<boolean>(false);
  const [checkDataExist, setCheckDataExist] = useState<boolean>(false);

  function getRotatedKey(): number {
    const now = new Date();
    const hour = now.getUTCHours(); // use UTC for consistency
    return hour;
  }

  getRotatedKey();
  // console.log(`hour ${hour}`);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    async function load() {
      const max = "3";
      const topic = "reactjs";
      if (apikey) {
        const result = await fetchPlaylist({ max, topic, apikey });
        dispatch(setPopularPlaylist(result));
        if (result.length > 0) {
          setCheckDataExist(false);
        } else {
          setCheckDataExist(true);
        }
      }
    }
    load();
  }, [dispatch]);

  useEffect(() => {
    const fetchLengths = async () => {
      const newLengths: Record<string, string> = {};
      await Promise.all(
        playlists.map(async (item) => {
          const id = item.id?.playlistId;
          if (id) {
            const lenthRes = await fetch(
              `https://www.googleapis.com/youtube/v3/playlists?part=contentDetails&id=${id}&key=${apikey}`
            );

            const data = await lenthRes.json();
            newLengths[id] = data.items[0]?.contentDetails?.itemCount || 0;
          }
        })
      );

      setPlaylistLengths(newLengths);
    };

    if (playlists?.length > 0) {
      fetchLengths();
    }
  }, [playlists]);

  useEffect(() => {
    const fetchLengths = async () => {
      const newThumbnail: Record<string, string> = {};
      await Promise.all(
        playlists.map(async (item) => {
          const channelId = item.snippet?.channelId;

          if (channelId) {
            const ownerThumbnailRes = await fetch(
              `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apikey}`
            );
            const thumbnailData = await ownerThumbnailRes.json();
            newThumbnail[channelId] =
              thumbnailData.items[0]?.snippet.thumbnails.high.url;
          }
        })
      );
      setChannelThumbnail(newThumbnail);
    };

    if (playlists?.length > 0) {
      fetchLengths();
    }
  }, [playlists]);

  return (
    <div className="flex flex-col gap-[2rem] sm:gap-[3rem] pt-[3rem] w-full">
      <p className="text-center font-semibold text-2xl sm:text-4xl text-white">
        Popular Courses
      </p>
      <div className="flex flex-col gap-8 sm:gap-14">
        <div className="flex flex-wrap gap-8 items-center justify-center">
          {playlists.length > 0 ? (
            playlists?.map((data, index) => {
              const id = data.id?.playlistId;
              const channelId = data.snippet?.channelId;
              const description = data.snippet?.description;
              const length = playlistLengths[id] || "";
              const channelThumb = channelThumbnail[channelId] || "";
              if (!hasMounted) return null;
              return (
                <CourseCard
                  title={data.snippet?.title}
                  channelTitle={data.snippet?.channelTitle}
                  thumbnails={data.snippet?.thumbnails.high.url}
                  length={length}
                  id={id}
                  bookmark={false}
                  description={description}
                  channelThumb={channelThumb as string}
                  setGetDataCheck={setGetDataCheck}
                  getDataCheck={getDataCheck}
                  indexOrder={index}
                  key={index}
                />
              );
            })
          ) : checkDataExist ? (
            <p className="text-xl text-slaty">Youtube API limit is exceed</p>
          ) : (
            <p className="text-xl text-center text-slaty">Loading...</p>
          )}
        </div>
        <div className="flex justify-center ">
          <Link
            href="/courses"
            className="px-6 py-2 rounded-[6px] bg-lightSlaty text-slaty/80 hover:bg-slaty/20 hover:text-slaty transition duration-300 cursor-pointer"
          >
            View all Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PopularCourses;
