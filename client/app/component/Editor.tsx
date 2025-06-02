"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useEffect } from "react";

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
    <div className="flex flex-col gap-2">
      <BlockNoteView
        editor={editor}
        onChange={() => {
          saveNote();
        }}
      />
      {/* <button onClick={saveNote}>Save</button> */}
    </div>
  );
}
