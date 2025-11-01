"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { SiSololearn } from "react-icons/si";
import { FaArrowRight } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { toast } from "react-toastify";

import { loginFuntion, signOutFuntion } from "../utils/apiCalls";
import useClickOutside from "../utils/outsideClick";

type User = {
  name: string;
  email: string;
  imageUrl: string;
};

const Header = () => {
  const session = useSession();
  const path = usePathname();
  const param = useParams();
  const router = useRouter();
  const { id, videoId } = param;
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User>();
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const inputRef = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  const handleSignout = async () => {
    await signOut();
    await signOutFuntion();
  };

  useEffect(() => {
    const handleGoogleAuthSubmit = async () => {
      const res = await loginFuntion({
        name: session.data?.user?.name ?? "",
        email: session.data?.user?.email ?? "",
        imageUrl: session.data?.user?.image ?? "",
      });
      const data = await res?.json();
      if (!data) {
        setLoginLoading(false);

        toast.error("Error while login try after sometime", {
          hideProgressBar: true,
        });
        return;
      }

      setUser(data);
      setIsLogin(true);
      setLoginLoading(false);
    };
    if (session.status === "authenticated") {
      setLoginLoading(true);
      handleGoogleAuthSubmit();
    }
  }, [
    session.data?.user?.email,
    session.data?.user?.image,
    session.data?.user?.name,
    session.status,
  ]);

  return (
    <div className="w-full p-4 flex justify-center fixed top-0 shadow bg-[#101827]/80 backdrop-blur z-50">
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
        <div ref={inputRef}>
          {isLogin ? (
            <div className="relative">
              <div className="justify-center items-center w-11 h-5 sm:flex hidden">
                <button
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                  className="flex items-center justify-center rounded-full overflow-hidden focus:outline-none"
                >
                  <Image
                    src={(user?.imageUrl as string) || "/code.jpg"}
                    alt="Profile"
                    quality={100}
                    sizes="60px"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-full border border-slaty/30 transition duration-300 hover:border-slaty/50"
                  />
                </button>
              </div>
              <button onClick={() => setIsOpenMenu(!isOpenMenu)}>
                <IoMenu className="sm:hidden flex text-3xl" />
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 border border-lightSlaty shadow-lg bg-mediumSlaty rounded-lg transition duration-300">
                  <button
                    onClick={handleSignout}
                    className="w-full text-left px-4 py-2 rounded text-lightYellow"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : loginLoading ? (
            <div className="flex justify-center items-center w-11 h-5"></div>
          ) : (
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => signIn("google")}
                className="px-3 py-[7px] sm:px-5 sm:py-[10px] flex gap-2 items-center rounded-[8px] cursor-pointer font-semibold text-sm bg-lightBlue hover:bg-lightBlue/80 transition duration-300"
              >
                <p>Sign in</p>
                <FaArrowRight />
              </button>
              <button onClick={() => setIsOpenMenu(!isOpenMenu)}>
                <IoMenu className="sm:hidden flex text-3xl" />
              </button>
            </div>
          )}

          {isOpenMenu && (
            <div className="fixed flex flex-col gap-2 justify-between h-screen w-6/12 right-0 -top-2 mt-2 p-4 text-lg border-l border-lightSlaty shadow-lg bg-mediumSlaty transition duration-300">
              <div className="flex flex-col gap-8">
                <div className="flex justify-between">
                  <button
                    className="font-semibold text-2xl"
                    onClick={() => setIsOpenMenu(false)}
                  >
                    X
                  </button>
                  <SiSololearn
                    onClick={() => setIsOpenMenu(false)}
                    className="text-lightBlue w-6 h-6"
                  />
                </div>
                <button
                  onClick={() => {
                    setIsOpenMenu(false);
                    router.push("/");
                  }}
                  className={`cursor-pointer hover:text-darkRed transition duration-300 font-semibold text-2xl ${
                    path === "/" ? "text-white" : ""
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setIsOpenMenu(false);
                    router.push("/courses");
                  }}
                  className={`cursor-pointer hover:text-darkRed transition duration-300 font-semibold text-2xl ${
                    path === "/courses" ? "text-white" : ""
                  }`}
                >
                  Courses
                </button>
                <button
                  onClick={() => {
                    setIsOpenMenu(false);
                    router.push("/bookmark");
                  }}
                  className={`cursor-pointer hover:text-darkRed transition duration-300 font-semibold text-2xl ${
                    path === "/bookmark" ? "text-white" : ""
                  }`}
                >
                  Bookmark
                </button>
                <button
                  onClick={() => {
                    setIsOpenMenu(false);
                    router.push("/dashboard");
                  }}
                  className={`cursor-pointer hover:text-darkRed transition duration-300 font-semibold text-2xl ${
                    path === "/dashboard" ? "text-white" : ""
                  }`}
                >
                  Dashboard
                </button>
              </div>
              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="relative w-[3rem] h-[3rem]">
                    <Image
                      src={(user?.imageUrl as string) || "/code.jpg"}
                      alt="Profile"
                      quality={100}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-full border border-slaty/30 transition duration-300 hover:border-slaty/50"
                    />
                  </div>
                  <button
                    onClick={handleSignout}
                    className="text-xl font-semibold text-red-500 py-1 px-2 border border-red-500 rounded-lg"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
