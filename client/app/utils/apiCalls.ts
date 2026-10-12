import { toast } from "react-toastify";
import { Groq } from "groq-sdk";
import getRotatedKey from "./reusableConstant";

const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api`;

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const apikey = getRotatedKey();

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

export async function fetchPlaylist({
  max,
  topic,
}: {
  max: string;
  topic: string;
}) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(topic)}&type=playlist&key=${apikey}&maxResults=${max}`,
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

export async function playlist(id: string | undefined | string[]) {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${id}&maxResults=3&key=${apikey}`,
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
  try {
    const res = await fetch(`${backendUrl}/notes/getNote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, playlistId }),
      credentials: "include",
    });

    const data = await res.json();
    return data.noteData?.content;
  } catch (error) {
    console.log(error);
  }
}

export async function enrolledCourseDataFetch({
  email,
  playlistId,
}: {
  email: string;
  playlistId: string;
}) {
  try {
    const res = await fetch(`${backendUrl}/enrolledCourse/getChapterData`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        playlistId: playlistId,
      }),
      credentials: "include",
    });
    const data = await res.json();
    return data.getChapterData?.chapters;
  } catch (error) {
    console.log(error);
  }
}

export async function enrolledCourseDelete({
  email,
  playlistId,
}: {
  email: string;
  playlistId: string;
}) {
  try {
    await fetch(`${backendUrl}/enrolledCourse/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        playlistId,
      }),
      credentials: "include",
    });
  } catch (error) {
    console.log(error);
  }
}

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

export const easyExplainFuntion = async ({
  videoTitle,
}: {
  videoTitle: string;
}) => {
  try {
    const res = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Generate 10 multiple-choice quiz questions for beginners learning only in english to coding related also don't include a,b,c,d or 1,2,3,4 in answer option and give numbers only to question ${videoTitle}.
    Format the response strictly in HTML:
    - Use <h1> for each question
    - Use <p> for each option (A, B, C, D)
    - Use <h2> to show the correct answer who picked by option currect answer same text from option don't include in option input put this seperate
    Do not include any extra text, only HTML.
    `,
        },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 1,
      max_completion_tokens: 2048,
      top_p: 1,
      reasoning_effort: "medium",
      stream: false,
    });

    const quizArray = parseQuizHtml(res?.choices?.[0]?.message?.content ?? "");
    console.log("quiz", quizArray);
    return quizArray;
  } catch (error) {
    console.log(error);
  }
};

export const chatBotApiCall = async ({ input }: { input: string }) => {
  try {
    console.log("input:", input);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 2,
      max_completion_tokens: 8192,
      top_p: 1,
      reasoning_effort: "medium",
      stream: false,
    });

    const choice = chatCompletion.choices[0];

    console.log("Finish reason:", choice?.finish_reason);
    console.log("Usage:", chatCompletion.usage);

    const content = choice?.message;

    if (!content) {
      throw new Error("No content received from Groq");
    }

    console.log("Full answer:", content);

    return content;
  } catch (error) {
    console.error("Groq API error:", error);
    throw error;
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

export const GPTDataFetchToMongoDB = async ({
  email,
  playlistId,
}: {
  email: string;
  playlistId: string;
}) => {
  try {
    const res = await fetch(`${backendUrl}/chat/getData`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        playlistId,
      }),
      credentials: "include",
    });
    const data = await res.json();
    return data.chatData?.chats;
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
      const res = await fetch(`${backendUrl}/enrolledCourse/addChapter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          playlistId,
          videoId,
        }),
        credentials: "include",
      });
      const data = await res.json();
      console.log("data " + data.appChapterHandler);
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
      const res = await fetch(`${backendUrl}/enrolledCourse/removeChapter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          playlistId,
          videoId,
        }),
        credentials: "include",
      });
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
    } catch (error) {
      console.log(error);
    }
  }
};

export const funtionForVideoDetail = async ({
  videoId,
}: {
  videoId: string;
}) => {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apikey}`,
    );
    const data = await res.json();
    return data.items;
  } catch (error) {
    console.log(error);
  }
};

export const fetchChapterData = async ({
  email,
  playlistId,
}: {
  email: string;
  playlistId: string;
}) => {
  try {
    const res = await fetch(`${backendUrl}/enrolledCourse/getChapterData`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        playlistId,
      }),
      credentials: "include",
    });
    const data = await res.json();
    return data.getChapterData?.chapters;
  } catch (error) {
    console.log(error);
  }
};

export const fetchPlayListVideos = async ({ id }: { id: string }) => {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${id}&maxResults=200&key=${apikey}`,
    );
    const data = await res.json();
    return data.items;
  } catch (error) {
    console.log(error);
  }
};
