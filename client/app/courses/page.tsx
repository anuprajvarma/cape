"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef } from "react";
import { Mic } from "lucide-react";
import { motion } from "framer-motion";
import { GrMicrophone } from "react-icons/gr";
import { IoSearch } from "react-icons/io5";
import * as Tooltip from "@radix-ui/react-tooltip";
import { fetchPlaylist } from "../utils/apiCalls";
import LoginModal from "../component/LoginModal";
import CourseLinkModal from "../component/CourseLinkModal";
import { playlistType } from "@/types";
import useClickOutside from "../utils/outsideClick";

const CourseCard = dynamic(() => import("../component/CourseCard"), {
  ssr: false,
});

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

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

const Courses = () => {
  const [playlists, setPopularPlaylist] = useState<playlistType[]>([]);
  const [playlistLengths, setPlaylistLengths] = useState<
    Record<string, string>
  >({});
  const [channelThumbnail, setChannelThumbnail] = useState<
    Record<string, string>
  >({});
  const [hasMounted, setHasMounted] = useState(false);
  const [checkDataExist, setCheckDataExist] = useState<boolean>(false);
  const [suggestionsArray, setSuggestionsArray] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [getDataCheck, setGetDataCheck] = useState<boolean>(false);
  const inputRef = useClickOutside<HTMLInputElement>(() => {
    setShowSuggestions(false);
  });

  const [topic, setTopic] = useState("");

  useEffect(() => {
    const handleSearchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/searchs/getData`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );
        const data = await res.json();
        // console.log(`data.search ${data.searchData[0].title}`);
        setSuggestionsArray(data.searchData[0].title);
      } catch (error) {
        console.log(error);
      }
    };
    console.log("backend ur " + process.env.NEXT_PUBLIC_BACKEND_BASE_URL);
    handleSearchData();
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    async function load() {
      const max = "50";
      if (apikey) {
        setPopularPlaylist([]);
        const result = await fetchPlaylist({ max, topic, apikey });
        setPopularPlaylist(result);
        if (result.length > 0) {
          setCheckDataExist(false);
        } else {
          setCheckDataExist(true);
        }
      }
    }
    load();
  }, [topic]);

  useEffect(() => {
    const fetchLengths = async () => {
      const newLengths: Record<string, string> = {};
      await Promise.all(
        playlists.map(async (item) => {
          const id = item.id?.playlistId;
          if (id) {
            const lenthRes = await fetch(
              `https://www.googleapis.com/youtube/v3/playlists?part=contentDetails&id=${id}&key=${apikey}`,
            );

            const data = await lenthRes.json();
            newLengths[id] = data.items[0]?.contentDetails?.itemCount || 0;
          }
        }),
      );

      setPlaylistLengths(newLengths);
    };

    if (playlists?.length > 0) {
      fetchLengths();
    }
  }, [playlists]);

  useEffect(() => {
    const fetchLengths = async () => {
      const newThumbnail: Record<string, string> = {};
      await Promise.all(
        playlists.map(async (item) => {
          const channelId = item.snippet?.channelId;

          if (channelId) {
            // console.log(`channelid ${channelId}`);
            const ownerThumbnailRes = await fetch(
              `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apikey}`,
            );

            const thumbnailData = await ownerThumbnailRes.json();
            newThumbnail[channelId] =
              thumbnailData.items[0]?.snippet.thumbnails.high.url;
          }
        }),
      );
      setChannelThumbnail(newThumbnail);
    };

    if (playlists?.length > 0) {
      fetchLengths();
    }
  }, [playlists]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        setShowSuggestions(false);
        myFunction();
      }

      if (event.key === "Escape") {
        console.log("Escape key pressed!");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 0) {
      const filtered = suggestionsArray.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(false);
  };

  const myFunction = () => {
    // console.log("funtion run");
    if (searchQuery === "") {
      // console.log(`hee ${searchQuery}`);
      setTopic(topic);
    } else {
      // console.log(`hey ${searchQuery}`);
      setTopic(searchQuery);
    }
  };

  const handleAutoSearch = (q: string) => {
    setTopic(q);
  };

  const handleVoiceSearch = () => {
    if (typeof window === "undefined") return;
    console.log(window);

    const SpeechRecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    console.log("SpeechRecognitionConstructor " + SpeechRecognitionConstructor);

    if (!SpeechRecognitionConstructor) {
      alert(
        "Speech recognition is not supported in this browser. Try Google Chrome.",
      );
      return;
    }

    // Create recognition only once
    if (!recognitionRef.current) {
      const recognition = new SpeechRecognitionConstructor();

      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;

        console.log("Voice result:", transcript);

        setSearchQuery(transcript);

        handleAutoSearch(transcript);
      };

      recognition.onerror = (event) => {
        if (event.error === "network") {
          setIsRecording(false);
          console.log(
            "Arc/Chromium restriction detected. Switching to fallback API...",
          );

          return;
        }
        console.error("Speech recognition error:", event.error);
      };

      recognition.onend = () => {
        setIsRecording(false);
        console.log("Speech recognition ended");
      };

      recognitionRef.current = recognition;
    }

    try {
      recognitionRef.current.start();
      setIsRecording(true);
      console.log("Listening... " + recognitionRef);
    } catch (error) {
      console.error("Could not start speech recognition:", error);
    }
  };

  return (
    <>
      <CourseLinkModal />
      <div className="flex justify-center w-full h-[calc(100vh-4rem)] px-4 mt-16 text-black">
        <div className="flex flex-col w-full h-full max-w-[70rem]">
          <div className="w-full relative">
            <div className=" z-20 shrink-0 w-full py-4">
              <div
                className="
                flex
                items-center justify-center
                w-full
                gap-2
"
              >
                {/* Search input */}
                <div className="relative">
                  <div
                    className="
                  flex
                  w-full h-[3rem]
                  rounded-xl
                  sm:w-[33rem]
"
                  >
                    <div
                      className="
                    relative
                    flex flex-col
                    w-full h-full
                    sm:w-[30rem]
"
                    >
                      <input
                        type="text"
                        ref={inputRef}
                        value={searchQuery}
                        placeholder="Search your favourite playlist"
                        className="w-full h-full px-4 py-6
                      rounded-l-lg
                      text-slaty
                      bg-lightSlaty
                      outline-none
                      focus:border focus:border-slaty/30
                      placeholder-slaty/50
                      sm:w-[30rem]

"
                        onChange={handleChange}
                      />

                      {/* Suggestions */}
                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <ul
                          className="
                        absolute
                        top-full
                        left-0
                        z-50
                        w-full
                        mt-1
"
                        >
                          <div
                            className="
                          w-full
                          rounded-lg
                          bg-lightSlaty
                          shadow-lg
                          sm:w-[30rem]
"
                          >
                            {filteredSuggestions.map((suggestion, index) => (
                              <li
                                key={index}
                                onClick={() => handleSelect(suggestion)}
                                className="
                              p-2
                              text-slaty
                              hover:bg-slaty/10
                              cursor-pointer
"
                              >
                                {suggestion}
                              </li>
                            ))}
                          </div>
                        </ul>
                      )}
                    </div>

                    {/* Search button */}
                    <button
                      onClick={async () => {
                        if (searchQuery === "") {
                          setTopic(topic);
                        } else {
                          setTopic(searchQuery);
                        }

                        const res = await fetch(
                          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/searchs`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              title: searchQuery,
                            }),
                            credentials: "include",
                          },
                        );

                        const data = await res.json();

                        console.log("voice data", data.search);
                      }}
                      className="
                    h-full
                    px-3 py-3
                    rounded-r-xl
                    bg-lightSlaty
                    border-l border-lightSlaty
                    duration-300
                    transition
"
                    >
                      <IoSearch
                        className="
                      text-xl text-slaty/50
"
                      />
                    </button>
                  </div>

                  {isRecording && (
                    <div className="w-full h-60 flex flex-col bg-mediumSlaty border border-lightSlaty rounded-lg p-5 text-slaty absolute top-0">
                      <h2>Listening....</h2>
                      <div className="w-full h-full flex justify-center items-center relative">
                        {isRecording && (
                          <motion.div
                            className="rounded-full bg-blue-400 opacity-75 h-20 w-20 absolute -bottom-3"
                            animate={{
                              scale: [0.7, 0.9, 1],
                              opacity: [0.1, 0.2, 0.3],
                            }}
                            transition={{ duration: 1, repeat: Infinity }}
                          ></motion.div>
                        )}
                        {/* Microphone Icon */}
                        <Mic className="w-10 h-10 absolute bottom-2" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Voice button */}
                <Tooltip.Provider delayDuration={0}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        onClick={handleVoiceSearch}
                        className="
                        items-center
                        h-[2.5rem]
                        p-2
                        rounded-full
                        bg-lightSlaty
                        border border-slaty/30
                        hover:bg-slaty/30
"
                      >
                        <GrMicrophone
                          className="
                          text-xl text-slaty/50
"
                        />
                      </button>
                    </Tooltip.Trigger>

                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="top"
                        className="
                        z-50
                        px-3 py-2
                        rounded
                        text-slaty text-sm
                        bg-lightSlaty
                        shadow-md
"
                      >
                        Search with your voice
                        <Tooltip.Arrow
                          className="
                          fill-lightSlaty
"
                        />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
            </div>
            {
              // <div className="w-[33rem] h-full flex absolute top-0 z-50">
              //   <div className="w-full h-60 flex flex-col gap-3 bg-mediumSlaty border border-lightSlaty rounded-lg p-5 text-slaty">
              //     {isRecording && (
              //       <motion.span
              //         className="absolute inset-0 rounded-full bg-blue-400 opacity-75"
              //         animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
              //         transition={{ duration: 1.5, repeat: Infinity }}
              //       />
              //     )}
              //     {/* Microphone Icon */}
              //     <Mic className="relative z-50 w-6 h-6" />
              //   </div>
              // </div>
            }
          </div>

          <LoginModal />

          {/* ONLY THIS PART SCROLLS */}
          <div
            className="
              overflow-y-auto
              flex-1
              min-h-0
              pt-6
"
          >
            <div
              className="flex flex-wrap items-center justify-center gap-8
"
            >
              {playlists.length > 0 ? (
                playlists.map((data, index) => {
                  const id = data.id?.playlistId;
                  const channelId = data.snippet?.channelId;
                  const description = data.snippet?.description;
                  const length = playlistLengths[id] || "0";
                  const channelThumb = channelThumbnail[channelId] || "";

                  if (!hasMounted) return null;

                  return (
                    <CourseCard
                      title={data.snippet?.title}
                      channelTitle={data.snippet?.channelTitle}
                      thumbnails={data.snippet?.thumbnails.high.url}
                      length={length}
                      id={id}
                      bookmark={false}
                      description={description}
                      channelThumb={channelThumb}
                      setGetDataCheck={setGetDataCheck}
                      getDataCheck={getDataCheck}
                      key={index}
                      indexOrder={index}
                    />
                  );
                })
              ) : checkDataExist ? (
                <p
                  className="
                    text-xl text-slaty
"
                >
                  Youtube API limit is exceed
                </p>
              ) : (
                <p
                  className="
                    text-xl text-slaty
                    text-center
"
                >
                  Loading...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Courses;
