import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import DocumentEditor from '../components/DocumentEditor'
import EditorHeader from '../components/EditorHeader'
import EditorMenuBar from '../components/EditorMenuBar'
import EditorToolbar from '../components/EditorToolbar'
import ShareModal from '../components/ShareModal'
import { useAuth } from '../context/AuthContext'
import { documentService } from '../services/documentService'
import { downloadDocument } from '../utils/downloadDocument'

const AUTOSAVE_INTERVAL_MS = 3000

export default function EditorPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [contentJson, setContentJson] = useState(null)
  const [ownerId, setOwnerId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saveState, setSaveState] = useState('saved')
  const [editor, setEditor] = useState(null)
  const [shareOpen, setShareOpen] = useState(false)

  const titleRef = useRef('')
  const contentRef = useRef(null)
  const dirtyRef = useRef(false)
  const savingRef = useRef(false)

  const isOwner = ownerId && user?.id === ownerId

  const markDirty = useCallback(() => {
    dirtyRef.current = true
    setSaveState('unsaved')
  }, [])

  const saveDocument = useCallback(async () => {
    if (!dirtyRef.current || savingRef.current) return

    savingRef.current = true
    setSaveState('saving')

    try {
      await documentService.update(id, {
        title: titleRef.current,
        contentJson: contentRef.current,
      })
      dirtyRef.current = false
      setSaveState('saved')
    } catch (err) {
      const message =
        err.response?.data?.detail || err.message || 'Failed to save document'
      setError(typeof message === 'string' ? message : 'Failed to save document')
      setSaveState('error')
    } finally {
      savingRef.current = false
    }
  }, [id])

  useEffect(() => {
    let cancelled = false

    async function loadDocument() {
      setLoading(true)
      setError('')
      try {
        const document = await documentService.get(id)
        if (cancelled) return

        titleRef.current = document.title
        contentRef.current = document.content_json
        setTitle(document.title)
        setContentJson(document.content_json)
        setOwnerId(document.owner_id)
        dirtyRef.current = false
        setSaveState('saved')
      } catch (err) {
        if (cancelled) return
        const message =
          err.response?.data?.detail || err.message || 'Failed to load document'
        setError(typeof message === 'string' ? message : 'Failed to load document')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDocument()
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      saveDocument()
    }, AUTOSAVE_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [saveDocument])

  const handleEditorReady = useCallback((editorInstance) => {
    setEditor(editorInstance)
  }, [])

  function handleTitleChange(event) {
    const nextTitle = event.target.value
    titleRef.current = nextTitle
    setTitle(nextTitle)
    markDirty()
  }

  function handleContentChange(nextContent) {
    contentRef.current = nextContent
    setContentJson(nextContent)
    markDirty()
  }

  function handleDownload(format) {
    if (!contentRef.current) return
    downloadDocument(titleRef.current || 'Untitled', contentRef.current, format)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a73e8] border-t-transparent" />
      </div>
    )
  }

  if (error && !contentJson) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] p-8">
        <div className="mx-auto max-w-lg rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa]">
      <EditorHeader
        title={title}
        onTitleChange={handleTitleChange}
        saveState={saveState}
        isOwner={isOwner}
        onShare={() => setShareOpen(true)}
      />

      <EditorMenuBar editor={editor} onDownload={handleDownload} />

      {editor && <EditorToolbar editor={editor} />}

      {error && (
        <div className="mx-4 mt-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <main className="flex-1 overflow-auto px-4 pb-12 pt-2">
        <div className="mx-auto max-w-[816px] bg-white shadow-[0_1px_3px_rgba(60,64,67,0.15)]">
          <div className="px-12 py-10">
            <DocumentEditor
              content={contentJson}
              onChange={handleContentChange}
              onEditorReady={handleEditorReady}
            />
          </div>
        </div>
      </main>

      {shareOpen && (
        <ShareModal
          document={{ id, title }}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  )
}
