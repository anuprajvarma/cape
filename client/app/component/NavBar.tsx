import React from "react";
import { PiLinkedinLogoBold } from "react-icons/pi";
import { LuGithub } from "react-icons/lu";
import { AiOutlineInstagram } from "react-icons/ai";
import { RiTwitterXLine } from "react-icons/ri";
import { FaGithubAlt } from "react-icons/fa";
import Link from "next/link";

const NavBar = () => {
  return (
    <div className="w-full py-2 px-4 text-black border-t border-slaty flex justify-center z-20">
      <div className="w-[70rem] flex justify-between">
        <div className="flex flex-col gap-1">
          <p>Contact Me</p>
          <div className="flex gap-2">
            <Link
              href="https://www.linkedin.com/in/anuprajvarma/"
              target="_blank"
            >
              <PiLinkedinLogoBold className="cursor-pointer" />
            </Link>
            <Link href="https://github.com/anuprajvarma" target="_blank">
              <LuGithub className="cursor-pointer" />
            </Link>
            <Link href="https://www.instagram.com/_anupraj_01/" target="_blank">
              <AiOutlineInstagram className="cursor-pointer" />
            </Link>
            <Link href="https://x.com/Anupraj_varma" target="_blank">
              <RiTwitterXLine className="cursor-pointer" />
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p>Contribute</p>
          <div className="flex gap-2">
            <Link href="https://github.com/anuprajvarma/cape" target="_blank">
              <FaGithubAlt className="cursor-pointer" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
