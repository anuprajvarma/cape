"use client";

import React from "react";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { BookOpenIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { CgTranscript } from "react-icons/cg";

// import Linkify from "linkify-react";

import NotesGpt from "@/app/component/NotesGpt";
import { LoginModal } from "@/app/component/LoginModal";
import { CourseLinkModal } from "@/app/component/CourseLinkModal";
import { PlayVideoSection } from "@/app/component/PlayVideo";
import { PlaylistVideosSection } from "@/app/component/PlaylistVideosSection";

import { useSessionsDetails } from "@/app/hooks/sesionAndRouterDetail";
import { useCourse } from "@/app/hooks/course";

// const options = {
//   target: "_blank",
//   rel: "noopener noreferrer",
//   className: () => "text-blue-600 underline prose",
// };

export default function Course() {
  const { params } = useSessionsDetails();
  const { id, videoId } = params;
  const { completedChapters, videoTitle } = useCourse({
    id,
    videoId,
  });

  // const lines = videoDescription
  //   ?.split("\n")
  //   .map((line) => line.trim())
  //   .filter((line) => line.length > 0);

  return (
    <>
      <CourseLinkModal />
      <LoginModal />
      <div className="w-full z-50 px-1 sm:px-4 flex flex-col gap-2 justify-center text-slaty">
        <div className="w-full flex justify-between gap-2">
          <div className="w-full flex flex-col gap-4">
            <PlayVideoSection
              id={id}
              videoTitle={videoTitle}
              videoId={videoId}
              completedChapters={completedChapters}
            />
            <Disclosure as="div" className="lg:hidden" defaultOpen={false}>
              <DisclosureButton className="group flex w-full bg-mediumSlaty p-1 sm:p-2 rounded-lg items-center text-md border border-lightSlaty justify-between">
                <span>Playlists</span>
                <ChevronDownIcon className="size-5 fill-slaty group-data-hover:fill-white/50 group-data-open:rotate-180" />
              </DisclosureButton>
              <DisclosurePanel className="mt-2 text-sm/5 text-slaty">
                <PlaylistVideosSection
                  id={id}
                  videoId={videoId}
                  completedChapters={completedChapters}
                  mobile={false}
                />
              </DisclosurePanel>
            </Disclosure>
            <div className="w-full p-2 flex justify-between">
              <div className="bg-white/5 backdrop-blur-2xl rounded-lg border border-white/5 flex gap-2 p-2">
                <div className="bg-white/5 backdrop-blur-2xl rounded-lg flex gap-1 py-1 px-2">
                  <BookOpenIcon />
                  <p>Chapters</p>
                </div>
                <div className="rounded-lg flex gap-1 py-1 px-2 items-center ">
                  <CgTranscript />
                  <p>Transcripts</p>
                </div>
              </div>
              <div className="flex gap-4 items-center justify-center">
                <div className="bg-white/10 backdrop-blur-2xl rounded-lg flex gap-1 py-1 px-2  items-center justify-center">
                  <ChevronUpIcon className="w-6 h-6" />
                </div>
                <div className="bg-white/10 backdrop-blur-2xl rounded-lg flex gap-1 py-1 px-2 items-center justify-center">
                  <input type="checkbox" className="w-6 h-6" />
                </div>
              </div>
            </div>
            {/* <Disclosure as="div" className="" defaultOpen={false}>
              <DisclosureButton className="group flex w-full items-center text-md justify-between px-1 sm:px-2 rounded-lg">
                <span>Description</span>
                <ChevronDownIcon className="size-5 fill-slaty group-data-hover:fill-white/50 group-data-open:rotate-180" />
              </DisclosureButton>
              <DisclosurePanel className="mt-2 text-sm/5 text-slaty px-1 sm:px-2">
                {lines?.map((line, idx) => (
                  <p key={idx}>
                    <Linkify options={options}>{line}.</Linkify>
                  </p>
                ))}
              </DisclosurePanel>
            </Disclosure> */}
          </div>

          <div className="w-240 h-screen border border-brand-slate-1/20 rounded-xl hidden lg:flex flex-col">
            <NotesGpt
              id={id as string}
              videoId={videoId as string}
              videoTitle={videoTitle}
            />
            {/* <PlaylistVideosSection
              id={id}
              videoId={videoId}
              completedChapters={completedChapters}
              mobile={true}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
}
