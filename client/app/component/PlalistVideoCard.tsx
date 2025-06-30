import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PlaylistCardType } from "@/types";
import { useSession } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { setCheckBox } from "../redux/slices/checkboxSlice";
import { handleChapter } from "../utils/apiCalls";
// import { toast } from "react-toastify";
import { IoPlay } from "react-icons/io5";
import { setIsOpen } from "../redux/slices/LoginModalSlice";

const PlalistVideoCard = ({
  title,
  thumbnails,
  channelTitle,
  id,
  isChecked,
  videoId,
  currentvideoId,
  index,
}: PlaylistCardType) => {
  const router = useRouter();
  const session = useSession();

  const checkboxTrack = useSelector((state: RootState) => state.checkbox);
  const dispatch = useDispatch<AppDispatch>();

  const playVideo = ({ id, videoId }: { id: string; videoId: string }) => {
    router.push(`/course/${id}/${videoId}`);
  };

  const checkBoxHandler = async (e: boolean) => {
    if (session.status === "authenticated") {
      await handleChapter({
        e,
        email: session.data?.user?.email ?? "",
        playlistId: id,
        videoId,
      });
      dispatch(setCheckBox(!checkboxTrack));
    } else {
      dispatch(setIsOpen(true));
    }
  };

  return (
    <div
      className={`flex gap-2 pr-2 justify-between items-center ${
        currentvideoId === videoId
          ? "bg-lightSlaty/70 rounded-sm"
          : "hover:bg-lightSlaty/70 transition duration-100 "
      }`}
    >
      <button
        className={`flex gap-2 p-1 items-center ${
          currentvideoId === videoId ? "text-lightYellow" : ""
        }`}
        onClick={() => playVideo({ id, videoId })}
      >
        <div className="w-6">
          {currentvideoId === videoId ? <IoPlay /> : <p>{index + 1}</p>}
        </div>
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
            <p className="line-clamp-2 text-sm font-semibold text-white">
              {title}
            </p>
            <p className="text-xs text-slaty">{channelTitle}</p>
          </div>
        </div>
      </button>

      <div>
        <input
          type="checkbox"
          className={`w-5 h-5 ${
            isChecked ? "accent-slaty/40" : "accent-black"
          } rounded cursor-pointer`}
          checked={isChecked}
          onChange={(e) => checkBoxHandler(e.target.checked)}
        />
      </div>
    </div>
  );
};

export default PlalistVideoCard;
