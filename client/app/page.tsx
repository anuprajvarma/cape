"use client";

import NavBar from "./component/NavBar";
import dynamic from "next/dynamic";
import React, { useRef } from "react";
import { IoPlayCircleOutline } from "react-icons/io5";
import Link from "next/link";
import LoginModal from "./component/LoginModal";

const PopularCourses = dynamic(() => import("./component/PopularCourses"), {
  ssr: false,
});

export default function Page() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const handlePlay = () => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: "playVideo",
        args: [],
      }),
      "*"
    );
  };

  return (
    <>
      <LoginModal />
      <div className="w-full py-[4rem] px-4 text-black flex justify-center mt-[3rem] sm:mt-[5rem]">
        <div className="w-[70rem]">
          <div className="w-full flex flex-col justify-between gap-10">
            <div className="w-full flex flex-col items-center gap-6 sm:gap-10">
              <div className="font-semibold w-full text-white text-center sm:block hidden">
                <p className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl">
                  Distraction-free YouTube learning
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  with streaks, notes and AI support
                </p>
              </div>
              <p className="sm:hidden block font-semibold w-full text-white text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                Distraction-free YouTube learning with streaks, notes and AI
                support
              </p>
              <div className="flex gap-3 sm:gap-8">
                <Link
                  href="/courses"
                  className="px-3 py-2 text-center flex items-center sm:px-6 sm:py-3 rounded-[6px] cursor-pointer font-semibold bg-lightBlue hover:bg-lightBlue/80 text-white text-md transition duration-300"
                >
                  Get started
                </Link>
                <div className="flex gap-2 items-center">
                  <button onClick={handlePlay}>
                    <IoPlayCircleOutline className="text-4xl sm:text-5xl text-slaty/50 hover:text-slaty/80 cursor-pointer hover:text-darkRed transition duration-300" />
                  </button>
                  <p className="font-semibold text-xl text-white sm:hidden block">
                    play
                  </p>
                  <p className="font-semibold text-xl text-white sm:block hidden">
                    how it&apos;s work
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full flex items-center justify-center">
              <div className="w-full h-[20rem] lg:w-[60rem] lg:h-[35rem] sm:h-[30rem] rounded-lg flex">
                <iframe
                  title="Intro Video"
                  ref={iframeRef}
                  src="https://www.youtube.com/embed/deDrrPWWGW0?enablejsapi=1"
                  className="rounded-lg w-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
          <PopularCourses />
        </div>
      </div>
      <NavBar />
    </>
  );
}
