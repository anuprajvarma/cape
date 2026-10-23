import { AiOutlineDelete } from "react-icons/ai";
import Image from "next/image";
import { discussionType } from "@/types";
import { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useDiscussionHandle } from "../hooks/DiscussionHandle";

export const DiscussionSection = ({
  id,
  videoId,
}: {
  id: string | string[] | undefined;
  videoId: string | string[] | undefined;
}) => {
  const [discussionData, setDiscussionData] = useState<discussionType[]>([]);
  const {
    DeteleDiscussion,
    discussionHandler,
    discussionContent,
    setDiscussionContent,
  } = useDiscussionHandle({ id, videoId, setDiscussionData });

  return (
    <div>
      {discussionData ? (
        <div className="w-full h-full min-h-[50.4rem] border border-lightSlaty rounded-xl lg:flex lg:flex-col hidden">
          <div className="w-full items-center text-center font-semibold py-4 justify-center bg-mediumSlaty rounded-t-xl">
            Discussion
          </div>
          <div className="space-y-2 w-full h-full p-4 rounded-sm overflow-y-auto">
            {discussionData?.map((msg, i) => (
              <div
                className="flex gap-4"
                key={i}
                // className={msg.sender === "user" ? "text-right" : "text-left"}
              >
                <div className="flex w-16 items-start h-12 relative">
                  <Image
                    src={msg.image || "/code.jpg"}
                    alt="code"
                    quality={100}
                    sizes="80px"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-full"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <p className="text-white text-xs font-semibold">{msg.name}</p>
                  <p className="text-sm text-slaty">{msg.content}</p>
                </div>
                <div className="flex w-12 items-center justify-center">
                  <Tooltip.Provider delayDuration={0}>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          onClick={() =>
                            DeteleDiscussion({
                              playlistId: id as string,
                              videoId: videoId as string,
                              name: msg.name,
                              content: msg.content,
                            })
                          }
                        >
                          <AiOutlineDelete className="text-xl hover:text-white transition duration-300" />
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          side="top"
                          className="bg-lightSlaty text-white px-2 py-1 text-xs rounded-sm shadow-md z-20"
                        >
                          Delete
                          <Tooltip.Arrow className="fill-lightSlaty" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 p-4">
            <input
              value={discussionContent}
              onChange={(e) => setDiscussionContent(e.target.value)}
              className="flex-1 p-2 rounded-md bg-lightSlaty focus:outline-hidden border border-slaty/50 text-slaty placeholder-slaty/50"
              placeholder="Type a message..."
            />
            <button
              onClick={discussionHandler}
              className="px-2 bg-blue-600 text-white rounded-sm"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-[47.7rem] border border-lightSlaty rounded-xl lg:flex lg:flex-col hidden">
          <div className="w-full items-center text-center font-semibold py-4 justify-center bg-mediumSlaty rounded-t-xl">
            Discussion
          </div>
          <div className="w-full h-160 flex items-center justify-center p-4">
            <p className="text-slaty text-center">
              No discussion available yet.
            </p>
          </div>
          <div className="flex gap-2 p-4">
            <input
              value={discussionContent}
              onKeyDown={(e) => {
                if (e.key === "Enter" && discussionContent.trim()) {
                  discussionHandler();
                }
              }}
              onChange={(e) => setDiscussionContent(e.target.value)}
              className="flex-1 p-2 rounded-md bg-lightSlaty focus:outline-hidden border border-slaty/50 text-slaty placeholder-slaty/50"
              placeholder="Say something"
            />
            <button
              onClick={discussionHandler}
              className="px-2 bg-blue-600 text-white rounded-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
