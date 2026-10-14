"use client";

import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { chatType, NotesGptPropType } from "@/types";
import {
  fetchMultipleTypeData,
  saveUserQiuzzScore,
} from "../utils/backendApiCalls";
import { ChatbotSection } from "./ChatbotSection";
import { QuizzSection } from "./QuizzSection";

const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
});

const NotesGpt = ({ id, videoId, videoTitle }: NotesGptPropType) => {
  const session = useSession();
  const [temporaryChatData, setTemporaryChatData] = useState<chatType[]>([]);
  const [quizzcheck, setQuizzCheck] = useState<boolean>(false);
  const [notecheck, setNoteCheck] = useState<boolean>(true);
  const [gptcheck, setgptCheck] = useState<boolean>(false);
  const [Completed, setCompleted] = useState<number>(0);
  const [countedScore, setCountedScore] = useState<number>(0);

  useEffect(() => {
    const chat = async () => {
      const result = await fetchMultipleTypeData({
        email: session.data?.user?.email ?? "",
        playlistId: id,
        url: "/chat/getData",
      });
      setTemporaryChatData(result.chatData?.chats);
    };

    chat();
  }, [id, session.data?.user?.email]);

  useEffect(() => {
    const addScore = async () => {
      saveUserQiuzzScore({
        id,
        videoId,
        score: countedScore,
        email: session.data?.user?.email || "",
      });
    };

    if (Completed === 10) {
      addScore();
    }
  }, [Completed, id, videoId, session.data?.user?.email, countedScore]);

  const handleNotes = () => {
    setNoteCheck(true);
    setgptCheck(false);
    setQuizzCheck(false);
  };

  const handleGPT = () => {
    setNoteCheck(false);
    setgptCheck(true);
    setQuizzCheck(false);
  };

  const handleEasyExplain = () => {
    setNoteCheck(false);
    setgptCheck(false);
    setQuizzCheck(true);
  };
  return (
    <div className="border rounded-lg border-lightSlaty">
      {" "}
      <div className="flex justify-between bg-mediumSlaty border-b border-lightSlaty px-2 py-4">
        <button
          onClick={handleNotes}
          className={`sm:px-4 sm:py-1 p-1 rounded-md  hover:bg-slaty/20 hover:text-white transition duration-300 border border-lightSlaty ${
            notecheck ? "bg-slaty/20 text-white" : "text-slaty/80 bg-lightSlaty"
          }`}
        >
          Notes
        </button>
        <button
          onClick={handleGPT}
          className={`sm:px-4 sm:py-1 p-1 rounded-md  hover:bg-slaty/20 hover:text-white transition duration-300 border border-lightSlaty ${
            gptcheck ? "bg-slaty/20 text-white" : "text-slaty/80 bg-lightSlaty"
          }`}
        >
          GPT
        </button>
        <button
          onClick={handleEasyExplain}
          className={`sm:px-4 sm:py-1 p-1 rounded-md  hover:bg-slaty/20 hover:text-white transition duration-300 border border-lightSlaty ${
            quizzcheck
              ? "bg-slaty/20 text-white"
              : "text-slaty/80 bg-lightSlaty"
          }`}
        >
          Quizzes
        </button>
      </div>
      <div className="w-full h-[40rem]">
        {notecheck && (
          <Editor
            email={session.data?.user?.email as string}
            playlistId={id as string}
          />
        )}
        {gptcheck && (
          <ChatbotSection
            id={id}
            temporaryChatData={temporaryChatData}
            setTemporaryChatData={setTemporaryChatData}
          />
        )}
        <QuizzSection
          videoTitle={videoTitle}
          id={id}
          videoId={videoId}
          Completed={Completed}
          quizzcheck={quizzcheck}
          countedScore={countedScore}
          setCompleted={setCompleted}
          setCountedScore={setCountedScore}
        />
      </div>
    </div>
  );
};

export default NotesGpt;
