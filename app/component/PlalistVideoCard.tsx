import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  // console.log(id);
  const router = useRouter();

  const playVideo = ({ id, videoId }: { id: string; videoId: string }) => {
    router.push(`/course/${id}/${videoId}`);
    console.log(`id ${id} videoid ${videoId}`);
  };

  return (
    <button
      className="flex gap-2 p-1 items-center"
      onClick={() => playVideo({ id, videoId })}
    >
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
