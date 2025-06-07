"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PlalistVideoCard from "../../../component/PlalistVideoCard";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { playlistType2 } from "@/types";
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
  fetchChapterData,
  fetchPlayListVideos,
  funtionForVideoDetail,
} from "@/app/utils/apiCalls";

const options = {
  target: "_blank",
  rel: "noopener noreferrer",
  className: () => "text-blue-600 underline prose",
};

const YOUTUBE_API_KEY = [
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_1,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_2,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_3,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_4,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_5,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_6,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_7,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_8,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_9,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_10,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_11,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_12,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_13,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_14,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_15,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_16,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_17,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_18,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_19,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_20,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_21,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_22,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_23,
];

function getRotatedKey(): string {
  const now = new Date();
  const hour = now.getUTCHours(); // use UTC for consistency
  const index = hour % YOUTUBE_API_KEY.length;
  return YOUTUBE_API_KEY[index]!;
}

const apikey = getRotatedKey();

const Course = () => {
  const session = useSession();
  const params = useParams();
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
    async function playlist() {
      if (typeof videoId === "string") {
        const result = await funtionForVideoDetail({ videoId });
        if (result) {
          setVideoTitle(result[0].snippet.title);
          setVideoDescription(result[0]?.snippet.description);
        }
      }
    }
    if (videoId) {
      playlist();
    }
  }, [videoId]);

  const actualId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const getChapterData = async () => {
      if (typeof id === "string") {
        const result = await fetchChapterData({
          email: session.data?.user?.email ?? "",
          playlistId: id,
        });
        if (result) {
          setCompletedChapters(result);
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
    async function playlist() {
      if (typeof id === "string") {
        const result = await fetchPlayListVideos({ id });
        setPlaylists(result);
      }
    }
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
              `https://www.googleapis.com/youtube/v3/playlists?part=contentDetails&id=${id}&key=${apikey}`
            );

            const data = await lenthRes.json();
            if (data.items[0]) {
              newLengths[id] = data.items[0]?.contentDetails?.itemCount || 0;
            }
          }
        })
      );

      setPlaylistLengths(newLengths);
    };

    if (playlists?.length > 0) {
      fetchLengths();
    }
  }, [playlists]);

  const lines = videoDescription
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return (
    <div className="w-full -z-20 py-4 px-1 sm:px-4 flex flex-col gap-2 justify-center text-slaty">
      <div className="w-full flex justify-between gap-2">
        <div className="w-[63rem] flex flex-col gap-4">
          <div className="flex w-full h-[20rem] items-center justify-center sm:h-[38rem]">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              className="rounded-lg w-full h-full"
              allowFullScreen
              allow="autoplay; encrypted-media"
              title="YouTube video player"
            />
          </div>
          <div className="flex lg:hidden justify-between">
            <p className="font-semibold text-white line-clamp-1">
              {videoTitle}
            </p>
            <div className="flex gap-2 font-medium text-slaty/80">
              <p className="text-slaty sm:flex hidden">Progress -</p>
              <div>
                {typeof id === "string" && playlistLengths[id] && (
                  <p>{`${completedChapters?.length}/${playlistLengths[id]}`}</p>
                )}
              </div>
            </div>
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
                    />
                  );
                })}
              </div>
            </DisclosurePanel>
          </Disclosure>
          <Disclosure as="div" className="" defaultOpen={false}>
            <DisclosureButton className="group flex w-full bg-mediumSlaty p-1 sm:p-2 rounded-lg items-center text-md border border-lightSlaty justify-between">
              <span>Description</span>
              <ChevronDownIcon className="size-5 fill-slaty group-data-hover:fill-white/50 group-data-open:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel className="mt-2 text-sm/5 text-slaty">
              {lines.map((line, idx) => (
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
        <div className="w-[25rem] h-[665px] border border-lightSlaty rounded-xl hidden lg:flex flex-col">
          <div className="border-b border-lightSlaty h-[4rem] bg-mediumSlaty rounded-t-xl p-2 flex justify-between">
            <div className="flex flex-col text-sm">
              <p className="font-semibold text-white line-clamp-1">
                {videoTitle}
              </p>
              <div className="flex gap-2 font-medium text-slaty/90">
                <p className="text-slaty">Progress -</p>
                <div>
                  {typeof id === "string" && playlistLengths[id] && (
                    <p>{`${completedChapters?.length}/${playlistLengths[id]}`}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="w-[3rem] h-[3rem] rounded-lg flex flex-col gap-3 justify-center items-center">
              <CircularProgressbar
                value={precentage}
                text={`${precentage}%`}
                styles={buildStyles({
                  strokeLinecap: "butt",
                  textSize: "20px",
                  pathColor: "#1A56DB",
                  textColor: "#D1D5DB",
                  trailColor: "#d6d6d6",
                })}
                className="h-[6rem]"
              />
            </div>
          </div>
          <div className="py-2 h-[586px] flex flex-col gap-4 rounded-xl overflow-y-auto">
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
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
