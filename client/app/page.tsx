"use client";

import React from "react";
import HeroSection from "./component/HeroSection";
import ScoreSection from "./component/ScoreSection";
import Testomonials from "./component/Testomonials";
import NavBar from "./component/NavBar";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <HeroSection />
      <ScoreSection />
      <Testomonials />
      <div className="w-full my-20 flex items-center justify-center">
        <div className="w-[70rem] h-[15rem] bg-white/10 backdrop-blur-2xl rounded-[20px] border border-white/5 flex justify-center items-center">
          <div className="w-6/12 flex flex-col justify-center items-center gap-4">
            <div className="w-full flex flex-col justify-center items-center">
              <p className="text-4xl font-semibold">
                Learn smarter, faster, easier
              </p>
              <p className="text-sm">Join over 100+ people learning smarter</p>
            </div>
            <Link
              href="/courses"
              className="flex items-center justify-center gap-2 rounded-[20px] cursor-pointer font-semibold text-[13px] text-black bg-[#FFFFFF] hover:bg-[#FFFFFF]/70 hover:backdrop-blur-2xl transition duration-300 px-5 py-2"
            >
              <p className="flex justify-center items-center">Start learning</p>
            </Link>
          </div>
        </div>
      </div>
      <NavBar />
    </>
  );
}
