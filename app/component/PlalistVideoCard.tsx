import React from "react";
import Image from "next/image";

interface PlaylistCardType {
  title: string;
  channelTitle: string;
  thumbnails: string;
  // lenth: number;
  // channelThumb: string;
  id: string;
  videoId: string;
}

const PlalistVideoCard = ({
  title,
  thumbnails,
  channelTitle,
  id,
  videoId,
}: PlaylistCardType) => {
  const playVideo = (id) => {
    console.log(id);
  };
  return (
    <button className="flex gap-2 p-1 items-center" onClick={playVideo(id)}>
      <div className="flex w-[10rem] h-[4rem] relative">
        <Image
          src={thumbnails}
          alt="code"
          quality={100}
          sizes="80px"
          fill
          style={{ objectFit: "cover" }}
          className="rounded-lg"
        />
      </div>
      <div className="flex gap-2 justify-between w-full">
        <div className="flex flex-col gap-2">
          <p className="line-clamp-2 text-sm font-semibold">{title}</p>
          <p className="text-xs">{channelTitle}</p>
        </div>
        <div className="p-1">
          <input type="checkbox" />
        </div>
      </div>
    </button>
  );
};

export default PlalistVideoCard;
