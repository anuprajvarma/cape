"use client";

import React, { useEffect, useState } from "react";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  BookOpenIcon,
  Bars3BottomRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { CgTranscript } from "react-icons/cg";
import { PiShareFat } from "react-icons/pi";

import NotesGpt from "@/app/component/NotesGpt";
import { LoginModal } from "@/app/component/LoginModal";
import { CourseLinkModal } from "@/app/component/CourseLinkModal";
import { PlayVideoSection } from "@/app/component/PlayVideo";
import { PlaylistVideosSection } from "@/app/component/PlaylistVideosSection";

import { useSessionsDetails } from "@/app/hooks/sesionAndRouterDetail";
import { setCheckBox } from "../../../redux/slices/checkboxSlice";
import { useCourse } from "@/app/hooks/course";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { playlistType2 } from "@/types";
import { fetchPlaylistVideos } from "@/app/utils/frontendApiCalls";
import { handleChapterActions } from "@/app/utils/backendApiCalls";
import { setIsOpen } from "@/app/redux/slices/LoginModalSlice";
import {
  groupTranscriptByPeriod,
  TranscriptPeriod,
} from "@/app/utils/reusableConstant";
import { setCourseLinkModal } from "@/app/redux/slices/CourseLinkModal";
import { setCourseLink } from "@/app/redux/slices/CourseLink";

export default function Course() {
  const { params } = useSessionsDetails();
  const { id, videoId } = params;
  const { router, session } = useSessionsDetails();
  const dispatch = useDispatch<AppDispatch>();
  const [transcript, setTranscript] = useState<TranscriptPeriod[]>([]);
  const checkboxTrack = useSelector((state: RootState) => state.checkbox);
  const { completedChapters, videoTitle } = useCourse({
    id,
    videoId,
  });
  const [openMenu, setIsOpenMenu] = useState<boolean>(false);
  const playlistLengths = useSelector(
    (state: RootState) => state.PlaylistLengthReducer,
  );

  const [position, setPosition] = useState<number>(1);
  const [chapterOpen, setChapterOpen] = useState<boolean>(true);
  const [PlaylistVideos, setPlaylistVideos] = useState<playlistType2[]>([]);

  const isFirstVideo = position <= 1;
  const isLastVideo = position >= playlistLengths;

  const handlePrevious = () => {
    if (isFirstVideo) return;
    router.push(
      `/course/${id}/${PlaylistVideos[position - 2].snippet.resourceId.videoId}`,
    );
  };

  const handleNext = () => {
    if (isLastVideo) return;
    router.push(
      `/course/${id}/${PlaylistVideos[position].snippet.resourceId.videoId}`,
    );
  };

  const isChecked: boolean =
    typeof videoId === "string" &&
    completedChapters?.includes(videoId) === true;

  useEffect(() => {
    const playlist = async () => {
      if (typeof id === "string") {
        const result = await fetchPlaylistVideos({ id });
        setPlaylistVideos(result);
      }
    };
    playlist();
  }, [id]);

  useEffect(() => {
    const playlist = async () => {
      if (typeof id === "string") {
        const result = await fetchPlaylistVideos({ id });
        // setPlaylistVideos(result);
        const videoPosition = result.findIndex(
          (video: playlistType2) =>
            video.snippet.resourceId.videoId === videoId,
        );
        setPosition(videoPosition + 1);
        // console.log("Video position:", videoPosition + 1);
      }
    };
    playlist();
  }, [id, videoId]);

  const checkBoxHandler = async (e: boolean) => {
    if (session.status === "authenticated") {
      await handleChapterActions({
        isCompleted: e,
        email: session.data?.user?.email ?? "",
        playlistId: id,
        videoId: videoId,
        title: videoTitle,
        channelTitle: "afasfd",
        thumbnails: "afdasdf",
        description: "random",
        bookmark: true,
        indexOrder: 0,
      });
      dispatch(setCheckBox(!checkboxTrack));
    } else {
      dispatch(setIsOpen(true));
    }
  };

  useEffect(() => {
    const fetchVideoTranscript = async (videoId: string) => {
      const response = await fetch("/api/transcripts/fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Transcript fetch failed");
      }
      const periods = groupTranscriptByPeriod(data.segments, 20_000);

      setTranscript(periods);
    };
    if (typeof videoId === "string") {
      fetchVideoTranscript(videoId);
    }
  }, [videoId]);

  // useEffect(() => {
  //   const chapters = async () => {
  //     const result = await fetchChapters({ transcript });
  //     // const data = await result.json()
  //   };

  //   chapters();
  // }, [transcript]);

  return (
    <>
      <CourseLinkModal />
      <LoginModal />
      <div className="w-full relative px-2 flex flex-col justify-center text-slaty h-screen">
        {openMenu && (
          <div className="absolute z-50 h-full w-120 left-0 bg-white/5 backdrop-blur-2xl border border-white/5">
            <PlaylistVideosSection
              id={id}
              videoId={videoId}
              setIsOpenMenu={setIsOpenMenu}
              completedChapters={completedChapters}
              mobile={true}
            />
          </div>
        )}
        <div className="w-full flex justify-between gap-2 py-4">
          <div className="w-3/5 flex justify-between px-2">
            <div className="flex gap-3 items-center justify-center">
              <Bars3BottomRightIcon
                className="w-8 h-8 cursor-pointer text-white hover:text-brand-slate-1 transition duration-500"
                onClick={() => setIsOpenMenu(true)}
              />
              <p className="font-semibold">
                {position}. {videoTitle}
              </p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                className={`w-5 h-5 ${
                  isChecked ? "accent-brand-slate-1" : "accent-white"
                } rounded cursor-pointer`}
                checked={isChecked}
                onChange={(e) => checkBoxHandler(e.target.checked)}
              />
            </div>
          </div>
          <div className="w-2/5 flex justify-between items-center text-brand-slate-1">
            <p>
              Completed - {completedChapters.length}/{playlistLengths}
            </p>
            <PiShareFat
              onClick={async () => {
                dispatch(setCourseLinkModal(true));
                dispatch(
                  setCourseLink(
                    `https://cape-lyart.vercel.app/course/${id}/${videoId}`,
                  ),
                );
              }}
              className="w-7 h-7 cursor-pointer text-white hover:text-brand-slate-1 transiton duration-500"
            />
          </div>
        </div>
        <div className="w-full flex justify-between gap-2 h-11/12">
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
                  setIsOpenMenu={setIsOpenMenu}
                  completedChapters={completedChapters}
                  mobile={false}
                />
              </DisclosurePanel>
            </Disclosure>
            <div className="w-full px-2 flex justify-between">
              <div className="flex gap-4 bg-white/5 backdrop-blur-2xl border border-white/5 rounded-xl p-2">
                <button
                  onClick={() => setChapterOpen(true)}
                  className={`${chapterOpen && "bg-white/5 backdrop-blur-2xl"} border border-brand-slate-1/20 rounded-lg flex gap-1 py-1 px-2 items-center cursor-pointer hover:bg-white/5 hover:backdrop-blur-2xl text-sm`}
                >
                  <CgTranscript className="w-5 h-5" />
                  <p>Transcripts</p>
                </button>
                <button
                  onClick={() => setChapterOpen(false)}
                  className={`${chapterOpen === false && "bg-white/5 backdrop-blur-2xl"} border border-brand-slate-1/20 rounded-lg flex gap-1 py-1 px-2 items-center cursor-pointer hover:bg-white/5 hover:backdrop-blur-2xl text-sm`}
                >
                  <BookOpenIcon className="w-5 h-5" />
                  <p>Chapters</p>
                </button>
              </div>
              <div className="flex gap-2 items-center justify-center">
                {position !== undefined && (
                  <>
                    <ArrowLeftIcon
                      onClick={handlePrevious}
                      className={`h-5 w-5 text-white hover:text-brand-slate-1 font-bold ${
                        isFirstVideo
                          ? "cursor-not-allowed opacity-40"
                          : "cursor-pointer"
                      }`}
                    />

                    <ArrowRightIcon
                      onClick={handleNext}
                      className={`h-5 w-5 text-white hover:text-brand-slate-1 font-bold ${
                        isLastVideo
                          ? "cursor-not-allowed opacity-40"
                          : "cursor-pointer"
                      }`}
                    />
                  </>
                )}
              </div>
            </div>
            {chapterOpen ? (
              <div className="px-2 w-full h-full overflow-y-auto flex flex-col gap-4">
                {transcript.length > 0 ? (
                  transcript?.map((data, index) => {
                    return (
                      <div key={index} className="flex w-full flex-col gap-1">
                        <p className="p-1 w-20 text-center rounded-lg text-sm">
                          {data.start / 1000} - {data.end / 1000}
                        </p>
                        <p className="bg-brand-slate-1/10 p-2 rounded-lg">
                          {data.text}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-2 w-full h-full overflow-y-auto flex flex-col gap-4 justify-center items-center text-lg">
                    <p>This video have no caption</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="px-2 w-full h-full overflow-y-auto flex flex-col gap-4 justify-center items-center text-lg">
                <p>This feature is not added right now try after some time</p>
              </div>
            )}
          </div>

          <div className="w-240 h-full border border-brand-slate-1/20 rounded-xl hidden lg:flex flex-col">
            <NotesGpt
              id={id as string}
              videoId={videoId as string}
              videoTitle={videoTitle}
            />
          </div>
        </div>
      </div>
    </>
  );
}
