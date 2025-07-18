"use client";

import Header from "./component/Header";
import NavBar from "./component/NavBar";
import dynamic from "next/dynamic";
import React, { useRef } from "react";
import { IoPlayCircleOutline } from "react-icons/io5";
import Link from "next/link";
import LoginModal from "./component/LoginModal";
// import LoginModal from "./component/LoginModal";

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
      <Header />
      <LoginModal />
      <div className="w-full py-[4rem] px-4 text-black flex justify-center mt-12">
        <div className="w-[70rem]">
          <div className="w-full flex flex-col justify-between gap-12">
            <div className="w-full h-[18rem] flex flex-col items-center gap-6">
              <div className="font-semibold w-full text-white text-center text-2xl sm:text-4xl md:text-5xl lg:text-6xl">
                <p>Distraction-free YouTube learning with</p>
                <p>with streaks, notes, and AI help.</p>
              </div>
              <div className="font-medium w-full text-slaty/50 text-center lg:text-xl">
                <p>
                  Effortless, distraction-free YouTube learning with daily
                  streak tracking.
                </p>
                <p>
                  make notes with Notion and get playlist-specific help via AI
                  chatbot.
                </p>
              </div>
              <div className="flex gap-8">
                <Link
                  href="/courses"
                  className="px-6 py-3 rounded-[6px] cursor-pointer font-semibold bg-lightBlue hover:bg-lightBlue/80 text-white text-md transition duration-300"
                >
                  Get started
                </Link>
                <div className="flex gap-2 items-center">
                  <button onClick={handlePlay}>
                    <IoPlayCircleOutline className="text-5xl text-slaty/50 hover:text-slaty/80 cursor-pointer hover:text-darkRed transition duration-300" />
                  </button>
                  <p className="font-semibold text-xl text-white">
                    how it&apos;s work
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full flex items-center pt-2 justify-center">
              <div className="w-full h-[20rem] sm:w-[40rem] lg:w-[50rem] sm:h-[30rem] rounded-lg flex">
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
