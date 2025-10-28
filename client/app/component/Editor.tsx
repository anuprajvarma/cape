"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import {
  BlockNoteView,
  darkDefaultTheme,
  lightDefaultTheme,
  Theme,
} from "@blocknote/mantine";
import { useEffect } from "react";
import { editorDataFetch } from "../utils/apiCalls";
import { useSession } from "next-auth/react";

const lightRedTheme = {
  colors: {
    editor: {
      text: "#222222",
      background: "#101827",
    },
    menu: {
      text: "#ffffff",
      background: "#ffedd5",
    },
    tooltip: {
      text: "#ffffff",
      background: "#ffedd5",
    },
    hovered: {
      text: "#ffffff",
      background: "#ffedd5",
    },
    selected: {
      text: "#ffffff",
      background: "#ffedd5",
    },
    disabled: {
      text: "#9b0000",
      background: "#ffedd5",
    },
    shadow: "#640000",
    border: "#870000",
    sideMenu: "#bababa",
    highlights: lightDefaultTheme.colors!.highlights,
  },
  borderRadius: 4,
  fontFamily: "Helvetica Neue, sans-serif",
} satisfies Theme;

const darkRedTheme = {
  colors: {
    editor: {
      text: "#D1D5DB",
      background: "#101827",
    },
    menu: {
      text: "#D1D5DB",
      background: "#1F2937",
    },
    tooltip: {
      text: "#D1D5DB",
      background: "#1F2937",
    },
    hovered: {
      text: "#D1D5DB",
      background: "#1F2937",
    },
    selected: {
      text: "#D1D5DB",
      background: "#1F2937",
    },
    disabled: {
      text: "#D1D5DB",
      background: "#1F2937",
    },
    shadow: "#374151",
    border: "#374151",
    sideMenu: "#bababa",
    highlights: darkDefaultTheme.colors!.highlights,
  },
  borderRadius: 4,
  fontFamily: "Helvetica Neue, sans-serif",
} satisfies Theme;

const redTheme = {
  light: lightRedTheme,
  dark: darkRedTheme,
};

export default function Editor({
  email,
  playlistId,
}: {
  email: string;
  playlistId: string;
}) {
  const editor = useCreateBlockNote();
  const session = useSession();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const result = await editorDataFetch({ email, playlistId });

        if (result) {
          editor.replaceBlocks(editor.document, result);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchNote();
  }, [email, playlistId, editor]);

  const saveNote = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/notes/addNote`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          playlistId,
          content: editor.document,
        }),
        credentials: "include",
      }
    );
  };

  return (
    <div className="h-full w-full sm:p-12">
      {session.status === "authenticated" ? (
        <BlockNoteView
          className="h-full w-full"
          editor={editor}
          theme={redTheme}
          onChange={saveNote}
        />
      ) : (
        <p className="w-full text-center">
          After SignIn you can use notes editor
        </p>
      )}
    </div>
  );
}
