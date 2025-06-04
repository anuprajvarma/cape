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

const lightRedTheme = {
  colors: {
    editor: {
      text: "#222222",
      background: "#ffedd5",
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
      background: "#1F2937",
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
  //   const [blocks, setBlocks] = useState<Block[] | null>(null);

  const editor = useCreateBlockNote();

  // Fetch note on mount
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch("http://localhost:5002/api/notes/getNote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, playlistId }),
          credentials: "include",
        });

        const data = await res.json();
        console.log("Fetched content:", data.noteData?.content);

        if (data.noteData?.content) {
          //   setBlocks(data.noteData.content);
          editor.replaceBlocks(editor.document, data.noteData.content); // ✅ correct usage
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchNote();
  }, [email, playlistId, editor]);

  // Save note
  const saveNote = async () => {
    await fetch("http://localhost:5002/api/notes/addNote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        playlistId,
        content: editor.document, // Save latest content
      }),
      credentials: "include",
    });
  };

  return (
    <div className="h-[40rem] w-full sm:p-12">
      <BlockNoteView
        className="h-full w-full"
        editor={editor}
        theme={redTheme}
        onChange={saveNote}
      />
    </div>
  );
}
