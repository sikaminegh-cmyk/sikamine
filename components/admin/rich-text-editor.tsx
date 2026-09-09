"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Link2, Heading2, Heading3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "rich-text min-h-[160px] px-3.5 py-3 text-sm focus:outline-none",
        "data-placeholder": placeholder ?? "",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const toolbarBtn = (active: boolean) =>
    cn("rounded-md p-1.5 text-text-grey hover:bg-black/5 hover:text-navy", active && "bg-navy/10 text-navy");

  return (
    <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
      <div className="flex flex-wrap gap-1 border-b border-black/10 bg-bg-alt px-2 py-1.5">
        <button type="button" className={toolbarBtn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()} aria-label="Bold">
          <Bold size={15} />
        </button>
        <button type="button" className={toolbarBtn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()} aria-label="Italic">
          <Italic size={15} />
        </button>
        <button type="button" className={toolbarBtn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} aria-label="Heading 2">
          <Heading2 size={15} />
        </button>
        <button type="button" className={toolbarBtn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} aria-label="Heading 3">
          <Heading3 size={15} />
        </button>
        <button type="button" className={toolbarBtn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()} aria-label="Bullet list">
          <List size={15} />
        </button>
        <button type="button" className={toolbarBtn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()} aria-label="Numbered list">
          <ListOrdered size={15} />
        </button>
        <button
          type="button"
          className={toolbarBtn(editor.isActive("link"))}
          onClick={() => {
            const url = window.prompt("Link URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
            else editor.chain().focus().unsetLink().run();
          }}
          aria-label="Link"
        >
          <Link2 size={15} />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
