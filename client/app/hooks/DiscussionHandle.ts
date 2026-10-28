import { useEffect, useState } from "react";
import {
  deteteDiscusion,
  fetchDiscussionData,
  saveDiscussionData,
} from "../utils/backendApiCalls";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { DeleteDisussionPropType, discussionType } from "@/types";
import { useSessionsDetails } from "./sesionAndRouterDetail";
import { setIsOpen } from "../redux/slices/LoginModalSlice";

export const useDiscussionHandle = ({
  id,
  videoId,
  setDiscussionData,
}: {
  id: string | string[] | undefined;
  videoId: string | string[] | undefined;
  setDiscussionData: React.Dispatch<React.SetStateAction<discussionType[]>>;
}) => {
  const { session } = useSessionsDetails();
  const dispatch = useDispatch<AppDispatch>();
  const [commentStateUpdate, setCommentStateUpdate] = useState(false);
  const [discussionContent, setDiscussionContent] = useState("");

  useEffect(() => {
    const discussion = async () => {
      if (typeof id === "string" && typeof videoId === "string") {
        const result = await fetchDiscussionData({ id, videoId });
        setDiscussionData(result);
      }
    };
    if (videoId) {
      discussion();
    }
  }, [session.data?.user?.email, id, videoId, commentStateUpdate]);

  const DeteleDiscussion = async ({
    playlistId,
    videoId,
    name,
    content,
  }: DeleteDisussionPropType) => {
    const data = await deteteDiscusion({ playlistId, videoId, name, content });
    // console.log(data.deleteDiscussion);
    if (data.deleteDiscussion) {
      toast.success("comment is delete", {
        hideProgressBar: true,
      });
    }
    setCommentStateUpdate(!commentStateUpdate);
  };

  const discussionHandler = async () => {
    if (session.status === "authenticated") {
      await saveDiscussionData({
        playlistId: id as string,
        videoId: videoId as string,
        content: discussionContent,
        username: session.data?.user?.name ?? "",
        userImageUrl: session.data?.user?.image ?? "",
      });
      setCommentStateUpdate(!commentStateUpdate);
      setDiscussionContent("");
    } else {
      dispatch(setIsOpen(true));
    }
  };

  return {
    DeteleDiscussion,
    discussionHandler,
    discussionContent,
    setDiscussionContent,
  };
};
