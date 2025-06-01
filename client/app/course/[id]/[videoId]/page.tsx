"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { MdOutlineArrowBack } from "react-icons/md";
import PlalistVideoCard from "../../../component/PlalistVideoCard";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { playlistType2 } from "@/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Linkify from "linkify-react";

const options = {
  target: "_blank",
  rel: "noopener noreferrer",
  className: () => "text-blue-600 underline",
};

interface chatType {
  question: string;
  answer: string;
}

interface discussionType {
  name: string;
  image: string;
  content: string;
}

const Course = () => {
  const session = useSession();
  const params = useParams();
  const { id, videoId } = params;
  const router = useRouter();

  const [content, setContent] = useState("");
  const [discussionData, setDiscussionData] = useState<discussionType[]>([]);

  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [discussionContent, setDiscussionContent] = useState("");
  const [chats, setChats] = useState<chatType[]>([]);
  const [playlists, setPlaylists] = useState<playlistType2[]>([]);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [playlistLengths, setPlaylistLengths] = useState<
    Record<string, string>
  >({});
  const [checkBoxTrack, setCheckBoxTrack] = useState<boolean>(false);
  const [precentage, setPrecentage] = useState<number>(0);
  const [notecheck, setNoteCheck] = useState<boolean>(true);
  const [gptcheck, setgptCheck] = useState<boolean>(false);
  const [easyExplaincheck, seteasyExplainCheck] = useState<boolean>(false);
  const [discussion, setDiscussion] = useState<boolean>(false);
  const [checkChangeNote, setCheckChangeNote] = useState(true);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [easyExplain, setEasyExplain] = useState("");

  useEffect(() => {
    async function playlist() {
      console.log(`videoId ${videoId}`);
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      );
      const data = await res.json();
      setVideoTitle(data.items[0].snippet.title);
      setVideoDescription(data.items[0].snippet.description);
      console.log(`video detail ${data.items[0]}`);
    }
    playlist();
  }, [videoId]);

  useEffect(() => {
    const chat = async () => {
      const res = await fetch("http://localhost:5002/api/notes/getNote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.data?.user?.email,
          playlistId: id,
          videoId,
        }),
        credentials: "include",
      });
      const data = await res.json();
      setContent(data.noteData.content);
    };

    if (videoId) {
      chat();
    }
  }, [gptcheck, session.data?.user?.email, id, videoId, checkChangeNote]);

  useEffect(() => {
    const discussion = async () => {
      const res = await fetch("http://localhost:5002/api/discussion/getData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playlistId: id,
          videoId,
        }),
        credentials: "include",
      });
      const data = await res.json();
      setDiscussionData(data.discussionData.discussions);
      console.log(discussionData);
    };

    if (videoId) {
      discussion();
    }
  }, [gptcheck, session.data?.user?.email, id, videoId]);

  const discussionHandler = async () => {
    const res = await fetch("http://localhost:5002/api/discussion/postData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playlistId: id,
        videoId,
        content: discussionContent,
        username: session.data?.user?.name,
        userImageUrl: session.data?.user?.image,
      }),
      credentials: "include",
    });
    const data = await res.json();
    setContent(data.note.content);
  };

  const saveNote = async () => {
    setCheckChangeNote(!checkChangeNote);
    const res = await fetch("http://localhost:5002/api/notes/addNote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.data?.user?.email,
        playlistId: id,
        content,
      }),
      credentials: "include",
    });
    const data = await res.json();
    setContent(data.note.content);
  };

  useEffect(() => {
    const chat = async () => {
      const res = await fetch("http://localhost:5002/api/chat/getData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.data?.user?.email,
          playlistId: id,
        }),
        credentials: "include",
      });
      const data = await res.json();
      setChats(data.chatData.chats);
    };

    chat();
  }, [gptcheck, messages, session.data?.user?.email, id]);

  const easyExplainHandler = async () => {
    console.log("easyExplain");
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: [
            {
              role: "user",
              content: `explain ${videoTitle} like 5-year-old child`,
            },
          ],
        }),
      });

      const data = await res.json();

      const botResponse = data?.choices?.[0]?.message?.content;
      setEasyExplain(botResponse);
    } catch (error) {
      console.error("Error fetching from OpenRouter or saving to DB:", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: [
            {
              role: "user",
              content: input,
            },
          ],
        }),
      });

      const data = await res.json();

      const botResponse = data?.choices?.[0]?.message?.content;
      const botRole = data?.choices?.[0]?.message?.role;

      if (botResponse) {
        const botMessage = {
          sender: botRole,
          text: botResponse,
        };
        setMessages((prev) => [...prev, botMessage]);

        // ✅ Only send to backend if input and botResponse are present
        if (input.trim() && botResponse.trim()) {
          await fetch("http://localhost:5002/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session.data?.user?.email,
              playlistId: id,
              question: input,
              answer: data.choices[0].message.content,
            }),
            credentials: "include",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching from OpenRouter or saving to DB:", error);
    }

    setInput(""); // clear input at end
  };

  const actualId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
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

  const handleNotes = () => {
    setNoteCheck(true);
    setgptCheck(false);
    seteasyExplainCheck(false);
    setDiscussion(false);
  };

  const handleGPT = () => {
    setNoteCheck(false);
    setgptCheck(true);
    seteasyExplainCheck(false);
    setDiscussion(false);
  };

  const handleEasyExplain = () => {
    setNoteCheck(false);
    setgptCheck(false);
    seteasyExplainCheck(true);
    setDiscussion(false);
  };

  const handleDiscussion = () => {
    setDiscussion(true);
    setNoteCheck(false);
    setgptCheck(false);
    seteasyExplainCheck(false);
  };

  const lines = videoDescription
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return (
    <div className="w-full -z-20 p-4 border-t border-slaty flex flex-col gap-2 justify-center text-slaty">
      <div className="w-full flex justify-between gap-2">
        <div className="w-[63rem] flex flex-col gap-4">
          <div className="flex gap-2 text-xl">
            <button onClick={() => router.back()}>
              <MdOutlineArrowBack className="text-2xl font-semibold" />
            </button>
            <p className="text-lg font-semibold">{videoTitle}</p>
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
          <Disclosure as="div" className="" defaultOpen={false}>
            <DisclosureButton className="group flex w-full items-center justify-between">
              <span className="text-sm">Description</span>
              <ChevronDownIcon className="size-5 fill-slaty group-data-hover:fill-white/50 group-data-open:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel className="mt-2 text-sm/5 text-slaty">
              {lines.map((line, idx) => (
                <p key={idx}>
                  <Linkify options={options}>{line}.</Linkify>
                </p>
              ))}

              {/* <Linkify options={options}>{videoDescription}</Linkify> */}
            </DisclosurePanel>
          </Disclosure>
          <div className="flex justify-between">
            <button
              onClick={handleNotes}
              className="px-4 py-1 rounded-md border border-slaty text-darkRed"
            >
              Notes
            </button>
            <button
              onClick={handleGPT}
              className="px-4 py-1 rounded-md border border-slaty"
            >
              GPT
            </button>
            <button
              onClick={handleEasyExplain}
              className="px-4 py-1 rounded-md border border-slaty "
            >
              Easy Explain
            </button>
            <button
              onClick={handleDiscussion}
              className="px-4 py-1 rounded-md border border-slaty "
            >
              Discussion
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
      <div className="w-full h-[40rem] border border-slaty rounded-lg">
        {notecheck ? (
          <div className="p-4">
            <textarea
              className="outline-none rounded-lg bg-lightYellow w-full h-[35rem]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="w-full text-left flex justify-end">
              <button
                className="px-2 py-1 border border-slaty rounded-lg"
                onClick={saveNote}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
        {gptcheck ? (
          <div className="w-full h-full">
            <div className="space-y-2 w-full h-[40rem] border p-12 rounded overflow-y-auto">
              {chats.map((msg, i) => (
                <div
                  key={i}
                  // className={msg.sender === "user" ? "text-right" : "text-left"}
                >
                  <div className="flex w-full justify-end text-xl font-semibold py-4">
                    <p className="border border-slaty px-6 py-2 rounded-md">
                      {msg.question}
                    </p>
                  </div>
                  <ReactMarkdown>{msg.answer}</ReactMarkdown>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
        {easyExplaincheck ? (
          easyExplain ? (
            <div className="p-12 w-full h-full overflow-auto">
              <ReactMarkdown>{easyExplain}</ReactMarkdown>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center gap-2">
              <p className="p-2 rounded-lg border border-slaty">
                want explaination like 5 year old boy 😁
              </p>
              <button
                className="px-4 py-1 rounded-lg hover:bg-slaty/10 transition duration-200 border border-slaty"
                onClick={easyExplainHandler}
              >
                Yes
              </button>
            </div>
          )
        ) : (
          <></>
        )}
        {discussion ? (
          <div className="w-full h-full">
            <div className="space-y-2 w-full h-[40rem] border p-4 rounded overflow-y-auto">
              {discussionData.map((msg, i) => (
                <div
                  className="flex gap-4"
                  key={i}
                  // className={msg.sender === "user" ? "text-right" : "text-left"}
                >
                  <div className="flex w-[3rem] items-start h-[3rem] relative">
                    <Image
                      src={msg.image}
                      alt="code"
                      quality={100}
                      sizes="80px"
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-slaty text-xs font-semibold">
                      {msg.name}
                    </p>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={discussionContent}
                onChange={(e) => setDiscussionContent(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Type a message..."
              />
              <button
                onClick={discussionHandler}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Course;
