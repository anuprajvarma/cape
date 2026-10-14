"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PlalistVideoCard from "../../../component/PlalistVideoCard";
import { playlistType2 } from "@/types";
import { fetchfirstVideoIdOfPlaylist } from "../../../utils/frontendApiCalls";
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
import {
  fetchPlaylistVideos,
  fetchVideoDetail,
} from "@/app/utils/frontendApiCalls";
import { LoginModal } from "@/app/component/LoginModal";
import { CourseLinkModal } from "@/app/component/CourseLinkModal";
import { DiscussionSection } from "@/app/component/DiscussionSection";
import { VideoTitleSection } from "@/app/component/VideoTitleSection";
import { ChapterCompletionTracker } from "@/app/component/ChapterCompletionTracker";

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
  const [playlists, setPlaylists] = useState<playlistType2[]>([]);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [playlistLengths, setPlaylistLengths] = useState<
    Record<string, string>
  >({});
  const [precentage, setPrecentage] = useState<number>(0);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");

  useEffect(() => {
    const load = async () => {
      const result = await fetchfirstVideoIdOfPlaylist(id);
      router.push(`/course/${id}/${result}`);
    };
    if (videoId === "1") {
      load();
    }
  }, []);

  useEffect(() => {
    const playlist = async () => {
      if (typeof videoId === "string") {
        const result = await fetchVideoDetail({ videoId });
        if (result) {
          setVideoTitle(result[0]?.snippet.title);
          setVideoDescription(result[0]?.snippet.description);
        }
      }
    };
    if (videoId) {
      playlist();
    }
  }, [videoId]);

  const actualId = Array.isArray(id) ? id[0] : id;

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
    if (actualId && playlistLengths[actualId]) {
      const percentage =
        (100 * completedChapters.length) / Number(playlistLengths[actualId]);
      setPrecentage(Math.round(percentage));
    }
  }, [actualId, playlistLengths, completedChapters.length]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const playlist = async () => {
      if (typeof id === "string") {
        const result = await fetchPlaylistVideos({ id });
        setPlaylists(result);
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
            <div className="flex w-full h-[20rem] items-center justify-center sm:h-[41.6rem] ">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                className="rounded-lg w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media"
                title="YouTube video player"
              />
            </div>
            <VideoTitleSection
              id={id}
              videoTitle={videoTitle}
              videoId={videoId}
              playlists={playlists}
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
                <div className="py-2 h-[586px] flex flex-col gap-4 rounded-xl overflow-y-auto">
                  {playlists?.map((data, index) => {
                    const id = data.snippet?.playlistId;
                    const videoid = data.snippet?.resourceId.videoId;
                    const isChecked = completedChapters?.includes(videoid);
                    if (!hasMounted) return null;
                    console.log("video id " + videoid);
                    return (
                      <PlalistVideoCard
                        title={data.snippet?.title}
                        channelTitle={data.snippet?.channelTitle}
                        thumbnails={data.snippet?.thumbnails.high?.url}
                        id={id}
                        isChecked={isChecked}
                        videoId={videoid}
                        currentvideoId={videoId as string}
                        key={index}
                        index={index}
                      />
                    );
                  })}
                </div>
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
            <div className="w-[30rem] h-[41.6rem] border border-lightSlaty rounded-xl hidden lg:flex flex-col">
              <ChapterCompletionTracker
                id={id}
                playlistLengths={playlistLengths}
                completedChapters={completedChapters}
                precentage={precentage}
              />
              <div className="py-2 flex flex-col gap-4 rounded-xl overflow-y-auto scrollbar-hide">
                {playlists?.map((data, index) => {
                  const id = data.snippet?.playlistId;
                  const videoid = data.snippet?.resourceId.videoId;
                  const isChecked = completedChapters?.includes(videoid);
                  if (!hasMounted) return null;
                  return (
                    <PlalistVideoCard
                      title={data.snippet?.title}
                      channelTitle={data.snippet?.channelTitle}
                      thumbnails={data.snippet?.thumbnails.high?.url}
                      id={id}
                      isChecked={isChecked}
                      videoId={videoid}
                      currentvideoId={videoId as string}
                      key={index}
                      index={index}
                    />
                  );
                })}
              </div>
            </div>
            <DiscussionSection id={id} videoId={videoId} />
          </div>
        </div>
      </div>
    </>
  );
}
