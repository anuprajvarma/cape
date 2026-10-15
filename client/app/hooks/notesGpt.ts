import { useEffect, useState } from "react";
import { saveUserQiuzzScore } from "../utils/backendApiCalls";
import { useSessionsDetails } from "./sesionAndRouterDetail";

export const useNotesGpt = ({
  id,
  videoId,
  countedScore,
  Completed,
}: {
  id: string;
  videoId: string;
  countedScore: number;
  Completed: number;
}) => {
  const { session } = useSessionsDetails();
  const [quizzcheck, setQuizzCheck] = useState<boolean>(false);
  const [notecheck, setNoteCheck] = useState<boolean>(true);
  const [gptcheck, setgptCheck] = useState<boolean>(false);

  useEffect(() => {
    const addScore = async () => {
      saveUserQiuzzScore({
        id,
        videoId,
        score: countedScore,
        email: session.data?.user?.email || "",
      });
    };

    if (Completed === 10) {
      addScore();
    }
  }, [Completed, id, videoId, session.data?.user?.email, countedScore]);

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
  return {
    handleNotes,
    notecheck,
    handleGPT,
    gptcheck,
    handleEasyExplain,
    quizzcheck,
  };
};
