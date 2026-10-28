import { ChatbotSectionPropType } from "@/types";
import ReactMarkdown from "react-markdown";
import { useChatbotButtonClick } from "../hooks/chatbot";

export const ChatbotSection = ({ id }: ChatbotSectionPropType) => {
  const { input, setInput, sendMessage, temporaryChatData } =
    useChatbotButtonClick({
      id,
    });

  return (
    <div className="w-full flex flex-col h-full">
      {temporaryChatData?.length > 0 ? (
        <div className="w-full h-11/12 rounded-sm overflow-y-auto px-8">
          {temporaryChatData?.map((msg, i) => (
            <div key={i} className="pt-8">
              <div className="flex w-full justify-end">
                <p className="border border-brand-slate-1/20 px-6 py-2 rounded-3xl text-white bg-white/5 backdrop-blur-2xl">
                  {msg.question}
                </p>
              </div>
              <div className="prose prose-slate prose-lg w-full h-full overflow-auto max-w-none py-4 prose-headings:my-2 prose-p:my-0 prose-li:my-0 prose-hr:my-6 prose-ul:my-0 prose-a:hover:underline">
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
        <div className="w-full h-11/12 flex flex-col justify-center items-center gap-4">
          <div>What&apos;s the agenda today ?</div>
        </div>
      )}

      <div className="flex gap-2 px-8">
        <input
          value={input}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              sendMessage();
            }
          }}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-3 rounded-3xl bg-lightSlaty focus:outline-hidden border border-brand-slate-1/30 text-white placeholder-brand-slate-1"
          placeholder="Ask anything..."
        />
      </div>
    </div>
  );
};
