import { GrMicrophone } from "react-icons/gr";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useRef } from "react";
import { SpeechWindow } from "@/types";

const VoiceSearchHandle = ({
  setSearchQuery,
  setIsRecording,
  setTopic,
}: {
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);

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

      console.log("recognitionRef.current " + recognitionRef.current);

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
  );
};

export default VoiceSearchHandle;
