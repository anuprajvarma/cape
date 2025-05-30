// components/Editor.jsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function TiptapEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(json);
    },
  });

  return <EditorContent editor={editor} />;
}
