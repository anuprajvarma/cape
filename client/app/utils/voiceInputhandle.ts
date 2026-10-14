import { SpeechWindow } from "@/types";

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

export default handleVoiceSearch;
