import React from "react";
import { PiLinkedinLogoBold } from "react-icons/pi";
import { LuGithub } from "react-icons/lu";
import { AiOutlineInstagram } from "react-icons/ai";
import { RiTwitterXLine } from "react-icons/ri";
import Link from "next/link";

const NavBar = () => {
  return (
    <div className="w-full py-[1rem] px-4 border-t border-lightSlaty flex justify-center z-20">
      <div className="w-[70rem] flex justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-white text-xl">Connect with me</p>
          <div className="flex gap-2 text-slaty/60">
            <Link
              href="https://www.linkedin.com/in/anuprajvarma/"
              target="_blank"
            >
              <PiLinkedinLogoBold className="cursor-pointer hover:text-darkRed transition duration-300 w-5 h-5" />
            </Link>
            <Link href="https://github.com/anuprajvarma" target="_blank">
              <LuGithub className="cursor-pointer hover:text-darkRed transition duration-300 w-5 h-5" />
            </Link>
            <Link href="https://www.instagram.com/_anupraj_01/" target="_blank">
              <AiOutlineInstagram className="cursor-pointer hover:text-darkRed transition duration-300 w-5 h-5" />
            </Link>
            <Link href="https://x.com/Anupraj_varma" target="_blank">
              <RiTwitterXLine className="cursor-pointer hover:text-darkRed transition duration-300 w-5 h-5" />
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-white text-xl">Contribute</p>
          <div className="flex gap-2 items-center text-slaty/60">
            <p>Cape</p>
            <Link href="https://github.com/anuprajvarma/cape" target="_blank">
              <LuGithub className="cursor-pointer hover:text-darkRed transition duration-300 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
