import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import Link from "next/link";
import { playlistType } from "@/types";

const PopularCourses = () => {
  const [playlists, setPlaylists] = useState<playlistType[]>([]);
  const [playlistLengths, setPlaylistLengths] = useState<
    Record<string, string>
  >({});
  const [channelThumbnail, setChannelThumbnail] = useState<
    Record<string, string>
  >({});
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    async function playlist() {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=reactjs&type=playlist&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&maxResults=3`
      );
      const data = await res.json();
      setPlaylists(data.items);
      // console.log(data.items);
    }
    playlist();
  }, []);

  useEffect(() => {
    const fetchLengths = async () => {
      const newLengths: Record<string, string> = {};
      await Promise.all(
        playlists.map(async (item) => {
          const id = item.id?.playlistId;
          if (id) {
            const lenthRes = await fetch(
              `https://www.googleapis.com/youtube/v3/playlists?part=contentDetails&id=${id}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
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
            // console.log(`channelid ${channelId}`);
            const ownerThumbnailRes = await fetch(
              `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
            );

            const thumbnailData = await ownerThumbnailRes.json();
            // console.log(
            //   `thumbnaildata ${thumbnailData.items[0].snippet.thumbnails.high.url}`
            // );
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
    <div className="flex flex-col gap-6 py-10">
      <p className="text-center font-semibold text-xl">Popular Courses</p>
      <div className="flex flex-wrap gap-16 items-center justify-center">
        {playlists?.map((data, index) => {
          const id = data.id?.playlistId;
          const channelId = data.snippet?.channelId;
          const description = data.snippet?.description;
          const length = playlistLengths[id] || "";
          const channelThumb = channelThumbnail[channelId] || "";
          // console.log(`channelthumb ${channelThumb}`);
          // console.log(`id ... ${id}`);
          // console.log(length);
          if (!hasMounted) return null;
          return (
            <CourseCard
              title={data.snippet?.title}
              channelTitle={data.snippet?.channelTitle}
              thumbnails={data.snippet?.thumbnails.high.url}
              lenth={length}
              id={id}
              bookmark={false}
              description={description}
              channelThumb={channelThumb as string}
              key={index}
            />
          );
        })}
      </div>
      <div className="flex justify-center">
        <Link
          href="/courses"
          className="border border-black px-3 py-1 rounded-[6px] hover:bg-slaty/10 transition duration-300 cursor-pointer"
        >
          Courses
        </Link>
      </div>
    </div>
  );
};

export default PopularCourses;
