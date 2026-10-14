"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PlalistVideoCard from "../../../component/PlalistVideoCard";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { playlistType2 } from "@/types";
import { fetchfirstVideoIdOfPlaylist } from "../../../utils/frontendApiCalls";
import { youtubeApiKey } from "../../../utils/reusableConstant";
import { fetchMultipleTypeData } from "../../../utils/backendApiCalls";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { setCourseLinkModal } from "../../../redux/slices/CourseLinkModal";
import { setCourseLink } from "../../../redux/slices/CourseLink";
import * as Tooltip from "@radix-ui/react-tooltip";
import { IoMdShareAlt } from "react-icons/io";
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

const options = {
  target: "_blank",
  rel: "noopener noreferrer",
  className: () => "text-blue-600 underline prose",
};

const apikey = youtubeApiKey();

export default function Course() {
  const session = useSession();
  const params = useParams();
  const router = useRouter();
  const { id, videoId } = params;
  const checkboxTrack = useSelector((state: RootState) => state.checkbox);
  const dispatch = useDispatch<AppDispatch>();
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

  useEffect(() => {
    const fetchLengths = async () => {
      const newLengths: Record<string, string> = {};
      await Promise.all(
        playlists.map(async (item) => {
          const id = item.snippet?.playlistId;
          if (id) {
            const lenthRes = await fetch(
              `https://www.googleapis.com/youtube/v3/playlists?part=contentDetails&id=${id}&key=${apikey}`,
            );

            const data = await lenthRes.json();
            if (data.items[0]) {
              newLengths[id] = data.items[0]?.contentDetails?.itemCount || 0;
            }
          }
        }),
      );

      setPlaylistLengths(newLengths);
    };

    if (playlists?.length > 0) {
      fetchLengths();
    }
  }, [playlists]);

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
            <div className="flex gap-2 justify-between bg-mediumSlaty border-lightSlaty p-1 sm:p-2 rounded-lg">
              <p className="text-lg font-semibold text-white line-clamp-1">
                {videoTitle}
              </p>
              <Tooltip.Provider delayDuration={0}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      className="flex gap-8 items-center"
                      onClick={() => {
                        dispatch(setCourseLinkModal(true));
                        dispatch(
                          setCourseLink(
                            `https://cape-lyart.vercel.app/course/${id}/${videoId}`,
                          ),
                        );
                      }}
                    >
                      <div className="flex lg:hidden gap-2 font-medium text-slaty/80">
                        <p className="text-slaty sm:flex hidden">Progress -</p>
                        <div>
                          {typeof id === "string" && playlistLengths[id] && (
                            <p>{`${completedChapters?.length}/${playlistLengths[id]}`}</p>
                          )}
                        </div>
                      </div>
                      <IoMdShareAlt className="text-2xl hover:text-slaty transition duration-300 w-7 h-7" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      className="bg-lightSlaty text-slaty px-3 py-1 text-sm rounded shadow-md z-20"
                    >
                      Share
                      <Tooltip.Arrow className="fill-lightSlaty" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
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
              <div className="border-b border-lightSlaty h-[3rem] bg-mediumSlaty rounded-t-xl p-2 flex justify-between items-center">
                <div className="flex flex-col text-sm">
                  <div className="flex gap-2 font-semibold text-base text-slaty/90">
                    <p className="text-slaty">Progress -</p>
                    <div>
                      {typeof id === "string" && playlistLengths[id] && (
                        <p>{`${completedChapters?.length}/${playlistLengths[id]}`}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-[3rem] h-[2.5rem] rounded-lg flex flex-col gap-3 justify-center items-center">
                  <CircularProgressbar
                    value={precentage}
                    text={`${precentage}%`}
                    styles={buildStyles({
                      strokeLinecap: "butt",
                      textSize: "25px",
                      pathColor: "#1A56DB",
                      textColor: "#D1D5DB",
                      trailColor: "#d6d6d6",
                    })}
                    className="h-[3rem]"
                  />
                </div>
              </div>
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
