export async function fetchPlaylist({
  max,
  topic,
}: {
  max: string;
  topic: string;
}) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${topic}&type=playlist&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&maxResults=${max}`
    );

    if (!res.ok) throw new Error("Failed to fetch playlist");

    const data = await res.json();
    return data.items;
  } catch (error) {
    console.log(`Error fetching playlist: ${error}`);
    return [];
  }
}

export const handleEnrolled = async (email: string) => {
  // console.log("step 2");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/bookmarkCourse/getData`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
      }),
      credentials: "include",
    }
  );
  const data = await res.json();
  return data.bookmarkCourse;
};

export async function playlist(id: string) {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${id}&maxResults=3&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
  );
  const data = await res.json();
  return data.items[0].snippet?.resourceId.videoId;
}

export async function editorDataFetch({
  email,
  playlistId,
}: {
  email: string;
  playlistId: string;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/notes/getNote`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, playlistId }),
      credentials: "include",
    }
  );

  const data = await res.json();
  return data.noteData?.content;
}

export async function enrolledCourseDataFetch({
  email,
  playlistId,
}: {
  email: string;
  playlistId: string;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/enrolledCourse/getChapterData`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        playlistId: playlistId,
      }),
      credentials: "include",
    }
  );
  const data = await res.json();
  return data.getChapterData?.chapters;
}

export async function enrolledCourseDelete({
  email,
  playlistId,
}: {
  email: string;
  playlistId: string;
}) {
  await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/enrolledCourse/delete`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        playlistId,
      }),
      credentials: "include",
    }
  );
}

export async function signOutFuntion() {
  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/signout`, {
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
  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      imageUrl,
    }),
    credentials: "include",
  });
}

export const fetchDiscussionData = async ({
  id,
  videoId,
}: {
  id: string;
  videoId: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/discussion/getData`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playlistId: id,
        videoId,
      }),
      credentials: "include",
    }
  );
  const data = await res.json();
  return data.discussionData?.discussions;
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
  await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/discussion/postData`,
    {
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
    }
  );
};

export const easyExplainFuntion = async ({
  videoTitle,
}: {
  videoTitle: string;
}) => {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "user",
          content: `explain ${videoTitle} like 5-year-old child`,
        },
      ],
    }),
  });

  const data = await res.json();
  return data?.choices?.[0]?.message?.content;
};

export const chatBotApiCall = async ({ input }: { input: string }) => {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
    }),
  });

  const data = await res.json();
  return data?.choices?.[0]?.message;
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
  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/chat`, {
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
};

export const GPTDataFetchToMongoDB = async ({
  email,
  playlistId,
}: {
  email: string;
  playlistId: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/chat/getData`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        playlistId,
      }),
      credentials: "include",
    }
  );
  const data = await res.json();
  return data.chatData?.chats;
};

export const handleChapter = async ({
  e,
  email,
  playlistId,
  videoId,
}: {
  e: boolean;
  email: string;
  playlistId: string;
  videoId: string;
}) => {
  if (e === true) {
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/enrolledCourse/addChapter`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          playlistId,
          videoId,
        }),
        credentials: "include",
      }
    );
  } else {
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/enrolledCourse/removeChapter`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          playlistId,
          videoId,
        }),
        credentials: "include",
      }
    );
  }
};

export const funtionForVideoDetail = async ({
  videoId,
}: {
  videoId: string;
}) => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
  );
  const data = await res.json();
  return data.items;
};

export const fetchChapterData = async ({
  email,
  playlistId,
}: {
  email: string;
  playlistId: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/enrolledCourse/getChapterData`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        playlistId,
      }),
      credentials: "include",
    }
  );
  const data = await res.json();
  return data.getChapterData?.chapters;
};

export const fetchPlayListVideos = async ({ id }: { id: string }) => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${id}&maxResults=200&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
  );
  const data = await res.json();
  return data.items;
};
