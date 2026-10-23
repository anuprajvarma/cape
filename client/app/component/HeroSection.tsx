"use client";

import React, { useEffect, useRef, useState } from "react";
import { IoPlayCircleOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";

import profilePic from "../../public/my_pic.png";
import user2 from "../../public/courses.png";
import user3 from "../../public/course-page.png";
import { LoginModal } from "./LoginModal";
// import NavBar from "./NavBar";

const topic = [
  "Track each course",
  "Make notes for each course",
  "AI chatbot help while learning",
  "Quizz for each chapters of course",
];

export default function HeroSection() {
  const [features, setFeatures] = useState<number>(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const handlePlay = () => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: "playVideo",
        args: [],
      }),
      "*",
    );
  };

  useEffect(() => {
    setTimeout(() => {
      if (features === 3) {
        setFeatures(0);
      } else {
        setFeatures(features + 1);
      }
    }, 3000);
  }, [features]);

  return (
    <>
      <LoginModal />
      <div className="w-full pt-16 px-4 text-black flex justify-center mt-12 sm:mt-20">
        <div className="w-280">
          <div className="w-full flex flex-col justify-between gap-10">
            <div className="w-full flex flex-col items-center gap-6 sm:gap-10">
              <div className="w-full sm:flex flex-col gap-6 text-white text-center hidden">
                <p className="text-2xl sm:text-6xl md:text-5xl lg:text-6xl font-semibold">
                  <span className="text-green-600">Free</span> distraction-free
                  <span className="text-red-600">You</span>Tube learning
                </p>
                <p
                  key={topic[features]}
                  className="animate-[fadeSlide_1s_ease-in-out] text-2xl sm:text-3xl md:text-4xl lg:text-2xl"
                >
                  {topic[features]}
                </p>
              </div>
              <p className="sm:hidden block font-semibold w-full text-white text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                Distraction-free YouTube learning with streaks, notes and AI
                support
              </p>
              <div className="flex gap-3 sm:gap-8">
                <div
                  onClick={handlePlay}
                  className="flex gap-2 items-center bg-white/5 backdrop-blur-2xl rounded-[20px] border border-white/5 px-4 cursor-pointer"
                >
                  <IoPlayCircleOutline className="text-2xl sm:text-2xl text-white hover:text-slaty/80 hover:text-darkRed transition duration-300" />

                  <p className="font-semibold text-xl text-white sm:hidden block">
                    play
                  </p>
                  <p className="font-semibold text-md text-white sm:block hidden">
                    how it&apos;s work
                  </p>
                </div>
                <Link
                  href="/courses"
                  className="py-2 text-center flex items-center sm:px-6 sm:py-2 font-semibold bg-white hover:bg-white/70 text-black text-md backdrop-blur-2xl rounded-[20px] border border-white/5 px-4 cursor-pointer transition duration-300"
                >
                  Start learning
                </Link>
              </div>
              <div className="flex gap-4 text-slaty/80 items-center justify-center">
                <div className="flex -space-x-4 rtl:space-x-reverse">
                  <Image
                    className="w-8 h-8 border-2 border-buffer rounded-full"
                    src={user2}
                    alt=""
                  />
                  <Image
                    className="w-8 h-8 border-2 border-buffer rounded-full"
                    src={user3}
                    alt=""
                  />
                  <Image
                    className="w-8 h-8 border-2 border-buffer rounded-full"
                    src={profilePic}
                    alt=""
                  />
                  <Image
                    className="w-8 h-8 border-2 border-buffer rounded-full"
                    src={profilePic}
                    alt=""
                  />
                </div>
                <p>Loved by 100+ learners</p>
              </div>
            </div>
            <div className="w-full flex items-center justify-center">
              <div className="w-full h-80 lg:w-240 lg:h-140 sm:h-120 rounded-lg flex">
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
        </div>
      </div>
      {/* <NavBar /> */}
    </>
  );
}
