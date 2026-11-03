"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useEffect } from "react";
import { fetchMultipleTypeData } from "../utils/backendApiCalls";
import { useSession } from "next-auth/react";
import { redTheme } from "../utils/reusableConstant";
import { EditorPropType } from "@/types";

const Editor = ({ email, playlistId }: EditorPropType) => {
  const editor = useCreateBlockNote();
  const session = useSession();

  useEffect(() => {
    const fetchNote = async () => {
      const result = await fetchMultipleTypeData({
        email,
        playlistId,
        url: "/notes/getNote",
      });

      if (result.noteData?.content) {
        editor.replaceBlocks(editor.document, result.noteData?.content);
      }
    };

    fetchNote();
  }, [email, playlistId, editor]);

  const saveNote = async () => {
    try {
      const res = await fetch(
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
        },
      );
      if (!res.ok) {
        throw new Error("error " + res.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-120 md:h-full flex justify-center items-center rounded-4xl p-1">
      {session.status === "authenticated" ? (
        <BlockNoteView
          className="w-full editor-wrapper"
          editor={editor}
          theme={redTheme}
          onChange={saveNote}
        />
      ) : (
        <p className="text-center sm:text-xl text-md">
          After SignIn you can use notes editor
        </p>
      )}
    </div>
  );
};

export default Editor;
