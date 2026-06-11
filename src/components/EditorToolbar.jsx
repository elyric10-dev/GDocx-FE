import { useEditorState } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'
import ColorPickerMenu from './ColorPickerMenu'
import { HIGHLIGHT_COLORS, readImageAsDataUrl, TEXT_COLORS } from '../utils/editorExtensions'

function ToolbarButton({ onClick, isActive, disabled, title, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded-lg p-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
        isActive
          ? 'bg-[#e8f0fe] text-[#1a73e8] shadow-sm'
          : 'text-[#444746] hover:bg-[#f1f3f4]'
      } ${className}`}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-[#dadce0]" aria-hidden />
}

function FileMenu({ onDownload }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    window.document.addEventListener('mousedown', handleClickOutside)
    return () => window.document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const items = [
    { label: 'HTML', format: 'html' },
    { label: 'Plain text', format: 'txt' },
    { label: 'JSON', format: 'json' },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium text-[#202124] transition hover:bg-[#f1f3f4]"
      >
        <svg className="h-4 w-4 text-[#5f6368]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
        <svg className="h-3.5 w-3.5 text-[#5f6368]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M7 10l5 5 5-5H7z" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[160px] rounded-xl border border-[#dadce0] bg-white py-1 shadow-lg">
          {items.map((item) => (
            <button
              key={item.format}
              type="button"
              className="block w-full px-4 py-2 text-left text-sm text-[#202124] hover:bg-[#f1f3f4]"
              onClick={() => {
                onDownload(item.format)
                setOpen(false)
              }}
            >
              Download {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ImageInsertMenu({ editor }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const ref = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
        setError('')
      }
    }
    window.document.addEventListener('mousedown', handleClickOutside)
    return () => window.document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setError('')
    try {
      const src = await readImageAsDataUrl(file)
      editor.chain().focus().setImage({ src }).run()
      setOpen(false)
    } catch (err) {
      setError(err.message || 'Failed to insert image.')
    }
  }

  function handleInsertUrl(event) {
    event.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return

    editor.chain().focus().setImage({ src: trimmed }).run()
    setUrl('')
    setError('')
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        title="Insert image"
        className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm text-[#444746] transition hover:bg-[#f1f3f4]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <svg className="h-3 w-3 text-[#5f6368]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M7 10l5 5 5-5H7z" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border border-[#dadce0] bg-white p-3 shadow-lg">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[#202124] hover:bg-[#f1f3f4]"
          >
            <svg className="h-4 w-4 text-[#5f6368]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload image
          </button>

          <form onSubmit={handleInsertUrl} className="mt-2 border-t border-[#e8eaed] pt-2">
            <label htmlFor="image-url" className="mb-1 block text-xs font-medium text-[#5f6368]">
              Image URL
            </label>
            <div className="flex gap-1">
              <input
                id="image-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…"
                className="min-w-0 flex-1 rounded-lg border border-[#dadce0] px-2 py-1.5 text-xs outline-none focus:border-[#4285f4]"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#1a73e8] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[#1765cc]"
              >
                Add
              </button>
            </div>
          </form>

          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
      )}
    </div>
  )
}

function EditorToolbarContent({ editor, onDownload }) {
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
      textColor: currentEditor.getAttributes('textStyle').color || null,
      highlightColor: currentEditor.getAttributes('highlight').color || null,
    }),
  })

  if (!state) return null

  return (
    <div className="editor-toolbar flex flex-wrap items-center gap-0.5 rounded-2xl border border-[#dadce0]/80 bg-white/90 px-2 py-1.5 shadow-[0_2px_12px_rgba(60,64,67,0.1)] backdrop-blur-sm">
      <FileMenu onDownload={onDownload} />
      <ToolbarDivider />

      <ToolbarButton
        title="Undo"
        disabled={!state.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        title="Redo"
        disabled={!state.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
        </svg>
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton title="Bold" isActive={state.isBold} onClick={() => editor.chain().focus().toggleBold().run()}>
        <span className="text-sm font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton title="Italic" isActive={state.isItalic} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <span className="text-sm italic">I</span>
      </ToolbarButton>
      <ToolbarButton title="Underline" isActive={state.isUnderline} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <span className="text-sm underline">U</span>
      </ToolbarButton>
      <ToolbarButton title="Strikethrough" isActive={state.isStrike} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <span className="text-sm line-through">S</span>
      </ToolbarButton>

      <ColorPickerMenu
        label="Text color"
        historyKey="text"
        colors={TEXT_COLORS}
        activeColor={state.textColor}
        onSelect={(color) => {
          if (color) {
            editor.chain().focus().setColor(color).run()
          } else {
            editor.chain().focus().unsetColor().run()
          }
        }}
        icon={
          <span className="flex flex-col items-center leading-none">
            <span className="text-sm font-bold text-[#202124]">A</span>
            <span
              className="mt-0.5 h-1 w-4 rounded-full"
              style={{ backgroundColor: state.textColor || '#202124' }}
            />
          </span>
        }
      />
      <ColorPickerMenu
        label="Highlight color"
        historyKey="highlight"
        colors={HIGHLIGHT_COLORS}
        activeColor={state.highlightColor}
        onSelect={(color) => {
          if (color) {
            editor.chain().focus().setHighlight({ color }).run()
          } else {
            editor.chain().focus().unsetHighlight().run()
          }
        }}
        icon={
          <span
            className="flex h-5 w-5 items-center justify-center rounded text-xs font-bold"
            style={{ backgroundColor: state.highlightColor || '#fef9c3' }}
          >
            A
          </span>
        }
      />

      <ToolbarDivider />

      <ToolbarButton title="Heading 1" isActive={state.isH1} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        H1
      </ToolbarButton>
      <ToolbarButton title="Heading 2" isActive={state.isH2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </ToolbarButton>
      <ToolbarButton title="Heading 3" isActive={state.isH3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </ToolbarButton>
      <ToolbarButton
        title="Paragraph"
        isActive={!state.isH1 && !state.isH2 && !state.isH3 && !state.isCodeBlock}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        ¶
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton title="Bullet list" isActive={state.isBulletList} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
        </svg>
      </ToolbarButton>
      <ToolbarButton title="Numbered list" isActive={state.isOrderedList} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M2 17h2v.5H3v1h1v1.5H2V20h2v1H1v-4.5h1V17zm1-6h1.5L3 13h1l.75-2H5l.75 2h1l-1.5-2h1.5l.75 2 .75-2H11v1H9.5L9 14h1l-.75 2H8l-.75-2H6l-.75 2H4l.75-2H3.5L3 12H2v-1zm1-5h1v3H3V6zm2 0h1v3H5V6zm2 0h1v3H7V6zm3 0h8v2H10V6zm0 4h8v2h-8v-2zm0 4h8v2h-8v-2z" />
        </svg>
      </ToolbarButton>
      <ToolbarButton title="Blockquote" isActive={state.isBlockquote} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
        </svg>
      </ToolbarButton>
      <ToolbarButton title="Code block" isActive={state.isCodeBlock} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        {'</>'}
      </ToolbarButton>
      <ToolbarButton title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        ―
      </ToolbarButton>

      <ToolbarDivider />

      <ImageInsertMenu editor={editor} />
    </div>
  )
}

export default function EditorToolbar({ editor, onDownload }) {
  if (!editor) return null

  return (
    <div className="sticky top-[57px] z-30 border-b border-[#dadce0]/50 bg-[#f8f9fa]/80 px-4 py-3 backdrop-blur-sm">
      <div className="mx-auto flex justify-center">
        <EditorToolbarContent editor={editor} onDownload={onDownload} />
      </div>
    </div>
  )
}
