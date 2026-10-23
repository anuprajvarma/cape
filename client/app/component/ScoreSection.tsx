"use client";

import React from "react";
import ScrollStack from "./Scroll";

export default function ScoreSection() {
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center py-4">
        <div className="w-[60rem] mt-40">
          <ScrollStack />
        </div>
      </div>
    </>
  );
}
