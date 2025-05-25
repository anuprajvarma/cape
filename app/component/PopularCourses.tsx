import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";

interface playlistType {
  title: string;
  thumbnailURL: string;
  channelTitle: string;
}

const PopularCourses = () => {
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
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=reactjs&type=playlist&key=${apikey}&maxResults=3`
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
            // console.log(`channelid ${channelId}`);
            const ownerThumbnailRes = await fetch(
              `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apikey}`
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

    if (playlists.length > 0) {
      fetchLengths();
    }
  }, [playlists]);

  return (
    <div className="flex flex-col gap-6 py-10">
      <p className="text-center font-semibold text-xl">Popular Courses</p>
      <div className="flex flex-wrap gap-16 items-center justify-center">
        {playlists.map((data, index) => {
          const id = data.id?.playlistId;
          const channelId = data.snippet?.channelId;
          const length = playlistLengths[id] || 0;
          const channelThumb = channelThumbnail[channelId] || "";
          // console.log(`channelthumb ${channelThumb}`);
          console.log(`id ... ${id}`);
          // console.log(length);
          if (!hasMounted) return null;
          return (
            <CourseCard
              title={data.snippet?.title}
              channelTitle={data.snippet?.channelTitle}
              thumbnails={data.snippet?.thumbnails.high.url}
              lenth={length}
              id={id}
              channelThumb={channelThumb}
              key={index}
            />
          );
        })}
      </div>
      <div className="flex justify-center">
        <button className="border border-black px-3 py-1 rounded-[6px] cursor-pointer">
          Courses
        </button>
      </div>
    </div>
  );
};

export default PopularCourses;
