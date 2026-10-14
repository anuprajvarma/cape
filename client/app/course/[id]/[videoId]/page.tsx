"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Linkify from "linkify-react";

import NotesGpt from "@/app/component/NotesGpt";
import { LoginModal } from "@/app/component/LoginModal";
import { CourseLinkModal } from "@/app/component/CourseLinkModal";
import { DiscussionSection } from "@/app/component/DiscussionSection";
import { PlayVideoSection } from "@/app/component/PlayVideo";
import { PlaylistVideosSection } from "@/app/component/PlaylistVideosSection";

import { AppDispatch, RootState } from "../../../redux/store";
import { setPlayListLength } from "@/app/redux/slices/PlaylistLengthSlice";

import {
  fetchfirstVideoIdOfPlaylist,
  PlaylistLength,
} from "../../../utils/frontendApiCalls";
import { fetchMultipleTypeData } from "../../../utils/backendApiCalls";
import { VideoDetail } from "@/app/hooks/videoDetail";
import { SessionAndRouterDetails } from "@/app/hooks/sesionAndRouterDetail";

const options = {
  target: "_blank",
  rel: "noopener noreferrer",
  className: () => "text-blue-600 underline prose",
};

export default function Course() {
  const { router, session, params } = SessionAndRouterDetails();
  const { id, videoId } = params;
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);

  const checkboxTrack = useSelector((state: RootState) => state.checkbox);
  const dispatch = useDispatch<AppDispatch>();
  const { videoTitle, videoDescription } = VideoDetail({ videoId });

  useEffect(() => {
    const fetchLengths = async () => {
      const data = await PlaylistLength({ id });
      dispatch(setPlayListLength(data.items[0].contentDetails.itemCount));
    };

    fetchLengths();
  }, [id]);

  useEffect(() => {
    const load = async () => {
      const result = await fetchfirstVideoIdOfPlaylist(id);
      router.push(`/course/${id}/${result}`);
    };
    if (videoId === "1") {
      load();
    }
  }, [id, videoId, router]);

  useEffect(() => {
    const getChapterData = async () => {
      if (typeof id === "string") {
        const result = await fetchMultipleTypeData({
          email: session.data?.user?.email ?? "",
          playlistId: id,
          url: "/enrolledCourse/getChapterData",
        });
        if (result.getChapterData?.chapters) {
          setCompletedChapters(result.getChapterData?.chapters);
        }
      }
    };
    getChapterData();
  }, [session.data?.user, id, checkboxTrack]);

  const lines = videoDescription
    ?.split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return (
    <>
      <CourseLinkModal />
      <LoginModal />
      <div className="w-full -z-20 py-4 px-1 sm:px-4 flex flex-col gap-2 justify-center text-slaty mt-16">
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
            <Disclosure as="div" className="" defaultOpen={false}>
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
            </Disclosure>
            <NotesGpt
              id={id as string}
              videoId={videoId as string}
              videoTitle={videoTitle}
            />
          </div>
          <div className="flex flex-col gap-5">
            <div className="w-[30rem] border border-lightSlaty rounded-xl hidden lg:flex flex-col">
              <PlaylistVideosSection
                id={id}
                videoId={videoId}
                completedChapters={completedChapters}
                mobile={true}
              />
            </div>
            <DiscussionSection id={id} videoId={videoId} />
          </div>
        </div>
      </div>
    </>
  );
}
