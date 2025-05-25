"use client";

import React, { useEffect, useState } from "react";
import { GrMicrophone } from "react-icons/gr";
import { IoSearch } from "react-icons/io5";
import CourseCard from "../component/CourseCard";

interface playlistType {
  title: string;
  thumbnailURL: string;
  channelTitle: string;
}

const Courses = () => {
  const [playlists, setPlaylists] = useState<playlistType[]>([]);
  const [playlistLengths, setPlaylistLengths] = useState({});
  const [channelThumbnail, setChannelThumbnail] = useState({});
  const [hasMounted, setHasMounted] = useState(false);

  const apikey = "AIzaSyDae7iuZ1KqvmBnMhzv8g6IJfgffyyYsUw";

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    async function playlist() {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=reactjs&type=playlist&key=${apikey}&maxResults=12`
      );
      const data = await res.json();
      setPlaylists(data.items);
      // console.log(data.items);
    }
    playlist();
  }, []);

  useEffect(() => {
    const fetchLengths = async () => {
      const newLengths = {};
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

    if (playlists.length > 0) {
      fetchLengths();
    }
  }, [playlists]);

  useEffect(() => {
    const fetchLengths = async () => {
      const newThumbnail = {};
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

    if (playlists.length > 0) {
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
              className="w-[20rem] py-2 px-4 outline-none rounded-l-full bg-lightYellow text-slaty placeholder-slaty"
            />
            <button className="border-l p-3 h-full border-slaty">
              <IoSearch className="text-xl" />
            </button>
          </div>
          <button className="rounded-full p-2 items-center border border-slaty">
            <GrMicrophone className="text-xl" />
          </button>
        </div>
        <div className="flex flex-wrap gap-16 items-center justify-start">
          {playlists.map((data, index) => {
            const id = data.id?.playlistId;
            const channelId = data.snippet?.channelId;
            const length = playlistLengths[id] || 0;
            const channelThumb = channelThumbnail[channelId] || "";
            console.log(`channelthumb ${channelThumb}`);
            if (!hasMounted) return null;
            return (
              <CourseCard
                title={data.snippet?.title}
                channelTitle={data.snippet?.channelTitle}
                thumbnails={data.snippet?.thumbnails.high.url}
                lenth={length}
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
