"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PlalistVideoCard from "../../../component/PlalistVideoCard";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { playlistType2, discussionType } from "@/types";
import { setIsOpen } from "../../../redux/slices/LoginModalSlice";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import {
  fetchDiscussionData,
  postDiscussionData,
} from "../../../utils/apiCalls";
import Image from "next/image";
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
  fetchChapterData,
  fetchPlayListVideos,
  funtionForVideoDetail,
} from "@/app/utils/apiCalls";
import LoginModal from "@/app/component/LoginModal";
import CourseLinkModal from "@/app/component/CourseLinkModal";

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
  const dispatch = useDispatch<AppDispatch>();

  const [discussionData, setDiscussionData] = useState<discussionType[]>([]);
  const [discussionContent, setDiscussionContent] = useState("");
  const [playlists, setPlaylists] = useState<playlistType2[]>([]);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [playlistLengths, setPlaylistLengths] = useState<
    Record<string, string>
  >({});
  const [precentage, setPrecentage] = useState<number>(0);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [commentStateUpdate, setCommentStateUpdate] = useState(false);

  useEffect(() => {
    const discussion = async () => {
      if (typeof id === "string" && typeof videoId === "string") {
        const result = await fetchDiscussionData({ id, videoId });
        setDiscussionData(result);
      }
    };
    if (videoId) {
      discussion();
    }
  }, [session.data?.user?.email, id, videoId, commentStateUpdate]);

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

  const DeteleDiscussion = async ({
    playlistId,
    videoId,
    name,
    content,
  }: {
    playlistId: string;
    videoId: string;
    name: string;
    content: string;
  }) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/discussion/delete`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playlistId,
          videoId,
          name,
          content,
        }),
        credentials: "include",
      }
    );
    const data = await res.json();
    console.log(data.deleteDiscussion);
    if (data.deleteDiscussion) {
      toast.success("comment is delete", {
        hideProgressBar: true,
      });
    }
    setCommentStateUpdate(!commentStateUpdate);
  };

  const discussionHandler = async () => {
    if (session.status === "authenticated") {
      await postDiscussionData({
        playlistId: id as string,
        videoId: videoId as string,
        content: discussionContent,
        username: session.data?.user?.name ?? "",
        userImageUrl: session.data?.user?.image ?? "",
      });
      setCommentStateUpdate(!commentStateUpdate);
      setDiscussionContent("");
    } else {
      dispatch(setIsOpen(true));
    }
  };

  const lines = videoDescription
    .split("\n")
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
                            `https://cape-lyart.vercel.app/course/${id}/${videoId}`
                          )
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
            <div>
              {discussionData ? (
                <div className="w-full h-full min-h-[50.4rem] border border-lightSlaty rounded-xl lg:flex lg:flex-col hidden">
                  <div className="w-full items-center text-center font-semibold py-4 justify-center bg-mediumSlaty rounded-t-xl">
                    Discussion
                  </div>
                  <div className="space-y-2 w-full h-full p-4 rounded overflow-y-auto">
                    {discussionData?.map((msg, i) => (
                      <div
                        className="flex gap-4"
                        key={i}
                        // className={msg.sender === "user" ? "text-right" : "text-left"}
                      >
                        <div className="flex w-[4rem] items-start h-[3rem] relative">
                          <Image
                            src={msg.image || "/code.jpg"}
                            alt="code"
                            quality={100}
                            sizes="80px"
                            fill
                            style={{ objectFit: "cover" }}
                            className="rounded-full"
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-white text-xs font-semibold">
                            {msg.name}
                          </p>
                          <p className="text-sm text-slaty">{msg.content}</p>
                        </div>
                        <div className="flex w-[3rem] items-center justify-center">
                          <Tooltip.Provider delayDuration={0}>
                            <Tooltip.Root>
                              <Tooltip.Trigger asChild>
                                <button
                                  onClick={() =>
                                    DeteleDiscussion({
                                      playlistId: id as string,
                                      videoId: videoId as string,
                                      name: msg.name,
                                      content: msg.content,
                                    })
                                  }
                                >
                                  <AiOutlineDelete className="text-xl hover:text-white transition duration-300" />
                                </button>
                              </Tooltip.Trigger>
                              <Tooltip.Portal>
                                <Tooltip.Content
                                  side="top"
                                  className="bg-lightSlaty text-white px-2 py-1 text-xs rounded shadow-md z-20"
                                >
                                  Delete
                                  <Tooltip.Arrow className="fill-lightSlaty" />
                                </Tooltip.Content>
                              </Tooltip.Portal>
                            </Tooltip.Root>
                          </Tooltip.Provider>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 p-4">
                    <input
                      value={discussionContent}
                      onChange={(e) => setDiscussionContent(e.target.value)}
                      className="flex-1 p-2 rounded-md bg-lightSlaty focus:outline-none border border-slaty/50 text-slaty placeholder-slaty/50"
                      placeholder="Type a message..."
                    />
                    <button
                      onClick={discussionHandler}
                      className="px-2 bg-blue-600 text-white rounded"
                    >
                      Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-[47.7rem] border border-lightSlaty rounded-xl lg:flex lg:flex-col hidden">
                  <div className="w-full items-center text-center font-semibold py-4 justify-center bg-mediumSlaty rounded-t-xl">
                    Discussion
                  </div>
                  <div className="w-full h-[40rem] flex items-center justify-center p-4">
                    <p className="text-slaty text-center">
                      No discussion available yet.
                    </p>
                  </div>
                  <div className="flex gap-2 p-4">
                    <input
                      value={discussionContent}
                      onChange={(e) => setDiscussionContent(e.target.value)}
                      className="flex-1 p-2 rounded-md bg-lightSlaty focus:outline-none border border-slaty/50 text-slaty placeholder-slaty/50"
                      placeholder="Type a message..."
                    />
                    <button
                      onClick={discussionHandler}
                      className="px-2 bg-blue-600 text-white rounded"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Course;
