"use client";

import React from "react";
import { IoPlayCircleOutline } from "react-icons/io5";
import PopularCourses from "../component/PopularCourses";

export const Home = () => {
  return (
    <div className="w-full -z-20 py-[4rem] px-4 text-black border-t border-slaty flex justify-center">
      <div className="w-[70rem]">
        <div className="w-full flex justify-between gap-6">
          <div className="w-[36rem] h-[18rem] flex flex-col gap-4">
            <div className="font-semibold text-4xl">
              <p>Flexible & Scalable , Your</p>
              <p>training Flexible & Scalable you</p>
              <p>training Flexible & Scalable you</p>
            </div>
            <u className="no-underline p-0 m-0 text-sm">
              <li>Track Your Progress of playlist</li>
              <li>Track Your Progress of playlist</li>
              <li>Track Your Progress of playlist</li>
              <li>Track Your Progress of playlist</li>
            </u>
            <div className="flex gap-2">
              <button className="border border-black px-6 py-1 rounded-[6px] cursor-pointer font-semibold hover:bg-slaty/10 transition duration-300">
                Start
              </button>
              <div className="flex gap-2 items-center">
                <IoPlayCircleOutline className="text-4xl cursor-pointer" />
                <p className="font-semibold">how it&apos;s work</p>
              </div>
            </div>
          </div>
          <div className="w-[34rem] rounded-lg flex justify-end ">
            <iframe
              src="https://www.youtube.com/embed/JQbjS0_ZfJ0"
              className="rounded-lg w-full"
            />
          </div>
        </div>
        <PopularCourses />
      </div>
    </div>
  );
};
