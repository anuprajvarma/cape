import { Mic } from "lucide-react";
import { motion } from "framer-motion";
// import { IoSearch } from "react-icons/io5";
import { useState } from "react";
import useClickOutside from "../utils/outsideClick";
import { SearchInputPropType } from "@/types";
// import { saveSearchTopic } from "../utils/backendApiCalls";
import VoiceSearchHandle from "./VoiceSearchHandle";

const SearchInput = ({
  showSuggestions,
  suggestionsArray,
  searchQuery,
  // topic,
  setShowSuggestions,
  setTopic,
  setSearchQuery,
}: SearchInputPropType) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
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

  return (
    <div className="w-full flex justify-center sticky top-20 z-50 mb-10 mt-15">
      <div className="relative w-[20rem] sm:w-120 h-full px-4 bg-white/5 backdrop-blur-2xl border border-brand-slate-1/20 rounded-[20px] text-brand-slate-1">
        <div className="flex w-full h-12">
          <div className="relative flex flex-col w-full h-full">
            <input
              type="text"
              ref={inputRef}
              value={searchQuery}
              placeholder="Search your favourite playlist"
              className="w-full h-full px-4 py-6 rounded-l-lg outline-hidden text-white"
              onChange={handleChange}
            />
          </div>

          {/* <button
            onClick={async () => {
              if (searchQuery === "") {
                setTopic(topic);
              } else {
                setTopic(searchQuery);
              }
              await saveSearchTopic({ searchQuery });
            }}
            className="h-full px-3 py-3 rounded-r-[15px] bg-lightSlaty  duration-300 transition"
          >
            <IoSearch className="text-xl text-brand-blue cursor-pointer" />
          </button> */}
          <VoiceSearchHandle
            setSearchQuery={setSearchQuery}
            setIsRecording={setIsRecording}
            setTopic={setTopic}
          />
        </div>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="absolute top-11 left-0 w-full mt-1">
            <div className="w-full rounded-3xl bg-brand-slate-1/10 border border-brand-slate-1/50 shadow-lg">
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(suggestion)}
                  className="p-4 text-white hover:bg-brand-slate-1/20 cursor-pointer rounded-[20px]"
                >
                  {suggestion}
                </li>
              ))}
            </div>
          </ul>
        )}

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
              <Mic className="w-10 h-10 absolute bottom-2 cursor-pointer" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
