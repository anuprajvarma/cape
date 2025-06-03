import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PlaylistCardType } from "@/types";
import { useSession } from "next-auth/react";

const PlalistVideoCard = ({
  title,
  thumbnails,
  channelTitle,
  id,
  isChecked,
  setCheckBoxTrack,
  checkBoxTrack,
  videoId,
  currentvideoId,
}: PlaylistCardType) => {
  // console.log(id);
  const router = useRouter();
  const session = useSession();

  const playVideo = ({ id, videoId }: { id: string; videoId: string }) => {
    router.push(`/course/${id}/${videoId}`);
    // console.log(`id ${id} videoid ${videoId}`);
  };

  const checkBoxHandler = async (e: boolean) => {
    setCheckBoxTrack(!checkBoxTrack);
    if (e === true) {
      console.log("checked");
      await fetch("http://localhost:5002/api/enrolledCourse/addChapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.data?.user?.email,
          playlistId: id,
          videoId,
        }),
        credentials: "include",
      });
    } else {
      await fetch("http://localhost:5002/api/enrolledCourse/removeChapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.data?.user?.email,
          playlistId: id,
          videoId,
        }),
        credentials: "include",
      });
    }
  };

  return (
    <div
      className={`flex gap-2 p-1 items-center ${
        currentvideoId === videoId
          ? "bg-slaty/70 rounded-sm"
          : "hover:bg-slaty/70 transition duration-100 "
      }`}
    >
      <button
        className={`flex gap-2 p-1 items-center ${
          currentvideoId === videoId ? "text-lightYellow" : ""
        }`}
        onClick={() => playVideo({ id, videoId })}
      >
        <div className="flex w-[10rem] items-start h-[4rem] relative">
          <Image
            src={thumbnails || "/code.jpg"}
            alt="code"
            quality={100}
            sizes="80px"
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
        <div className="flex gap-2 justify-between w-full">
          <div className="flex flex-col justify-start text-start gap-2">
            <p className="line-clamp-2 text-sm font-semibold">{title}</p>
            <p className="text-xs">{channelTitle}</p>
          </div>
        </div>
      </button>
      <div className="p-1">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => checkBoxHandler(e.target.checked)}
        />
      </div>
    </div>
  );
};

export default PlalistVideoCard;
