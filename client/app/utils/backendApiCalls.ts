import {
  AddAndRemoveChaptersType,
  BookmarkPlaylistType,
  ChapterActionType,
  DeleteDisussionPropType,
  EnrolledCourseType,
  FetchDiscussionDataPropType,
  FetchMultipleTypeDataType,
  LoginType,
  QuizzType,
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

export const deleteBookmarkCourse = async ({
  email,
  id,
}: {
  email: string;
  id: string;
}) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/bookmarkCourse/delete`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          id,
        }),
        credentials: "include",
      },
    );
    if (!res.ok) {
      throw new Error(` error: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const saveSearchTopic = async ({
  searchQuery,
}: {
  searchQuery: string;
}) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/searchs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: searchQuery,
        }),
        credentials: "include",
      },
    );
    if (!res.ok) {
      throw new Error(` error: ${res.status}`);
    }
  } catch (error) {
    console.log(error);
  }
};

export const saveBookmarkCourse = async ({
  title,
  channelTitle,
  thumbnails,
  id,
  email,
}: {
  title: string;
  channelTitle: string;
  thumbnails: string;
  id: string;
  email: string;
}) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/bookmarkCourse`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          channelTitle,
          thumbnails,
          id,
          bookmark: true,
          email,
        }),
        credentials: "include",
      },
    );
    if (!res.ok) {
      throw new Error(` error: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    toast.error(`${error}`, {
      hideProgressBar: true,
    });
  }
};

export const fetchBookmarkedCourses = async (email: string) => {
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

export const logOut = async () => {
  await fetch(`${backendUrl}/auth/signout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const login = async ({ name, email, imageUrl }: LoginType) => {
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
};

export const fetchDiscussionData = async ({
  id,
  videoId,
}: FetchDiscussionDataPropType) => {
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

export const saveEnrolledCourse = async ({
  title,
  channelTitle,
  thumbnails,
  id,
  description,
  indexOrder,
  email,
}: EnrolledCourseType) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/enrolledCourse`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          channelTitle,
          thumbnails,
          id,
          description,
          bookmark: true,
          indexOrder,
          email,
        }),
        credentials: "include",
      },
    );
    const data = await res.json();
    return data;
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

export const playlistOrderUpdate = async ({
  email,
  updatedItems,
}: {
  email: string;
  updatedItems: BookmarkPlaylistType[];
}) => {
  try {
    const res = await fetch(`${backendUrl}/enrolledCourse/updateOrder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        newOrder: updatedItems.map((p) => p.playlistId),
      }),
    });

    if (!res.ok) throw new Error("Failed to update order");
    console.log("✅ Order updated successfully");
  } catch (err) {
    console.error("❌ Error updating order:", err);
  }
};

export const fetchEnrolledCourses = async ({ email }: { email: string }) => {
  try {
    const res = await fetch(`${backendUrl}/enrolledCourse/getData`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
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

export const fechSearchtopics = async () => {
  try {
    const res = await fetch(`${backendUrl}/searchs/getData`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
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

export const deteteDiscusion = async ({
  playlistId,
  videoId,
  name,
  content,
}: DeleteDisussionPropType) => {
  try {
    const res = await fetch(`${backendUrl}/discussion/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playlistId,
        videoId,
        name,
        content,
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

export const saveUserQiuzzScore = async ({
  id,
  videoId,
  score,
  email,
}: {
  id: string;
  videoId: string;
  score: number;
  email: string;
}) => {
  try {
    const res = await fetch(`${backendUrl}/score/addUserScore`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playlistId: id,
        videoId,
        score,
        email,
      }),
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(` error: ${res.status}`);
    }
  } catch (error) {
    console.log(error);
  }
};

export const saveQuizzes = async ({
  id,
  videoId,
  quizz,
}: {
  id: string;
  videoId: string;
  quizz: QuizzType[];
}) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/quizz/addQiuzzes`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playlistId: id,
          videoId,
          quizz,
        }),
        credentials: "include",
      },
    );
    if (!res.ok) {
      throw new Error(` error: ${res.status}`);
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchQuizzesFromBackend = async ({
  id,
  videoId,
}: {
  id: string;
  videoId: string;
}) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/quizz/getQiuzzData`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playlistId: id,
          videoId,
        }),
        credentials: "include",
      },
    );
    if (!res.ok) {
      throw new Error(` error: ${res.status}`);
    }
    const data = await res.json();
    return data.quizzData[0].quizz;
  } catch (error) {
    console.log(error);
  }
};

export const fetchQuizzScore = async ({
  playlistId,
  videoId,
  email,
}: {
  playlistId: string;
  videoId: string;
  email: string;
}) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/score/getUserScore`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playlistId,
          videoId,
          email,
        }),
        credentials: "include",
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
