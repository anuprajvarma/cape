"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { fetchPlaylists } from "../utils/frontendApiCalls";
import { LoginModal } from "../component/LoginModal";
import { CourseLinkModal } from "../component/CourseLinkModal";
import { playlistType } from "@/types";

import { youtubeApiKey } from "../utils/reusableConstant";
import { fechSearchtopics } from "../utils/backendApiCalls";
import SearchInput from "../component/SearchInput";

const CourseCard = dynamic(() => import("../component/CourseCard"), {
  ssr: false,
});

export default function Courses() {
  const [playlists, setPopularPlaylist] = useState<playlistType[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [checkDataExist, setCheckDataExist] = useState<boolean>(false);
  const [suggestionsArray, setSuggestionsArray] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [getDataCheck, setGetDataCheck] = useState<boolean>(false);

  const [topic, setTopic] = useState(
    "ai AND claude code AND robotics engineering",
  );

  const apikey = youtubeApiKey();

  useEffect(() => {
    const handleSearchData = async () => {
      const data = await fechSearchtopics();
      setSuggestionsArray(data.searchData[0].title);
    };
    handleSearchData();
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const load = async () => {
      const max = "50";
      if (apikey) {
        setPopularPlaylist([]);
        const result = await fetchPlaylists({ max, topic });
        setPopularPlaylist(result);
        if (result.length > 0) {
          setCheckDataExist(false);
        } else {
          setCheckDataExist(true);
        }
      }
    };
    load();
  }, [topic, apikey]);

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

  const myFunction = () => {
    if (searchQuery === "") {
      setTopic(topic);
    } else {
      setTopic(searchQuery);
    }
  };

  return (
    <>
      <CourseLinkModal />
      <div className="flex justify-center w-full h-[calc(100vh-4rem)] px-4 mt-16 text-black">
        <div className="flex flex-col w-full h-full max-w-[70rem]">
          <SearchInput
            showSuggestions={showSuggestions}
            suggestionsArray={suggestionsArray}
            searchQuery={searchQuery}
            topic={topic}
            setShowSuggestions={setShowSuggestions}
            setTopic={setTopic}
            setSearchQuery={setSearchQuery}
          />
          <LoginModal />
          <div className="overflow-y-auto flex-1 min-h-0 pt-6">
            <div className="flex flex-wrap items-center justify-center gap-8">
              {playlists.length > 0 ? (
                playlists.map((data, index) => {
                  const id = data.id?.playlistId;

                  const description = data.snippet?.description;

                  if (!hasMounted) return null;

                  return (
                    <CourseCard
                      title={data.snippet?.title}
                      channelTitle={data.snippet?.channelTitle}
                      thumbnails={data.snippet?.thumbnails.high.url}
                      id={id}
                      bookmark={false}
                      description={description}
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
                <p className="text-xl text-slaty text-center">Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
