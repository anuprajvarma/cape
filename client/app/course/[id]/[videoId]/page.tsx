"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { MdOutlineArrowBack } from "react-icons/md";
import PlalistVideoCard from "../../../component/PlalistVideoCard";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { playlistType2 } from "@/types";
import { useSession } from "next-auth/react";

const Course = () => {
  const session = useSession();
  const params = useParams();
  const { id, videoId } = params;
  const router = useRouter();

  // console.log(`id ${id} videoid ${videoId}`);

  const [playlists, setPlaylists] = useState<playlistType2[]>([]);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [playlistLengths, setPlaylistLengths] = useState<
    Record<string, string>
  >({});
  const [checkBoxTrack, setCheckBoxTrack] = useState<boolean>(false);
  const [precentage, setPrecentage] = useState<number>(0);

  // Number(completedChapters.length), Number(playlistLengths[id].length);

  const actualId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    // console.log(
    //   typeof id === "string" &&
    //     playlistLengths[id] &&
    //     (Number(completedChapters.length), Number(playlistLengths[id].length))
    // );
    if (actualId && playlistLengths[actualId]) {
      const percentage =
        (100 * completedChapters.length) / Number(playlistLengths[actualId]);
      setPrecentage(Math.round(percentage));
    }
    console.log(precentage);
    const getChapterData = async () => {
      const res = await fetch(
        "http://localhost:5002/api/enrolledCourse/getChapterData",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.data?.user?.email,
            playlistId: id,
          }),
          credentials: "include",
        }
      );
      const data = await res.json();
      setCompletedChapters(data.getChapterData.chapters);
      // console.log(`getChapterData ${data.getChapterData.chapters}`);
    };
    getChapterData();
  }, [session.data?.user, id, checkBoxTrack]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    async function playlist() {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${id}&maxResults=200&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      );
      const data = await res.json();
      setPlaylists(data.items);
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
              `https://www.googleapis.com/youtube/v3/playlists?part=contentDetails&id=${id}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
            );

            const data = await lenthRes.json();
            newLengths[id] = data.items[0]?.contentDetails?.itemCount || 0;
          }
        })
      );

      setPlaylistLengths(newLengths);
    };

    if (playlists?.length > 0) {
      fetchLengths();
    }
  }, [playlists]);

  return (
    <div className="w-full -z-20 p-4 border-t border-slaty flex flex-col gap-2 justify-center text-slaty">
      <div className="w-full flex justify-between gap-2">
        <div className="w-[63rem] flex flex-col gap-4">
          <div className="flex gap-2 text-xl">
            <button onClick={() => router.back()}>
              <MdOutlineArrowBack />
            </button>
            <p>{session.data?.user?.email}</p>
          </div>
          <div className="flex w-full h-[38rem]">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              className="rounded-lg w-full"
              allow="autoplay; encrypted-media"
              title="YouTube video player"
            />
          </div>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <input type="checkbox" />
              <p>Mark lesson complete</p>
            </div>
            <div className="flex gap-2">
              <button>
                <MdOutlineArrowBack />
              </button>
              <button>
                <MdOutlineArrowBack className="rotate-180" />
              </button>
            </div>
          </div>
          <div className="flex justify-between">
            <button className="px-4 py-1 rounded-md border border-slaty text-darkRed">
              Notes
            </button>
            <button className="px-4 py-1 rounded-md border border-slaty">
              GPT
            </button>
            <button className="px-4 py-1 rounded-md border border-slaty ">
              Easy Explain
            </button>
          </div>
        </div>
        <div className="w-[25rem] h-[656px] border border-slaty rounded-xl flex flex-col">
          <div className="border-b h-[4rem] border-slaty p-2 flex justify-between">
            <div>
              <p className="font-semibold">React js Tutorial in Hindi</p>
              <div className="flex justify-between text-sm items-center">
                <div className="flex gap-1">
                  <p className="text-xs ">Completed</p>
                  <p className="text-xs">
                    {typeof id === "string" && playlistLengths[id] && (
                      <p>{`${completedChapters.length}/${playlistLengths[id]}`}</p>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-[3rem] h-[3rem] rounded-lg flex flex-col gap-3 justify-center items-center">
              <CircularProgressbar
                value={precentage}
                text={`${precentage}%`}
                styles={buildStyles({
                  strokeLinecap: "butt",
                  textSize: "30px",
                  pathColor: "#BF2F1F",
                  textColor: "#4A4844",
                  trailColor: "#d6d6d6",
                })}
                className=""
              />
            </div>
          </div>
          <div className="py-2 h-[586px] flex flex-col gap-4 rounded-xl overflow-y-auto">
            {playlists?.map((data, index) => {
              const id = data.snippet?.playlistId;
              const videoID = data.snippet?.resourceId.videoId;
              const isChecked = completedChapters.includes(videoID);
              if (!hasMounted) return null;
              return (
                <PlalistVideoCard
                  title={data.snippet?.title}
                  channelTitle={data.snippet?.channelTitle}
                  thumbnails={data.snippet?.thumbnails.high.url}
                  //   lenth={length}
                  id={id}
                  setCheckBoxTrack={setCheckBoxTrack}
                  checkBoxTrack={checkBoxTrack}
                  isChecked={isChecked}
                  videoId={videoID}
                  //   channelThumb={channelThumb}
                  key={index}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="w-full h-[80rem] border border-slaty rounded-lg"></div>
    </div>
  );
};

export default Course;
