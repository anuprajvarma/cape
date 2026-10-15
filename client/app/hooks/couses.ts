import { playlistType } from "@/types";
import { useEffect, useState } from "react";
import { fechSearchtopics } from "../utils/backendApiCalls";
import { fetchPlaylists } from "../utils/frontendApiCalls";
import { youtubeApiKey } from "../utils/reusableConstant";

export const useCourses = ({
  topic,
  searchQuery,
  setTopic,
  setShowSuggestions,
}: {
  topic: string;
  searchQuery: string;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const apikey = youtubeApiKey();

  const [playlists, setPopularPlaylist] = useState<playlistType[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [checkDataExist, setCheckDataExist] = useState<boolean>(false);
  const [suggestionsArray, setSuggestionsArray] = useState<string[]>([]);

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
  return { suggestionsArray, playlists, hasMounted, checkDataExist };
};
