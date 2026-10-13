import {
  AddAndRemoveChaptersType,
  ChapterActionType,
  FetchMultipleTypeDataType,
  LoginType,
  SaveChatbotDataType,
  SaveDiscussionDataType,
} from "@/types";
import { toast } from "react-toastify";

const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api`;

const addAndRemoveChapters = async ({
  email,
  playlistId,
  videoId,
  url,
}: AddAndRemoveChaptersType) => {
  const res = await fetch(`${backendUrl}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      playlistId,
      videoId,
    }),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(` error: ${res.status}`);
  }
  const data = await res.json();
  return data;
};

export const fetchEnrolledCourses = async (email: string) => {
  try {
    const res = await fetch(`${backendUrl}/bookmarkCourse/getData`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
      }),
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(` error: ${res.status}`);
    }
    const data = await res.json();
    return data.bookmarkCourse;
  } catch (error) {
    console.log(error);
  }
};

export async function logOut() {
  await fetch(`${backendUrl}/auth/signout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

export async function login({ name, email, imageUrl }: LoginType) {
  try {
    const res = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        imageUrl,
      }),
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(` error: ${res.status}`);
    }
    return res;
  } catch (error) {
    console.log(error);
  }
}

export const fetchDiscussionData = async ({
  id,
  videoId,
}: {
  id: string;
  videoId: string;
}) => {
  try {
    const res = await fetch(`${backendUrl}/discussion/getData`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playlistId: id,
        videoId,
      }),
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(` error: ${res.status}`);
    }
    const data = await res.json();
    return data.discussionData?.discussions;
  } catch (error) {
    console.log(error);
  }
};

export const saveDiscussionData = async ({
  playlistId,
  videoId,
  content,
  username,
  userImageUrl,
}: SaveDiscussionDataType) => {
  try {
    await fetch(`${backendUrl}/discussion/postData`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playlistId,
        videoId,
        content,
        username,
        userImageUrl,
      }),
      credentials: "include",
    });
  } catch (error) {
    console.log(error);
  }
};

export const saveChatbotData = async ({
  email,
  playlistId,
  question,
  answer,
}: SaveChatbotDataType) => {
  try {
    await fetch(`${backendUrl}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        playlistId,
        question,
        answer,
      }),
      credentials: "include",
    });
  } catch (error) {
    console.log(error);
  }
};

export const handleChapterActions = async ({
  isCompleted,
  email,
  playlistId,
  videoId,
  title,
  channelTitle,
  thumbnails,
  description,
  bookmark,
  indexOrder,
}: ChapterActionType) => {
  if (isCompleted === true) {
    try {
      const data = await addAndRemoveChapters({
        email,
        playlistId,
        videoId,
        url: "/enrolledCourse/addChapter",
      });
      if (data.appChapterHandler) {
        toast.success("chapter is complete", {
          hideProgressBar: true,
        });
      } else {
        try {
          await fetch(`${backendUrl}/enrolledCourse`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title,
              channelTitle,
              thumbnails,
              id: playlistId,
              description,
              videoId,
              bookmark: bookmark,
              indexOrder: indexOrder,
              email,
            }),
            credentials: "include",
          });
        } catch (error) {
          console.log(error);
          toast.error(`${error}`, {
            hideProgressBar: true,
          });
        }
        toast.success("course is enrolled", {
          hideProgressBar: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const data = await addAndRemoveChapters({
        email,
        playlistId,
        videoId,
        url: "/enrolledCourse/removeChapter",
      });
      if (data.removeChapterHandler) {
        toast.success("chapter is Incomplete", {
          hideProgressBar: true,
        });
      } else {
        toast.error("you need enrolled in course", {
          hideProgressBar: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export const fetchMultipleTypeData = async ({
  email,
  playlistId,
  url,
}: FetchMultipleTypeDataType) => {
  try {
    const res = await fetch(`${backendUrl}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        playlistId,
      }),
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(` error: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
