import { useEditorState } from '@tiptap/react'

function ToolbarButton({ onClick, isActive, disabled, title, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded p-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
        isActive
          ? 'bg-[#c2e7ff] text-[#001d35]'
          : 'text-[#444746] hover:bg-[#e8eaed]'
      } ${className}`}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="mx-0.5 h-6 w-px bg-[#dadce0]" aria-hidden="true" />
}

function EditorToolbarContent({ editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => ({
      isBold: currentEditor.isActive('bold'),
      isItalic: currentEditor.isActive('italic'),
      isStrike: currentEditor.isActive('strike'),
      isUnderline: currentEditor.isActive('underline'),
      isH1: currentEditor.isActive('heading', { level: 1 }),
      isH2: currentEditor.isActive('heading', { level: 2 }),
      isH3: currentEditor.isActive('heading', { level: 3 }),
      isBulletList: currentEditor.isActive('bulletList'),
      isOrderedList: currentEditor.isActive('orderedList'),
      isBlockquote: currentEditor.isActive('blockquote'),
      isCodeBlock: currentEditor.isActive('codeBlock'),
      canUndo: currentEditor.can().chain().focus().undo().run(),
      canRedo: currentEditor.can().chain().focus().redo().run(),
    }),
  })

  if (!state) return null

  return (
    <div className="mx-3 my-2 flex flex-wrap items-center gap-0.5 rounded-full border border-[#dadce0] bg-white px-3 py-1.5 shadow-sm">
      <ToolbarButton
        title="Undo"
        disabled={!state.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
      >
        ↶
      </ToolbarButton>
      <ToolbarButton
        title="Redo"
        disabled={!state.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
      >
        ↷
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Bold"
        isActive={state.isBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        isActive={state.isItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        title="Underline"
        isActive={state.isUnderline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className="underline">U</span>
      </ToolbarButton>
      <ToolbarButton
        title="Strikethrough"
        isActive={state.isStrike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <span className="line-through">S</span>
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Heading 1"
        isActive={state.isH1}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        title="Heading 2"
        isActive={state.isH2}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        title="Heading 3"
        isActive={state.isH3}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>
      <ToolbarButton
        title="Paragraph"
        isActive={!state.isH1 && !state.isH2 && !state.isH3 && !state.isCodeBlock}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        P
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Bullet list"
        isActive={state.isBulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        •
      </ToolbarButton>
      <ToolbarButton
        title="Numbered list"
        isActive={state.isOrderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.
      </ToolbarButton>
      <ToolbarButton
        title="Blockquote"
        isActive={state.isBlockquote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        "
      </ToolbarButton>
      <ToolbarButton
        title="Code block"
        isActive={state.isCodeBlock}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        {'</>'}
      </ToolbarButton>
      <ToolbarButton
        title="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        ―
      </ToolbarButton>
    </div>
  )
}

export default function EditorToolbar({ editor }) {
  if (!editor) return null
  return <EditorToolbarContent editor={editor} />
}
