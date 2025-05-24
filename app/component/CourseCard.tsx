import React from "react";

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
              <p>username</p>
            </div>
            <p>chapter 17</p>
          </div>
          <div className="flex justify-between">
            <button>Enroll Now</button>
            <div className="flex gap-2">
              <p>play icon</p>
              <p>bookmark icon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
