"use client";

import React from "react";
import ScrollStack from "./Scroll";

export default function ScoreSection() {
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center px-4">
        <div className="w-full sm:w-[40rem] md:w-[50rem] lg:w-[60rem] xl:w-280 mt-40">
          <ScrollStack />
        </div>
      </div>
    </>
  );
}
