import { toast } from "react-toastify";

const YOUTUBE_API_KEY = [
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_1,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_2,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_3,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_4,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_5,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_6,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_7,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_8,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_9,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_10,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_11,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_12,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_13,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_14,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_15,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_16,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_17,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_18,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_19,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_20,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_21,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_22,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_23,
];

function parseQuizHtml(html: string) {
  const lines = html
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const quiz = [];

  let question = "";
  let options: string[] = [];
  let answer = "";

  for (const line of lines) {
    if (line.startsWith("<h1>")) {
      if (question) {
        quiz.push({ question, options, answer });
        options = [];
        answer = "";
      }
      question = line.replace(/<\/?h1>/g, "").trim();
    } else if (line.startsWith("<p>")) {
      options.push(line.replace(/<\/?p>/g, "").trim());
    } else if (line.startsWith("<h2>")) {
      answer = line
        .replace(/<\/?h2>/g, "")
        .replace(/^Answer:\s*/i, "")
        .trim();
    }
  }

  // Push the last one
  if (question) {
    quiz.push({ question, options, answer });
  }

  return quiz;
}

function getRotatedKey(): string {
  const now = new Date();
  const hour = now.getUTCHours(); // use UTC for consistency
  const index = hour % YOUTUBE_API_KEY.length;
  return YOUTUBE_API_KEY[index]!;
}

const apikey = getRotatedKey();

export async function fetchPlaylist({
  max,
  topic,
  apikey,
}: {
  max: string;
  topic: string;
  apikey: string;
}) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${topic}&type=playlist&key=${apikey}&maxResults=${max}`
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
  try {
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
  } catch (error) {
    console.log(error);
    return;
  }
};

export async function playlist(id: string) {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${id}&maxResults=3&key=${apikey}`
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
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          imageUrl,
        }),
        credentials: "include",
      }
    );
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
          content: `Generate 10 multiple-choice quiz questions for beginners learning only in english ${videoTitle}.
Format the response strictly in HTML:
- Use <h1> for each question
- Use <p> for each option (A, B, C, D)
- Use <h2> to show the correct answer (with both option letter and explanation)
Do not include any extra text, only HTML.
`,
        },
      ],
    }),
  });

  const data = await res.json();
  console.log("res", data);
  console.log("data", data?.choices?.[0]?.message?.content);
  const quizArray = parseQuizHtml(data?.choices?.[0]?.message?.content);
  console.log("quiz", quizArray);
  return quizArray;
};

export const chatBotApiCall = async ({ input }: { input: string }) => {
  console.log("input", input);
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-r1:free",
      stream: false,
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
    }),
  });

  const data = await res.json();
  console.log("data", data);
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
    const res = await fetch(
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
    const data = await res.json();
    if (data.appChapterHandler) {
      toast.success("chapter is complete", {
        hideProgressBar: true,
      });
    } else {
      toast.error("you need enrolled in course", {
        hideProgressBar: true,
      });
    }
  } else {
    const res = await fetch(
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
    const data = await res.json();
    if (data.removeChapterHandler) {
      toast.success("chapter is Incomplete", {
        hideProgressBar: true,
      });
    } else {
      toast.error("you need enrolled in course", {
        hideProgressBar: true,
      });
    }
  }
};

export const funtionForVideoDetail = async ({
  videoId,
}: {
  videoId: string;
}) => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apikey}`
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
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${id}&maxResults=200&key=${apikey}`
  );
  const data = await res.json();
  return data.items;
};
