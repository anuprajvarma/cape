"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { MdOutlineArrowBack } from "react-icons/md";
import PlalistVideoCard from "../../component/PlalistVideoCard";

interface playlistType {
  title: string;
  thumbnailURL: string;
  channelTitle: string;
}

const Course = () => {
  const params = useParams();
  const { id, videoId } = params;
  const router = useRouter();

  const [playlists, setPlaylists] = useState<playlistType[]>([]);
  const [playlistLengths, setPlaylistLengths] = useState({});
  const [channelThumbnail, setChannelThumbnail] = useState({});
  const [hasMounted, setHasMounted] = useState(false);

  const apikey = "AIzaSyDsn4O1rfKUNB9BmVrj73iyskrx26E77CY";

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    async function playlist() {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${id}&maxResults=3&key=${apikey}`
      );
      const data = await res.json();
      setPlaylists(data.items);
      // console.log(data.items);
    }
    playlist();
  }, []);

  return (
    <div className="w-full -z-20 p-4 border-t border-slaty flex flex-col gap-2 justify-center text-slaty">
      <div className="w-full flex justify-between gap-2">
        <div className="w-[63rem] flex flex-col gap-4">
          <div className="flex gap-2 text-xl">
            <button onClick={() => router.back()}>
              <MdOutlineArrowBack />
            </button>
            <p>Video title</p>
          </div>
          <div className="flex w-full h-[38rem]">
            <iframe
              src="https://www.youtube.com/embed/JQbjS0_ZfJ0?rel=0&modestbranding=1"
              className="rounded-lg w-full"
            />
          </div>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <input type="checkbox" />
              <p>Mark lesson complete</p>
            </div>
            <div className="flex gap-2">
              <button>
                <MdOutlineArrowBack />
              </button>
              <button>
                <MdOutlineArrowBack className="rotate-180" />
              </button>
            </div>
          </div>
          <div className="flex justify-between">
            <button className="px-4 py-1 rounded-md border border-slaty text-darkRed">
              Notes
            </button>
            <button className="px-4 py-1 rounded-md border border-slaty">
              GPT
            </button>
            <button className="px-4 py-1 rounded-md border border-slaty ">
              Easy Explain
            </button>
          </div>
        </div>
        <div className="w-[25rem] h-[656px] border border-slaty rounded-xl flex flex-col">
          <div className="border-b h-[4rem] border-slaty p-2">
            <p className="font-semibold">React js Tutorial in Hindi</p>
            <div className="flex gap-2 text-sm items-center">
              <p className="text-xs">CodeWithHarry</p>
              <p>- 1/34</p>
            </div>
          </div>
          <div className="py-2 h-[586px] flex flex-col gap-4 rounded-xl overflow-y-auto">
            {playlists?.map((data, index) => {
              const id = data.id?.playlistId;
              //   const channelId = data.snippet?.channelId;
              //   const length = playlistLengths[id] || 0;
              //   const channelThumb = channelThumbnail[channelId] || "";
              // console.log(`channelthumb ${channelThumb}`);

              // console.log(length);
              if (!hasMounted) return null;
              return (
                <PlalistVideoCard
                  title={data.snippet?.title}
                  channelTitle={data.snippet?.channelTitle}
                  thumbnails={data.snippet?.thumbnails.high.url}
                  //   lenth={length}
                  id={id}
                  videoId={videoId}
                  //   channelThumb={channelThumb}
                  key={index}
                />
              );
            })}
            {/* <PlalistVideoCard />
            <PlalistVideoCard />
            <PlalistVideoCard />
            <PlalistVideoCard />
            <PlalistVideoCard />
            <PlalistVideoCard />
            <PlalistVideoCard />
            <PlalistVideoCard /> */}
          </div>
        </div>
      </div>
      <div className="w-full h-[80rem] border border-slaty rounded-lg"></div>
    </div>
  );
};

export default Course;
