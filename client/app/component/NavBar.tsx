import React from "react";
import { LuGithub } from "react-icons/lu";
import { AiOutlineInstagram } from "react-icons/ai";
import { RiTwitterXLine } from "react-icons/ri";
import { CiLinkedin } from "react-icons/ci";
import Link from "next/link";
import * as Tooltip from "@radix-ui/react-tooltip";

const NavBar = () => {
  return (
    <div className="w-full py-[1rem] px-4 border-t border-lightSlaty flex justify-center z-20">
      <div className="w-[70rem] flex justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-white text-xl">Connect with me</p>
          <div className="flex gap-2 text-slaty/60">
            <Tooltip.Provider delayDuration={0}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link href="https://github.com/anuprajvarma" target="_blank">
                    <LuGithub className="cursor-pointer w-5 h-5 hover:text-slaty transition duration-300" />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    className="bg-lightSlaty text-slaty px-3 py-2 text-sm rounded shadow-md z-20"
                  >
                    Github
                    <Tooltip.Arrow className="fill-lightSlaty" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
            <Tooltip.Provider delayDuration={0}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link
                    href="https://www.instagram.com/_anupraj_01/"
                    target="_blank"
                  >
                    <AiOutlineInstagram className="cursor-pointer hover:text-slaty transition duration-300 w-5 h-5" />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    className="bg-lightSlaty text-slaty px-3 py-2 text-sm rounded shadow-md z-20"
                  >
                    Instagram
                    <Tooltip.Arrow className="fill-lightSlaty" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
            <Tooltip.Provider delayDuration={0}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link href="https://x.com/Anupraj_varma" target="_blank">
                    <RiTwitterXLine className="cursor-pointer hover:text-slaty transition duration-300 w-5 h-5" />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    className="bg-lightSlaty text-slaty px-3 py-2 text-sm rounded shadow-md z-20"
                  >
                    Twitter
                    <Tooltip.Arrow className="fill-lightSlaty" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
            <Tooltip.Provider delayDuration={0}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link
                    href="https://www.linkedin.com/in/anuprajvarma/"
                    target="_blank"
                  >
                    <CiLinkedin className="cursor-pointer w-5 h-5 hover:text-slaty transition duration-300" />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    className="bg-lightSlaty text-slaty px-3 py-2 text-sm rounded shadow-md z-20"
                  >
                    LinkedIn
                    <Tooltip.Arrow className="fill-lightSlaty" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-white text-xl">Contribute</p>
          <div className="flex gap-2 items-center text-slaty/60">
            <p>Cape</p>
            <Tooltip.Provider delayDuration={0}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link
                    href="https://github.com/anuprajvarma/cape"
                    target="_blank"
                  >
                    <LuGithub className="cursor-pointer hover:text-slaty transition duration-300 w-5 h-5" />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    className="bg-lightSlaty text-slaty px-3 py-2 text-sm rounded shadow-md z-20"
                  >
                    Contribute in this project
                    <Tooltip.Arrow className="fill-lightSlaty" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
