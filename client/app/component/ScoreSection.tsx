"use client";

import React from "react";
import ScrollStack from "../component/Scroll";

export default function ScoreSection() {
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center py-4">
        <div className="w-[70rem]">
          <ScrollStack />
        </div>
      </div>
    </>
  );
}
