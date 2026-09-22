"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef } from "react";
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

    const SpeechRecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

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
          console.log(
            "Arc/Chromium restriction detected. Switching to fallback API...",
          );
          return;
        }
        console.error("Speech recognition error:", event.error);
      };

      recognition.onend = () => {
        console.log("Speech recognition ended");
      };

      recognitionRef.current = recognition;
    }

    try {
      recognitionRef.current.start();
      console.log("Listening...");
    } catch (error) {
      console.error("Could not start speech recognition:", error);
    }
  };

  return (
    <>
      <CourseLinkModal />
      <div className="w-full h-[calc(100vh-4rem)] mt-16 px-4 text-black flex justify-center">
        <div className="w-full max-w-[70rem] h-full flex flex-col">
          {/* SEARCH BAR - DOES NOT SCROLL */}
          <div className="shrink-0 w-full z-20 py-4">
            <div className="flex gap-2 items-center justify-center w-full">
              {/* Search input */}
              <div className="flex rounded-xl h-[3rem] sm:w-[33rem] w-full">
                <div className="flex sm:w-[30rem] w-full h-full flex-col relative">
                  <input
                    type="text"
                    ref={inputRef}
                    value={searchQuery}
                    placeholder="Search your favourite playlist"
                    className="
              sm:w-[30rem]
              h-full
              w-full
              py-6
              px-4
              outline-none
              rounded-l-lg
              focus:border
              bg-lightSlaty
              focus:border-slaty/30
              text-slaty
              placeholder-slaty/50
            "
                    onChange={handleChange}
                  />

                  {/* Suggestions */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <ul className="absolute top-full left-0 z-50 mt-1 w-full">
                      <div className="sm:w-[30rem] w-full bg-lightSlaty rounded-lg shadow-lg">
                        {filteredSuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            onClick={() => handleSelect(suggestion)}
                            className="p-2 text-slaty cursor-pointer hover:bg-slaty/10"
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
            border-l
            px-3
            py-3
            h-full
            bg-lightSlaty
            rounded-r-xl
            transition
            duration-300
            border-lightSlaty
          "
                >
                  <IoSearch className="text-xl text-slaty/50" />
                </button>
              </div>

              {/* Voice button */}
              <Tooltip.Provider delayDuration={0}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={handleVoiceSearch}
                      className="
                rounded-full
                p-2
                h-[2.5rem]
                items-center
                bg-lightSlaty
                border
                border-slaty/30
                hover:bg-slaty/30
              "
                    >
                      <GrMicrophone className="text-xl text-slaty/50" />
                    </button>
                  </Tooltip.Trigger>

                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      className="
                bg-lightSlaty
                text-slaty
                px-3
                py-2
                text-sm
                rounded
                shadow-md
                z-50
              "
                    >
                      Search with your voice
                      <Tooltip.Arrow className="fill-lightSlaty" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
          </div>

          <LoginModal />

          {/* ONLY THIS PART SCROLLS */}
          <div className="flex-1 min-h-0 overflow-y-auto py-6">
            <div className="flex flex-wrap gap-8 items-center justify-center">
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
                <p className="text-xl text-slaty">
                  Youtube API limit is exceed
                </p>
              ) : (
                <p className="text-xl text-center text-slaty">Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Courses;
