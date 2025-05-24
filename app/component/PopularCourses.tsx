import React from "react";
import CourseCard from "./CourseCard";

const PopularCourses = () => {
  return (
    <div className="flex flex-col gap-6 py-10">
      <p className="text-center font-semibold text-xl">Popular Courses</p>
      <div className="flex flex-wrap gap-16 items-center justify-center">
        <CourseCard />
        <CourseCard />
        <CourseCard />
      </div>
      <div className="flex justify-center">
        <button className="border border-black px-3 py-1 rounded-[6px] cursor-pointer">
          Courses
        </button>
      </div>
    </div>
  );
};

export default PopularCourses;
