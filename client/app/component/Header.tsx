"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useParams } from "next/navigation";
import React, { useEffect } from "react";

const Header = () => {
  const param = useParams();
  const session = useSession();
  const { id, videoId } = param;
  const path = usePathname();
  // const router = useRouter();

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
    console.log("sing out");
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
          <div className="flex gap-4">
            {/* <button className="cursor-pointer">Login</button> */}
            {session.status === "authenticated" ? (
              <div>
                {session.data.user?.name}{" "}
                <button onClick={() => handleSignout()}>logout</button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="border border-black px-3 py-1 rounded-[6px] cursor-pointer hover:bg-slaty/10 transition duration-300"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
