import { ChatbotSectionPropType } from "@/types";
import ReactMarkdown from "react-markdown";
import { useChatbotButtonClick } from "../hooks/chatbot";
import remarkGfm from "remark-gfm";

export const ChatbotSection = ({ id }: ChatbotSectionPropType) => {
  const { input, setInput, sendMessage, temporaryChatData } =
    useChatbotButtonClick({
      id,
    });

  console.log("temporaryChatData " + temporaryChatData);

  return (
    <div className="w-full flex flex-col h-full">
      {temporaryChatData?.length > 0 ? (
        <div className="w-full h-200 md:h-11/12 rounded-sm overflow-y-auto px-4">
          {temporaryChatData?.map((msg, i) => (
            <div key={i} className="pt-8">
              <div className="flex w-full justify-end">
                <p className="border border-brand-slate-1/20 px-6 py-2 rounded-3xl text-white bg-white/5 backdrop-blur-2xl">
                  {msg.question}
                </p>
              </div>
              <div className="prose prose-slate prose-lg w-full h-full overflow-auto max-w-none py-4 prose-headings:my-2 prose-p:my-0 prose-li:my-0 prose-hr:my-6 prose-ul:my-0 prose-a:hover:underline">
                {msg.answer !== "" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 line-clamp-3"
                        >
                          {children}
                        </a>
                      ),
                      table: ({ children }) => (
                        <div className="my-4 w-full overflow-x-auto rounded-lg border border-brand-slate-1/30">
                          <table className="w-full border-collapse text-left text-sm">
                            {children}
                          </table>
                        </div>
                      ),

                      thead: ({ children }) => (
                        <thead className="bg-white/5 backdrop-blur-2xl text-white rounded-3xl">
                          {children}
                        </thead>
                      ),

                      tbody: ({ children }) => (
                        <tbody className="divide-y divide-brand-slate-1/30">
                          {children}
                        </tbody>
                      ),

                      tr: ({ children }) => <tr className="">{children}</tr>,

                      th: ({ children }) => (
                        <th className="border-b border-brand-slate-1/30 px-4 py-3 font-semibold">
                          {children}
                        </th>
                      ),

                      td: ({ children }) => (
                        <td className="px-4 py-3 align-top leading-6 max-w-32">
                          {children}
                        </td>
                      ),
                      ul: ({ children }) => (
                        <ul className="my-3 ml-6 list-disc space-y-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="my-3 ml-6 list-decimal space-y-1">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="pl-1">{children}</li>
                      ),
                      h2: ({ children }) => (
                        <li className="font-bold text-xl">{children}</li>
                      ),
                      hr: () => (
                        <hr className="my-4 border-t border-brand-slate-1/30" />
                      ),
                      pre: ({ children }) => (
                        <pre className="my-4 overflow-x-auto bg-white/5 backdrop-blur-2xl text-white rounded-3xl p-4 text-sm">
                          {children}
                        </pre>
                      ),
                      code: ({ className, children, ...props }) => {
                        const isBlock = Boolean(className);

                        return isBlock ? (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        ) : (
                          <code
                            className="rounded bg-brand-slate-1/20 px-1 py-0.5 text-sm text-white"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.answer}
                  </ReactMarkdown>
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

      <div className="flex gap-2 px-4">
        <input
          value={input}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              sendMessage();
            }
          }}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 xl:py-3 rounded-3xl bg-lightSlaty focus:outline-hidden border border-brand-slate-1/30 text-white placeholder-brand-slate-1"
          placeholder="Ask anything..."
        />
      </div>
    </div>
  );
};
