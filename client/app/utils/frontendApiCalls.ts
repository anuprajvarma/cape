import { Groq } from "groq-sdk";
import youtubeApiKey, { parseQuizHtml } from "./reusableConstant";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const apikey = youtubeApiKey();

export const fetchPlaylists = async ({
  max,
  topic,
}: {
  max: string;
  topic: string;
}) => {
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
};

export const fetchfirstVideoIdOfPlaylist = async (
  id: string | undefined | string[],
) => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${id}&maxResults=3&key=${apikey}`,
  );
  if (!res.ok) {
    throw new Error(` error: ${res.status}`);
  }
  const data = await res.json();
  return data.items[0].snippet?.resourceId.videoId;
};

export const fetchQuizzes = async ({ videoTitle }: { videoTitle: string }) => {
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
    if (!quizArray) {
      throw new Error("No quizArray received from Groq");
    }
    console.log("quiz", quizArray);
    return quizArray;
  } catch (error) {
    console.log(error);
  }
};

export const fetchChatbotAnswer = async ({ input }: { input: string }) => {
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

export const fetchVideoDetail = async ({ videoId }: { videoId: string }) => {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apikey}`,
    );
    if (!res.ok) {
      throw new Error(` error: ${res.status}`);
    }
    const data = await res.json();
    return data.items;
  } catch (error) {
    console.log(error);
  }
};

export const fetchPlaylistVideos = async ({ id }: { id: string }) => {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${id}&maxResults=200&key=${apikey}`,
    );
    if (!res.ok) {
      throw new Error(` error: ${res.status}`);
    }
    const data = await res.json();
    return data.items;
  } catch (error) {
    console.log(error);
  }
};
