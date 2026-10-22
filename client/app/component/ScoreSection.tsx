"use client";

import React from "react";

export default function ScoreSection() {
  return (
    <>
      <div className="w-full flex items-center justify-center py-4">
        <div className="w-[70rem] flex flex-col gap-12">
          <p className="flex items-center justify-center text-3xl font-semibold">
            Save hours, learn smarter
          </p>
          <div className="w-full h-[30rem] flex">
            <div className="w-1/2 flex items-center">
              <div className="flex flex-col w-10/12">
                <p className="text-3xl font-semibold">Score</p>
                <p>
                  you can see your progress , how much precent you complete your
                  playlist
                </p>
              </div>
            </div>
            <div className="w-1/2"></div>
          </div>
        </div>
      </div>
    </>
  );
}
