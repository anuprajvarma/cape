"use client";

import React from "react";
import HeroSection from "../component/HeroSection";
import ScoreSection from "../component/ScoreSection";
import Testomonials from "../component/Testomonials";
import NavBar from "../component/NavBar";
import Link from "next/link";
import Header from "../component/Header";

export default function Page() {
  return (
    <>
      <Header />
      <HeroSection />
      <ScoreSection />
      <Testomonials />
      <div className="w-full my-20 flex items-center justify-center px-4">
        <div className="w-full sm:w-[40rem] md:w-[50rem] lg:w-[60rem] xl:w-280 h-40 sm:h-60 bg-white/10 backdrop-blur-2xl rounded-[20px] border border-white/5 flex justify-center items-center">
          <div className="lg:w-7/12 xl:w-6/12 flex flex-col justify-center items-center gap-4">
            <div className="w-full flex flex-col justify-center items-center">
              <p className="sm:text-4xl font-semibold">
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
