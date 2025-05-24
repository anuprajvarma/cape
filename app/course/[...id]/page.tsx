"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MdOutlineArrowBack } from "react-icons/md";
import PlalistVideoCard from "@/app/component/PlalistVideoCard";

const Course = () => {
  const router = useRouter();
  return (
    <div className="w-full -z-20 p-4 border-t border-slaty flex flex-col gap-2 justify-center text-slaty">
      <div className="w-full flex justify-between gap-2">
        <div className="w-[63rem] flex flex-col gap-4">
          <div className="flex gap-2 text-xl">
            <button onClick={() => router.back()}>
              <MdOutlineArrowBack />
            </button>
            <p>Video title</p>
          </div>
          <div className="flex w-full h-[38rem]">
            <iframe
              src="https://www.youtube.com/embed/JQbjS0_ZfJ0?rel=0&modestbranding=1"
              className="rounded-lg w-full"
            />
          </div>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <input type="checkbox" />
              <p>Mark lesson complete</p>
            </div>
            <div className="flex gap-2">
              <button>
                <MdOutlineArrowBack />
              </button>
              <button>
                <MdOutlineArrowBack className="rotate-180" />
              </button>
            </div>
          </div>
          <div className="flex justify-between">
            <button className="px-4 py-1 rounded-md border border-slaty text-darkRed">
              Notes
            </button>
            <button className="px-4 py-1 rounded-md border border-slaty">
              GPT
            </button>
            <button className="px-4 py-1 rounded-md border border-slaty ">
              Easy Explain
            </button>
          </div>
        </div>
        <div className="w-[25rem] h-[656px] border border-slaty rounded-xl flex flex-col">
          <div className="border-b h-[4rem] border-slaty p-2">
            <p className="font-semibold">React js Tutorial in Hindi</p>
            <div className="flex gap-2 text-sm items-center">
              <p className="text-xs">CodeWithHarry</p>
              <p>- 1/34</p>
            </div>
          </div>
          <div className="py-2 h-[586px] flex flex-col gap-4 rounded-xl overflow-y-auto">
            <PlalistVideoCard />
            <PlalistVideoCard />
            <PlalistVideoCard />
            <PlalistVideoCard />
            <PlalistVideoCard />
            <PlalistVideoCard />
            <PlalistVideoCard />
            <PlalistVideoCard />
          </div>
        </div>
      </div>
      <div className="w-full h-[80rem] border border-slaty rounded-lg"></div>
    </div>
  );
};

export default Course;
