import { ChatbotSectionPropType } from "@/types";
import ReactMarkdown from "react-markdown";
import { useChatbotButtonClick } from "../hooks/chatbot";

export const ChatbotSection = ({ id }: ChatbotSectionPropType) => {
  const { input, setInput, sendMessage, temporaryChatData } =
    useChatbotButtonClick({
      id,
    });

  return (
    <div className="w-full h-full">
      {temporaryChatData?.length > 0 ? (
        <div className="space-y-2 w-full h-full rounded-sm overflow-y-auto">
          {temporaryChatData?.map((msg, i) => (
            <div key={i}>
              <div className="flex w-full justify-end text-xl text-white py-2 sm:py-4">
                <p className="border border-lightSlaty px-6 py-2 rounded-3xl">
                  {msg.question}
                </p>
              </div>
              <div className="prose prose-slate prose-lg w-full h-full overflow-auto max-w-none p-2 sm:p-12 prose-headings:my-2 prose-p:my-0 prose-li:my-0 prose-hr:my-6 prose-ul:my-0 prose-a:hover:underline">
                {msg.answer !== "" ? (
                  <ReactMarkdown>{msg.answer}</ReactMarkdown>
                ) : (
                  ".............."
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center gap-4">
          <div>What&apos;s the agenda today ?</div>
        </div>
      )}

      <div className="py-4 flex gap-2">
        <input
          value={input}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              sendMessage();
            }
          }}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded-md bg-lightSlaty focus:outline-hidden border border-slaty/50 text-slaty placeholder-slaty/50"
          placeholder="Ask anything..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-lightBlue hover:bg-lightBlue/80 text-white rounded-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};
