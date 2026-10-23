"use client";

import React from "react";
import MotionMarquee from "./TestimonialCard";

export default function Testomonials() {
  //   const items = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);
  return (
    <div className="w-full flex justify-center items-center mt-20">
      <div className="w-280 flex flex-col gap-20">
        <div className="w-full flex justify-center">
          <p className="text-5xl font-bold text-white">What people says</p>
        </div>
        <MotionMarquee />
      </div>
    </div>
  );
}
