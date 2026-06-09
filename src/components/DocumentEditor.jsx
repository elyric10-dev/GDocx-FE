import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import { editorExtensions } from '../utils/downloadDocument'

export default function DocumentEditor({ content, onChange, onEditorReady }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: editorExtensions,
    content,
    editorProps: {
      attributes: {
        class: 'document-editor-content min-h-[70vh] outline-none focus:outline-none',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getJSON())
    },
  })

  useEffect(() => {
    if (editor) {
      onEditorReady?.(editor)
    }
  }, [editor, onEditorReady])

  useEffect(() => {
    if (!editor || content === undefined) return

    const current = editor.getJSON()
    if (JSON.stringify(current) !== JSON.stringify(content)) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [editor, content])

  if (!editor) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a73e8] border-t-transparent" />
      </div>
    )
  }

  return <EditorContent editor={editor} />
}
