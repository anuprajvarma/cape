"use client";

import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { chatType } from "@/types";
import {
  chatBotApiCall,
  easyExplainFuntion,
  GPTDataFetchToMongoDB,
  GPTDataPostToMongoDB,
} from "../utils/apiCalls";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setIsOpen } from "../redux/slices/LoginModalSlice";

const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
});

interface QuizzType {
  question: string;
  options: string[];
  answer: string;
}

const NotesGpt = ({
  id,
  videoTitle,
}: {
  id: string;
  videoId: string;
  videoTitle: string;
}) => {
  const session = useSession();
  const dispatch = useDispatch<AppDispatch>();
  // const [fetchData, setFetchData] = useState(true);
  const [chats, setChats] = useState<chatType[]>([]);
  const [quizzcheck, setQuizzCheck] = useState<boolean>(false);
  const [quizz, setQuizz] = useState<QuizzType[]>([]);
  const [notecheck, setNoteCheck] = useState<boolean>(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [gptcheck, setgptCheck] = useState<boolean>(false);

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
    if (session.status === "authenticated") {
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
      setInput("");
    } else {
      dispatch(setIsOpen(true));
    }
  };

  const quizzHandler = async () => {
    try {
      const result = await easyExplainFuntion({ videoTitle });
      setQuizz(result);
    } catch (error) {
      console.error("Error fetching from OpenRouter or saving to DB:", error);
    }
  };

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
          Quizzes
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
        {quizzcheck ? (
          quizz.length > 0 ? (
            <div className="sm:px-12 sm:py-2 w-full h-full overflow-auto prose prose-lg prose-headings:my-0 prose-p:my-0 prose-li:my-0 prose-hr:my-6 prose-a:text-blue-600 hover:prose-a:underline max-w-none">
              <div className="wfull flex justify-end">
                <p className="text-white text-center bg-lightSlaty rounded-lg w-[10rem] px-2 py-1">{`Completed - 1/${quizz.length}`}</p>
              </div>
              {quizz.map((quizz, index) => (
                <div key={index} className="py-2 flex flex-col gap-2">
                  <div className="text-white flex gap-2 font-semibold text-xl">
                    <p>{quizz.question}</p>
                  </div>
                  <div>
                    {/* {quizz.options.length} */}
                    <div className="list-disc pl-6">
                      {quizz.options.map((option, idx) => (
                        <p key={idx} className="text-slaty">
                          {option}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center gap-4">
              <p className="sm:px-12 py-2 rounded-full border border-lightSlaty">
                Test your knowledge with quizzes based on the video content.
              </p>
              <button
                className="px-4 py-1 rounded-lg hover:bg-slaty/10 transition duration-200 border border-lightSlaty"
                onClick={quizzHandler}
              >
                Click me
              </button>
            </div>
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default NotesGpt;
