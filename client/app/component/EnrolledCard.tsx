"use client";

import React from "react";
import { IoBookmarkOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { IoPlayCircleOutline } from "react-icons/io5";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const percentage = 5;

const EnrolledCard = () => {
  return (
    <div className="flex justify-between gap-8">
      <div className="flex w-[50rem] border border-slaty rounded-lg">
        <div className="flex w-[50rem]">
          <iframe
            src="https://www.youtube.com/embed/JQbjS0_ZfJ0"
            className="rounded-lg w-full"
          />
        </div>
        <div className="flex flex-col p-2 gap-2">
          <p className="line-clamp-2 text-lg">
            React interview questioin beganers to advanced aldjfasfas asf as f
            adfjalsjfd a asfdl asfdl asdkj la sfsa as f asf s fas f sf
            sadfasfsaf asldfj af as fas fd asdf
          </p>
          <div className="flex justify-between text-sm">
            <div className="flex gap-2">
              <p>image</p>
              <p>Alok Yadav</p>
            </div>
            <div className="flex gap-2">
              <p>chapters 17</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="line-clamp-2 text-base">
              React interview questioin beganers to advanced asfdjhaslkdjhls
              adfjalsjfd a asfdl asfdl . la sfsa as f asf s fas f sf daf
              afldjksa afdasdf as f asf asdf saf sa f asdf sdf sdf sfd
            </p>
            <div className="flex gap-2">
              <IoPlayCircleOutline className="text-xl" />
              <AiOutlineDelete className="text-xl" />
              <IoBookmarkOutline className="text-xl" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-[20rem] h-[11rem] rounded-lg border border-slaty flex flex-col gap-3 justify-center items-center">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            strokeLinecap: "butt",
            textSize: "20px",
            pathColor: "#BF2F1F",
            textColor: "#4A4844",
            trailColor: "#d6d6d6",
          })}
          className="h-[5rem]"
        />
        <p className="text-xl">Progress</p>
      </div>
    </div>
  );
};

export default EnrolledCard;
