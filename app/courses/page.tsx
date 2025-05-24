import React from "react";
import { GrMicrophone } from "react-icons/gr";
import { IoSearch } from "react-icons/io5";
import CourseCard from "../component/CourseCard";

const Courses = () => {
  return (
    <div className="w-full -z-20 py-[2rem] px-4 text-black border-t border-slaty flex justify-center">
      <div className="w-[70rem] flex flex-col gap-12">
        <div className=" flex gap-2 items-center justify-center">
          <div className="border border-slaty flex rounded-full">
            <input
              type="text"
              placeholder="Search your favourite plalist"
              className="w-[20rem] py-2 px-4 outline-none rounded-l-full bg-lightYellow text-slaty placeholder-slaty"
            />
            <button className="border-l p-3 h-full border-slaty">
              <IoSearch className="text-xl" />
            </button>
          </div>
          <button className="rounded-full p-2 items-center border border-slaty">
            <GrMicrophone className="text-xl" />
          </button>
        </div>
        <div className="flex flex-wrap gap-16 items-center justify-center">
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
        </div>
      </div>
    </div>
  );
};

export default Courses;
