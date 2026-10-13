import { toast } from "react-toastify";

const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api`;

const fetchData = async ({
  email,
  playlistId,
  videoId,
  url,
}: {
  email: string;
  playlistId: string;
  videoId: string;
  url: string;
}) => {
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

export const handleEnrolled = async (email: string) => {
  try {
    const res = await fetch(`${backendUrl}/bookmarkCourse/getData`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
      }),
      credentials: "include",
    });
    const data = await res.json();
    return data.bookmarkCourse;
  } catch (error) {
    console.log(error);
    return;
  }
};

export async function signOutFuntion() {
  await fetch(`${backendUrl}/auth/signout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

export async function loginFuntion({
  name,
  email,
  imageUrl,
}: {
  name: string;
  email: string;
  imageUrl: string;
}) {
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
    return res;
  } catch (error) {
    console.log(error);
    return;
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
    const data = await res.json();
    return data.discussionData?.discussions;
  } catch (error) {
    console.log(error);
  }
};

export const postDiscussionData = async ({
  playlistId,
  videoId,
  content,
  username,
  userImageUrl,
}: {
  playlistId: string;
  videoId: string;
  content: string;
  username: string;
  userImageUrl: string;
}) => {
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

export const GPTDataPostToMongoDB = async ({
  email,
  playlistId,
  question,
  answer,
}: {
  email: string;
  playlistId: string;
  question: string;
  answer: string;
}) => {
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

export const handleChapter = async ({
  e,
  email,
  playlistId,
  videoId,
  title,
  channelTitle,
  thumbnails,
  description,
  bookmark,
  indexOrder,
}: {
  e: boolean;
  email: string;
  playlistId: string;
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnails: string;
  description: string;
  bookmark: boolean;
  indexOrder: number;
}) => {
  if (e === true) {
    try {
      const data = await fetchData({
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
      const data = await fetchData({
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

export const fetchBackendData = async ({
  email,
  playlistId,
  url,
}: {
  email: string;
  playlistId: string;
  url: string;
}) => {
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
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
