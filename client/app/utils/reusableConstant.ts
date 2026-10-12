// export const backendCalls = async ({
//   email,
//   playlistId,
// }: {
//   email: string;
//   playlistId: string;
// }) => {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/chat/getData`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email,
//         playlistId,
//       }),
//       credentials: "include",
//     },
//   );
//     const data = await res.json();
// };

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

export default function getRotatedKey(): string {
  const now = new Date();
  const hour = now.getUTCHours(); // use UTC for consistency
  const index = hour % YOUTUBE_API_KEY.length;
  return YOUTUBE_API_KEY[index]!;
}

export const parseQuizHtml = (html: string) => {
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
};
