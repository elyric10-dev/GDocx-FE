import { useEffect, useRef } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import { TextSelection } from '@tiptap/pm/state'
import {
  editorExtensions,
  insertImageFromClipboard,
  insertImageFromDrop,
  migrateImageNodes,
} from '../utils/editorExtensions'

export default function DocumentEditor({ documentId, content, onChange, onEditorReady }) {
  const hasResetSelection = useRef(false)

  useEffect(() => {
    hasResetSelection.current = false
  }, [documentId])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: editorExtensions,
    content: migrateImageNodes(content),
    editorProps: {
      attributes: {
        class: 'document-editor-content min-h-[70vh] outline-none focus:outline-none',
      },
    },
    onCreate: ({ editor: createdEditor }) => {
      requestAnimationFrame(() => {
        resetEditorSelection(createdEditor)
        hasResetSelection.current = true
      })
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getJSON())
    },
  })

  useEffect(() => {
    if (!editor) return

    const pasteHandler = (event) => {
      if (insertImageFromClipboard(editor, event.clipboardData)) {
        event.preventDefault()
      }
    }

    const dragOverHandler = (event) => {
      if ([...event.dataTransfer.types].includes('Files')) {
        event.preventDefault()
      }
    }

    const dropHandler = (event) => {
      if (!insertImageFromDrop(editor, event.dataTransfer)) return
      event.preventDefault()
    }

    const dom = editor.view.dom
    dom.addEventListener('paste', pasteHandler)
    dom.addEventListener('dragover', dragOverHandler)
    dom.addEventListener('drop', dropHandler)

    return () => {
      dom.removeEventListener('paste', pasteHandler)
      dom.removeEventListener('dragover', dragOverHandler)
      dom.removeEventListener('drop', dropHandler)
    }
  }, [editor])

  useEffect(() => {
    if (editor) {
      onEditorReady?.(editor)
    }
  }, [editor, onEditorReady])

  useEffect(() => {
    if (!editor || content === undefined) return

    const migrated = migrateImageNodes(content)
    const current = editor.getJSON()
    if (JSON.stringify(current) !== JSON.stringify(migrated)) {
      editor.commands.setContent(migrated, { emitUpdate: false })
      if (!hasResetSelection.current) {
        requestAnimationFrame(() => {
          resetEditorSelection(editor)
          hasResetSelection.current = true
        })
      }
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

function resetEditorSelection(editor) {
  const { doc } = editor.state
  const textPos = findFirstTextPosition(doc)
  editor.view.dispatch(
    editor.state.tr
      .setSelection(TextSelection.create(doc, textPos))
      .setMeta('preventScroll', true),
  )
  editor.view.dom.blur()
}

function findFirstTextPosition(doc) {
  let pos = 0
  let found = false

  doc.descendants((node, nodePos) => {
    if (found) return false
    if (node.isTextblock) {
      pos = nodePos + 1
      found = true
      return false
    }
  })

  if (found) return pos

  // Fallback: end of document (e.g. image-only docs)
  return Math.max(0, doc.content.size)
}
