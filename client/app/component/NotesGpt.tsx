"use client";

import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { chatType, discussionType } from "@/types";
import {
  chatBotApiCall,
  easyExplainFuntion,
  fetchDiscussionData,
  GPTDataFetchToMongoDB,
  GPTDataPostToMongoDB,
  postDiscussionData,
} from "../utils/apiCalls";

const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
});

const NotesGpt = ({
  id,
  videoId,
  videoTitle,
}: {
  id: string;
  videoId: string;
  videoTitle: string;
}) => {
  const session = useSession();

  const [discussionData, setDiscussionData] = useState<discussionType[]>([]);
  const [chats, setChats] = useState<chatType[]>([]);
  const [easyExplaincheck, seteasyExplainCheck] = useState<boolean>(false);
  const [discussion, setDiscussion] = useState<boolean>(false);
  const [easyExplain, setEasyExplain] = useState("");
  const [notecheck, setNoteCheck] = useState<boolean>(true);
  const [input, setInput] = useState("");
  const [discussionContent, setDiscussionContent] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [gptcheck, setgptCheck] = useState<boolean>(false);

  useEffect(() => {
    const discussion = async () => {
      const result = await fetchDiscussionData({ id, videoId });
      setDiscussionData(result);
    };
    if (videoId) {
      discussion();
    }
  }, [gptcheck, session.data?.user?.email, id, videoId]);

  useEffect(() => {
    const chat = async () => {
      const result = await GPTDataFetchToMongoDB({
        email: session.data?.user?.email ?? "",
        playlistId: id,
      });
      setChats(result);
    };

    chat();
  }, [gptcheck, messages, session.data?.user?.email, id]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const result = await chatBotApiCall({ input });

      const botResponse = result?.content;
      const botRole = result?.role;

      if (botResponse) {
        const botMessage = {
          sender: botRole,
          text: botResponse,
        };
        setMessages((prev) => [...prev, botMessage]);

        // ✅ Only send to backend if input and botResponse are present
        if (input.trim() && botResponse.trim()) {
          await GPTDataPostToMongoDB({
            email: session.data?.user?.email ?? "",
            playlistId: id,
            question: input,
            answer: result.content,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching from OpenRouter or saving to DB:", error);
    }

    setInput(""); // clear input at end
  };

  const discussionHandler = async () => {
    await postDiscussionData({
      playlistId: id,
      videoId,
      content: discussionContent,
      username: session.data?.user?.name ?? "",
      userImageUrl: session.data?.user?.image ?? "",
    });
  };

  const easyExplainHandler = async () => {
    try {
      const result = await easyExplainFuntion({ videoTitle });
      const botResponse = result;
      setEasyExplain(botResponse);
    } catch (error) {
      console.error("Error fetching from OpenRouter or saving to DB:", error);
    }
  };

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
  return (
    <div className="border rounded-lg border-lightSlaty">
      {" "}
      <div className="flex justify-between bg-mediumSlaty border-b border-lightSlaty px-2 py-4">
        <button
          onClick={handleNotes}
          className="sm:px-4 sm:py-1 p-1 rounded-md bg-lightSlaty hover:bg-slaty/20 hover:text-slaty text-slaty/80 transition duration-300 border border-lightSlaty"
        >
          Notes
        </button>
        <button
          onClick={handleGPT}
          className="sm:px-4 sm:py-1 p-1 rounded-md bg-lightSlaty hover:bg-slaty/20 hover:text-slaty text-slaty/80 transition duration-300 border border-lightSlaty"
        >
          GPT
        </button>
        <button
          onClick={handleEasyExplain}
          className="sm:px-4 sm:py-1 p-1 rounded-md bg-lightSlaty hover:bg-slaty/20 hover:text-slaty text-slaty/80 transition duration-300 border-lightSlaty"
        >
          Easy Explain
        </button>
        <button
          onClick={handleDiscussion}
          className="sm:px-4 sm:py-1 p-1 rounded-md bg-lightSlaty hover:bg-slaty/20 hover:text-slaty text-slaty/80 transition duration-300 border border-lightSlaty sm:flex hidden"
        >
          Discussion
        </button>
      </div>
      <div className="w-full h-[40rem] bg-mediumSlaty">
        {notecheck ? (
          <Editor
            email={session.data?.user?.email as string}
            playlistId={id as string}
          />
        ) : (
          <></>
        )}
        {gptcheck ? (
          <div className="w-full h-full">
            <div className="space-y-2 w-full h-[36rem] p-1 sm:p-12 rounded overflow-y-auto">
              {chats?.map((msg, i) => (
                <div key={i}>
                  <div className="flex w-full justify-end text-xl text-white py-2 sm:py-4">
                    <p className="border border-lightSlaty px-6 py-2 rounded-3xl">
                      {msg.question}
                    </p>
                  </div>
                  <div className="prose prose-slate prose-lg w-full h-full overflow-auto max-w-none p-2 sm:p-12 prose-headings:my-2 prose-p:my-0 prose-li:my-0 prose-hr:my-6 prose-ul:my-0 hover:prose-a:underline">
                    <ReactMarkdown>{msg.answer}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
            <div className="py-4 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 rounded-md bg-lightSlaty focus:outline-none border border-slaty/50 text-slaty placeholder-slaty/50"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-lightBlue hover:bg-lightBlue/80 text-white rounded"
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
            <div className="sm:p-12 w-full h-full overflow-auto prose prose-lg prose-headings:my-0 prose-p:my-0 prose-li:my-0 prose-hr:my-6 prose-a:text-blue-600 hover:prose-a:underline max-w-none">
              <ReactMarkdown>{easyExplain}</ReactMarkdown>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center gap-4">
              <p className="sm:px-12 py-2 rounded-full border border-lightSlaty">
                want explaination like 5 year old boy 😁
              </p>
              <button
                className="px-4 py-1 rounded-lg hover:bg-slaty/10 transition duration-200 border border-lightSlaty"
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
            <div className="space-y-2 w-full h-[36rem] p-4 rounded overflow-y-auto">
              {discussionData?.map((msg, i) => (
                <div
                  className="flex gap-4"
                  key={i}
                  // className={msg.sender === "user" ? "text-right" : "text-left"}
                >
                  <div className="flex w-[3rem] items-start h-[3rem] relative">
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
                  <div className="flex flex-col">
                    <p className="text-white text-xs font-semibold">
                      {msg.name}
                    </p>
                    <p className="text-sm text-slaty">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={discussionContent}
                onChange={(e) => setDiscussionContent(e.target.value)}
                className="flex-1 p-2 rounded-md bg-lightSlaty focus:outline-none border border-slaty/50 text-slaty placeholder-slaty/50"
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

export default NotesGpt;
