import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="w-full p-4 text-black flex justify-center">
      <div className="w-[70rem] flex justify-between font-medium items-center">
        <Link href="/" className="font-bold cursor-pointer">
          Cape
        </Link>
        <div className="flex gap-12">
          <Link href="/courses" className="cursor-pointer">
            Courses
          </Link>
          <Link href="/bookmark" className="cursor-pointer">
            Bookmark
          </Link>
          <Link href="/dashboard" className="cursor-pointer">
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
