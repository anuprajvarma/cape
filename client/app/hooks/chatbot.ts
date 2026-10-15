import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { fetchChatbotAnswer } from "../utils/frontendApiCalls";
import { useSessionsDetails } from "./sesionAndRouterDetail";
import { setIsOpen } from "../redux/slices/LoginModalSlice";
import { ChatbotSectionPropType } from "@/types";
import { saveChatbotData } from "../utils/backendApiCalls";
import { useState } from "react";

export const useChatbotButtonClick = ({
  id,
  temporaryChatData,
  setTemporaryChatData,
}: ChatbotSectionPropType) => {
  const { session } = useSessionsDetails();
  const [input, setInput] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const sendMessage = async () => {
    if (session.status === "authenticated") {
      if (!input.trim()) return;
      if (temporaryChatData?.length > 0) {
        setTemporaryChatData((prev) => [
          ...prev,
          { question: input, answer: "" },
        ]);
      } else {
        setTemporaryChatData([{ question: input, answer: "" }]);
      }
      setInput("");
      try {
        const result = await fetchChatbotAnswer({ input });
        setTemporaryChatData((prev) =>
          prev.map((chat) =>
            chat.question === input
              ? { ...chat, answer: result.content }
              : chat,
          ),
        );
        if (result.content) {
          await saveChatbotData({
            email: session.data?.user?.email ?? "",
            playlistId: id,
            question: input,
            answer: result.content ?? "",
          });
        }
      } catch (error) {
        console.error("Error fetching from OpenRouter or saving to DB:", error);
      }
    } else {
      dispatch(setIsOpen(true));
    }
  };
  return { input, setInput, sendMessage };
};
