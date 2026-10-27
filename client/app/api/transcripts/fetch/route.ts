import { NextRequest, NextResponse } from "next/server";
import { fetchTranscript } from "youtube-transcript";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { videoId } = await req.json();

    if (typeof videoId !== "string" || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return NextResponse.json(
        { error: "Invalid YouTube video ID" },
        { status: 400 },
      );
    }

    const transcript = await fetchTranscript(videoId, {
      lang: "en",
    });

    const segments = transcript.map((item) => ({
      text: item.text,
      start: item.offset,
      end: item.offset + item.duration,
    }));

    return NextResponse.json({
      videoId,
      segments,
    });
  } catch (error) {
    console.error("Transcript fetch failed:", error);

    return NextResponse.json(
      {
        error:
          "Could not fetch transcript. Captions may be unavailable, or YouTube may be blocking the request.",
      },
      { status: 502 },
    );
  }
}
