"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import { NotesGptPropType } from "@/types";
import { ChatbotSection } from "./ChatbotSection";
import { QuizzSection } from "./QuizzSection";
import { useSessionsDetails } from "../hooks/sesionAndRouterDetail";
import { useNotesGpt } from "../hooks/notesGpt";

const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
});

const NotesGpt = ({ id, videoId, videoTitle }: NotesGptPropType) => {
  const { session } = useSessionsDetails();
  const [Completed, setCompleted] = useState<number>(0);
  const [countedScore, setCountedScore] = useState<number>(0);
  const {
    handleNotes,
    notecheck,
    handleGPT,
    gptcheck,
    handleEasyExplain,
    quizzcheck,
  } = useNotesGpt({ id, videoId, countedScore, Completed });

  return (
    <div className="rounded-3xl w-[35rem]">
      {" "}
      <div className="flex justify-between bg-mediumSlaty border border-brand-slate-1/20 rounded-t-xl px-2 py-4 w-full">
        <button
          onClick={handleNotes}
          className={`sm:px-4 sm:py-1 p-1 rounded-md  hover:bg-slaty/20 hover:text-white transition duration-300 border border-brand-slate-1/20 ${
            notecheck ? "bg-slaty/20 text-white" : "text-slaty/80 bg-lightSlaty"
          }`}
        >
          Notes
        </button>
        <button
          onClick={handleGPT}
          className={`sm:px-4 sm:py-1 p-1 rounded-md  hover:bg-slaty/20 hover:text-white transition duration-300 border border-brand-slate-1/20 ${
            gptcheck ? "bg-slaty/20 text-white" : "text-slaty/80 bg-lightSlaty"
          }`}
        >
          GPT
        </button>
        <button
          onClick={handleEasyExplain}
          className={`sm:px-4 sm:py-1 p-1 rounded-md  hover:bg-slaty/20 hover:text-white transition duration-300 border border-brand-slate-1/20 ${
            quizzcheck
              ? "bg-slaty/20 text-white"
              : "text-slaty/80 bg-lightSlaty"
          }`}
        >
          Quizzes
        </button>
      </div>
      <div className="w-full">
        {notecheck && (
          <Editor
            email={session.data?.user?.email as string}
            playlistId={id as string}
          />
        )}
        {gptcheck && <ChatbotSection id={id} />}
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
