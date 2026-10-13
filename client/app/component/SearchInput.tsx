import { Mic } from "lucide-react";
import { motion } from "framer-motion";
import { GrMicrophone } from "react-icons/gr";
import { IoSearch } from "react-icons/io5";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useRef, useState } from "react";
import useClickOutside from "../utils/outsideClick";
import { SpeechWindow } from "@/types";
import { saveSearchTopic } from "../utils/backendApiCalls";

const SearchInput = ({
  showSuggestions,
  suggestionsArray,
  searchQuery,
  topic,
  setShowSuggestions,
  setTopic,
  setSearchQuery,
}: {
  showSuggestions: boolean;
  suggestionsArray: string[];
  searchQuery: string;
  topic: string;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const inputRef = useClickOutside<HTMLInputElement>(() => {
    setShowSuggestions(false);
  });

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

  const handleVoiceSearch = () => {
    if (typeof window === "undefined") return;

    const speechWindow = window as unknown as SpeechWindow;

    const SpeechRecognitionConstructor =
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      alert(
        "Speech recognition is not supported in this browser. Try Google Chrome.",
      );
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognitionConstructor();

      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript ?? "";

        if (!transcript) return;

        console.log("Voice result:", transcript);

        setSearchQuery(transcript);
        handleAutoSearch(transcript);
      };

      recognition.onerror = (event) => {
        setIsRecording(false);

        if (event.error === "network") {
          console.log("Network error detected while using speech recognition.");
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

      console.log("Listening...");
    } catch (error) {
      console.error("Could not start speech recognition:", error);

      setIsRecording(false);
    }
  };

  const handleAutoSearch = (q: string) => {
    setTopic(q);
  };

  return (
    <div className="w-full relative">
      <div className=" z-20 shrink-0 w-full py-4">
        <div className="flex items-center justify-center w-full gap-2">
          <div className="relative">
            <div className="flex w-full h-[3rem] rounded-xl sm:w-[33rem]">
              <div className="relative flex flex-col w-full h-full sm:w-[30rem]">
                <input
                  type="text"
                  ref={inputRef}
                  value={searchQuery}
                  placeholder="Search your favourite playlist"
                  className="w-full h-full sm:w-[30rem] px-4 py-6 rounded-l-lg text-slaty bg-lightSlaty outline-none focus:border focus:border-slaty/30 placeholder-slaty/50"
                  onChange={handleChange}
                />

                {/* Suggestions */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <ul className="absolutetop-full left-0 z-50 w-full mt-1">
                    <div className="w-full rounded-lg bg-lightSlaty shadow-lg sm:w-[30rem]">
                      {filteredSuggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelect(suggestion)}
                          className="p-2 text-slaty hover:bg-slaty/10 cursor-pointer"
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
                  await saveSearchTopic({ searchQuery });
                }}
                className="h-full px-3 py-3 rounded-r-xl bg-lightSlaty border-l border-lightSlaty duration-300 transition"
              >
                <IoSearch className="text-xl text-slaty/50" />
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
                  className="items-center h-[2.5rem] p-2 rounded-full bg-lightSlaty border border-slaty/30 hover:bg-slaty/30"
                >
                  <GrMicrophone className="text-xl text-slaty/5" />
                </button>
              </Tooltip.Trigger>

              <Tooltip.Portal>
                <Tooltip.Content
                  side="top"
                  className="z-50 px-3 py-2 rounded text-slaty text-sm bg-lightSlaty shadow-md"
                >
                  Search with your voice
                  <Tooltip.Arrow className="fill-lightSlaty" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
