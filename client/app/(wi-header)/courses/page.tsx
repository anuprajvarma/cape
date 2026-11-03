"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import { LoginModal } from "../../component/LoginModal";
import { CourseLinkModal } from "../../component/CourseLinkModal";

import SearchInput from "../../component/SearchInput";
import { useCourses } from "../../hooks/couses";

const CourseCard = dynamic(() => import("../../component/CourseCard"), {
  ssr: false,
});

export default function Courses() {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [getDataCheck, setGetDataCheck] = useState<boolean>(false);
  const [topic, setTopic] = useState<string>(
    "ai AND claude code AND robotics engineering",
  );
  const { suggestionsArray, playlists, hasMounted, checkDataExist } =
    useCourses({ topic, searchQuery, setTopic, setShowSuggestions });

  return (
    <>
      <CourseLinkModal />
      <div className="flex justify-center w-full px-4 mt-16 text-black">
        <div className="flex flex-col w-full h-full sticky top-0">
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
          <div className="flex w-full items-center justify-center">
            <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center gap-6">
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
