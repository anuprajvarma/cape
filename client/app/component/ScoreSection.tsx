"use client";

import React from "react";
import ScrollStack from "./Scroll";

export default function ScoreSection() {
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center px-4">
        <div className="w-full sm:w-160 md:w-200 lg:w-240 xl:w-280 mt-40">
          <ScrollStack />
        </div>
      </div>
    </>
  );
}
