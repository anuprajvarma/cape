import { Groq } from "groq-sdk";
import {
  parseQuizHtml,
  // TranscriptPeriod,
  youtubeApiKey,
} from "./reusableConstant";
import { FetchPlaylistsPropType } from "@/types";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const apikey = youtubeApiKey();

export const PlaylistLength = async ({
  id,
}: {
  id: string | string[] | undefined;
}) => {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=contentDetails&id=${id}&key=${apikey}`,
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchPlaylists = async ({
  max,
  topic,
}: FetchPlaylistsPropType) => {
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

// export const fetchChapters = async ({
//   transcript,
// }: {
//   transcript: TranscriptPeriod[];
// }) => {
//   console.log("transcript " + transcript);
//   try {
//     const res = await groq.chat.completions.create({
//       messages: [
//         {
//           role: "user",
//           content: `
// Here is the timestamped transcript:
// ${JSON.stringify(
//   transcript.map(({ start, end, text }) => ({
//     start: start / 1000,
//     end: end / 1000,
//     text,
//   })),
//   null,
//   2,
// )}

// Parse the supplied timestamped transcript and group related content into meaningful chapters covering the full duration from 0 to 620 seconds.

// Rules:
// - Use only the content and timestamps provided in the transcript.
// - Chapter start times must match actual transcript timestamps.
// - Chapter end times must match actual transcript timestamps, except the final chapter may end at exactly 620 seconds.
// - Chapters must be chronological and must not overlap.
// - Each chapter's end must equal the next chapter's start, ensuring continuous coverage without gaps.
// - The first chapter must start at 0 seconds.
// - The final chapter must end at exactly 620 seconds.
// - Combine adjacent transcript periods that discuss the same topic.
// - Create meaningful, specific titles and concise summaries based on the actual content.
// - Do not invent topics, details, or timestamps.
// - All timestamps must be numbers representing seconds.
// - If the transcript is empty or lacks sufficient content, return an empty chapters array rather than inventing chapters.

// Return ONLY valid JSON in this format:

// {
//   "chapters": [
//     {
//       "title": "Chapter title",
//       "start": 0,
//       "end": 60,
//       "summary": "Short summary of the content."
//     }
//   ]
// }
// `,
//         },
//       ],
//       model: "openai/gpt-oss-120b",
//       temperature: 1,
//       max_completion_tokens: 2048,
//       top_p: 1,
//       reasoning_effort: "medium",
//       stream: false,
//     });
//     const chapters = res?.choices?.[0]?.message ?? "";
//     if (!chapters) {
//       throw new Error("No chapters received from Groq");
//     }
//     console.log("chapters", chapters.content);
//     return chapters;
//   } catch (error) {
//     console.log(error);
//   }
// };

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
