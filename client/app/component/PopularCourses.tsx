import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { setPopularPlaylist } from "../redux/slices/playlistSlice";

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

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    async function playlist() {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=reactjs&type=playlist&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&maxResults=3`
      );
      const data = await res.json();
      dispatch(setPopularPlaylist(data.items));
    }
    playlist();
  }, [dispatch]);

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
    <div className="flex flex-col gap-[2rem] sm:gap-[4rem] pt-[6rem] w-full">
      <p className="text-center font-semibold text-2xl sm:text-4xl text-white">
        Popular Courses
      </p>
      <div className="flex flex-col gap-[5rem]">
        <div className="flex flex-wrap gap-16 items-center justify-center">
          {playlists?.map((data, index) => {
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
