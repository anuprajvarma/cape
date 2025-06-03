"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { SiSololearn } from "react-icons/si";
import { FaArrowRight } from "react-icons/fa";

const Header = () => {
  const session = useSession();
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleGoogleAuthSubmit = async () => {
    await fetch("http://localhost:5002/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: session.data?.user?.name,
        email: session.data?.user?.email,
        imageUrl: session.data?.user?.image,
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => console.log(`google data ${data.user}`));
  };

  const handleSignout = async () => {
    await signOut();
    // console.log("sing out");
    await fetch("http://localhost:5002/api/auth/signout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  };

  useEffect(() => {
    if (session.status === "authenticated") {
      handleGoogleAuthSubmit();
    }
  }, [session.status]);

  return (
    <div className="w-full px-8 py-4 flex justify-center">
      <div
        className={`w-[80rem] flex justify-between font-medium items-center`}
      >
        <Link
          href="/"
          className="font-bold cursor-pointer text-2xl flex gap-1 text-white items-center"
        >
          <SiSololearn className="text-lightBlue" />
          <p>Cape</p>
        </Link>
        <div className="flex gap-12 text-slaty">
          <Link
            href="/courses"
            className={`cursor-pointer hover:text-darkRed transition duration-300 ${
              path === "/courses" ? "text-darkRed" : ""
            }`}
          >
            Courses
          </Link>
          <Link
            href="/bookmark"
            className={`cursor-pointer hover:text-darkRed transition duration-300 ${
              path === "/bookmark" ? "text-darkRed" : ""
            }`}
          >
            Bookmark
          </Link>
          <Link
            href="/dashboard"
            className={`cursor-pointer hover:text-darkRed transition duration-300 ${
              path === "/dashboard" ? "text-darkRed" : ""
            }`}
          >
            Dashboard
          </Link>
        </div>
        <div>
          {session.status === "authenticated" ? (
            <div className="relative">
              {/* Circular Image Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 flex justify-center items-center rounded-full overflow-hidden focus:outline-none"
              >
                <Image
                  src={session.data?.user?.image as string} // Replace with actual image path
                  alt="Profile"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Toggle Div */}
              {isOpen && (
                <div className="absolute right-0 mt-2 border  shadow-lg bg-slaty rounded-lg hover:bg-slaty/80 transition duration-300 z-50">
                  <button
                    onClick={handleSignout}
                    className="w-full text-left px-4 py-2 rounded text-lightYellow"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="px-5 py-[10px] flex gap-2 items-center rounded-[8px] cursor-pointer font-semibold text-sm bg-lightBlue transition duration-300"
            >
              <p>Sign in</p>
              <FaArrowRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
