import React from "react";
import { IoPlayCircleOutline } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";

const CourseCard = () => {
  return (
    <div>
      <div className="w-[20rem] border border-slaty rounded-lg">
        <div className="h-[12rem] flex">
          <iframe
            src="https://www.youtube.com/embed/JQbjS0_ZfJ0"
            className="rounded-lg w-full"
          />
        </div>
        <div className="p-2">
          <p className="line-clamp-2">
            React interview questioin beganers to advanced aldjfasfas asf as f
            fsa a sdf as fs jasdkjf
          </p>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <p>image</p>
              <p>Alok Yadav</p>
            </div>
            <p>chapter 17</p>
          </div>
          <div className="flex justify-between pt-1">
            <button className="py-[2px] px-3 border border-slaty rounded-md">
              Enroll
            </button>
            <div className="flex gap-2 text-xl items-end">
              <IoPlayCircleOutline />
              <IoBookmarkOutline />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
