"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { playlistType2 } from "@/types";
import {
  fetchfirstVideoIdOfPlaylist,
  PlaylistLength,
} from "../../../utils/frontendApiCalls";
import { fetchMultipleTypeData } from "../../../utils/backendApiCalls";
import { useSession } from "next-auth/react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Linkify from "linkify-react";
import NotesGpt from "@/app/component/NotesGpt";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { fetchPlaylistVideos } from "@/app/utils/frontendApiCalls";
import { LoginModal } from "@/app/component/LoginModal";
import { CourseLinkModal } from "@/app/component/CourseLinkModal";
import { DiscussionSection } from "@/app/component/DiscussionSection";
import { PlayVideoSection } from "@/app/component/PlayVideo";
import { PlaylistVideosSection } from "@/app/component/PlaylistVideosSection";

const options = {
  target: "_blank",
  rel: "noopener noreferrer",
  className: () => "text-blue-600 underline prose",
};

export default function Course() {
  const session = useSession();
  const params = useParams();
  const router = useRouter();
  const { id, videoId } = params;
  const checkboxTrack = useSelector((state: RootState) => state.checkbox);
  const [PlaylistVideos, setPlaylistVideos] = useState<playlistType2[]>([]);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [playlistLengths, setPlaylistLengths] = useState<number>();
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoDescription, setVideoDescription] = useState<string>("");

  useEffect(() => {
    const fetchLengths = async () => {
      const data = await PlaylistLength({ id });
      setPlaylistLengths(data.items[0].contentDetails.itemCount);
    };
    if (PlaylistVideos?.length > 0) {
      fetchLengths();
    }
  }, [PlaylistVideos, id]);

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

  useEffect(() => {
    const playlist = async () => {
      if (typeof id === "string") {
        const result = await fetchPlaylistVideos({ id });
        setPlaylistVideos(result);
      }
    };
    playlist();
  }, [id]);

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
              playlistLengths={playlistLengths}
              completedChapters={completedChapters}
              setPlaylistLengths={setPlaylistLengths}
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
                  playlistLengths={playlistLengths}
                  playlists={PlaylistVideos}
                  completedChapters={completedChapters}
                  mobile={false}
                  setVideoTitle={setVideoTitle}
                  setVideoDescription={setVideoDescription}
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
                playlistLengths={playlistLengths}
                playlists={PlaylistVideos}
                completedChapters={completedChapters}
                mobile={true}
                setVideoTitle={setVideoTitle}
                setVideoDescription={setVideoDescription}
              />
            </div>
            <DiscussionSection id={id} videoId={videoId} />
          </div>
        </div>
      </div>
    </>
  );
}
