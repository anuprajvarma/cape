"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { SiSololearn } from "react-icons/si";
import { FaArrowRight } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { loginFuntion, signOutFuntion } from "../utils/apiCalls";

const Header = () => {
  const session = useSession();
  const path = usePathname();
  const param = useParams();
  const { id, videoId } = param;
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const handleGoogleAuthSubmit = async () => {
    loginFuntion({
      name: session.data?.user?.name ?? "",
      email: session.data?.user?.email ?? "",
      imageUrl: session.data?.user?.image ?? "",
    });
  };

  const handleSignout = async () => {
    await signOut();
    await signOutFuntion();
  };

  useEffect(() => {
    if (session.status === "authenticated") {
      handleGoogleAuthSubmit();
    }
  }, [session.status]);

  return (
    <div className="w-full p-4 flex justify-center">
      <div
        className={`${
          path === `/course/${id}/${videoId}` ? "w-full" : "w-[70rem]"
        } flex justify-between font-medium items-center`}
      >
        <Link
          href="/"
          className="font-bold cursor-pointer text-xl sm:text-2xl flex gap-2 text-white items-center"
        >
          <SiSololearn className="text-lightBlue" />
          <p>Cape</p>
        </Link>
        <div className="sm:flex hidden gap-4 sm:gap-12 text-lg sm:text-md text-slaty/80">
          <Link
            href="/courses"
            className={`cursor-pointer hover:text-darkRed transition duration-300 hover:text-white ${
              path === "/courses" ? "text-white" : ""
            }`}
          >
            Courses
          </Link>
          <Link
            href="/bookmark"
            className={`cursor-pointer hover:text-darkRed transition duration-300 hover:text-white ${
              path === "/bookmark" ? "text-white" : ""
            }`}
          >
            Bookmark
          </Link>
          <Link
            href="/dashboard"
            className={`cursor-pointer hover:text-darkRed transition duration-300 hover:text-white ${
              path === "/dashboard" ? "text-white" : ""
            }`}
          >
            Dashboard
          </Link>
        </div>
        <div>
          {session.status === "authenticated" ? (
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 hidden sm:flex justify-center items-center rounded-full overflow-hidden focus:outline-none border border-slaty/30 transition duration-300 hover:border-slaty/50"
              >
                <Image
                  src={(session.data?.user?.image as string) || "/code.jpg"}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </button>
              <button onClick={() => setIsOpenMenu(!isOpenMenu)}>
                <IoMenu className="sm:hidden flex text-2xl" />
              </button>

              {isOpenMenu && (
                <div className="absolute flex flex-col gap-2 right-0 mt-2 p-2 text-lg border border-lightSlaty shadow-lg bg-mediumSlaty rounded-lg transition duration-300 z-50">
                  <Link
                    href="/"
                    className={`cursor-pointer hover:text-darkRed transition duration-300 ${
                      path === "/" ? "text-white" : ""
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/courses"
                    className={`cursor-pointer hover:text-darkRed transition duration-300 ${
                      path === "/courses" ? "text-white" : ""
                    }`}
                  >
                    Courses
                  </Link>
                  <Link
                    href="/bookmark"
                    className={`cursor-pointer hover:text-darkRed transition duration-300 ${
                      path === "/bookmark" ? "text-white" : ""
                    }`}
                  >
                    Bookmark
                  </Link>
                  <Link
                    href="/dashboard"
                    className={`cursor-pointer hover:text-darkRed transition duration-300 ${
                      path === "/dashboard" ? "text-white" : ""
                    }`}
                  >
                    Dashboard
                  </Link>
                </div>
              )}
              {isOpen && (
                <div className="absolute right-0 mt-2 border border-lightSlaty shadow-lg bg-mediumSlaty rounded-lg transition duration-300 z-50">
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
              className="px-5 py-[10px] flex gap-2 items-center rounded-[8px] cursor-pointer font-semibold text-sm bg-lightBlue hover:bg-lightBlue/80 transition duration-300"
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
