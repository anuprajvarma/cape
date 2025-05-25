"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import React from "react";

const Header = () => {
  const param = useParams();
  const { id, videoId } = param;
  const path = usePathname();
  console.log(`path ${path}`);
  return (
    <div className="w-full z-20 p-4 text-black flex justify-center">
      <div
        className={`${
          path === `/course/${id}/${videoId}` ? "w-full" : "w-[70rem]"
        } flex justify-between font-medium items-center`}
      >
        <Link href="/" className="font-bold cursor-pointer text-2xl">
          Cape
        </Link>
        <div className="flex gap-12">
          <Link
            href="/courses"
            className={`cursor-pointer ${
              path === "/courses" ? "text-darkRed" : ""
            }`}
          >
            Courses
          </Link>
          <Link
            href="/bookmark"
            className={`cursor-pointer ${
              path === "/bookmark" ? "text-darkRed" : ""
            }`}
          >
            Bookmark
          </Link>
          <Link
            href="/dashboard"
            className={`cursor-pointer ${
              path === "/dashboard" ? "text-darkRed" : ""
            }`}
          >
            Dashboard
          </Link>
        </div>
        <div>
          <div className="flex gap-4">
            <button className="cursor-pointer">Login</button>
            <button className="border border-black px-3 py-1 rounded-[6px] cursor-pointer">
              Signup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
