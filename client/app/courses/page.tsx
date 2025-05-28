"use client";

import React, { useEffect, useState } from "react";
import { GrMicrophone } from "react-icons/gr";
import { IoSearch } from "react-icons/io5";
import CourseCard from "../component/CourseCard";
import { playlistType3 } from "@/types";

const Courses = () => {
  const [playlists, setPlaylists] = useState<playlistType3[]>([]);
  const [playlistLengths, setPlaylistLengths] = useState<
    Record<string, string>
  >({});
  const [channelThumbnail, setChannelThumbnail] = useState<
    Record<string, string>
  >({});
  const [hasMounted, setHasMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [topic, setTopic] = useState("reactjs");

  const apikey = "AIzaSyDae7iuZ1KqvmBnMhzv8g6IJfgffyyYsUw";

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    async function playlist() {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${topic}&type=playlist&key=${apikey}&maxResults=12`
      );
      const data = await res.json();
      setPlaylists(data.items);
      // console.log(data.items);
    }
    playlist();
  }, [topic]);

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
            console.log(`channelid ${channelId}`);
            const ownerThumbnailRes = await fetch(
              `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apikey}`
            );

            const thumbnailData = await ownerThumbnailRes.json();
            console.log(
              `thumbnaildata ${thumbnailData.items[0].snippet.thumbnails.high.url}`
            );
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
    <div className="w-full -z-20 py-[2rem] px-4 text-black border-t border-slaty flex justify-center">
      <div className="w-[70rem] flex flex-col gap-12">
        <div className=" flex gap-2 items-center justify-center">
          <div className="border border-slaty flex rounded-full">
            <input
              type="text"
              placeholder="Search your favourite plalist"
              className="w-[20rem] py-2 px-4 outline-none rounded-l-full focus:border focus:border-black/50 transition duration-50 bg-lightYellow text-slaty placeholder-slaty"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => {
                setTopic(searchQuery);
              }}
              className="border-l p-3 h-full hover:bg-slaty/10 rounded-r-full transition duration-300 border-slaty"
            >
              <IoSearch className="text-xl" />
            </button>
          </div>
          <button className="rounded-full p-2 items-center border border-slaty hover:bg-slaty/10 transition duration-300">
            <GrMicrophone className="text-xl hover:text-darkRed transition duration-300" />
          </button>
        </div>
        <div className="flex flex-wrap gap-16 items-center justify-start">
          {playlists?.map((data, index) => {
            const id = data.id?.playlistId;
            const channelId = data.snippet?.channelId;
            const description = data.snippet?.description;
            const length = playlistLengths[id] || "0";
            const channelThumb = channelThumbnail[channelId] || "";
            console.log(`channelthumb ${channelThumb}`);
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
                channelThumb={channelThumb}
                key={index}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Courses;
