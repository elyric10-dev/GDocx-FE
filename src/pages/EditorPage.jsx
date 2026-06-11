import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import DocumentEditor from '../components/DocumentEditor'
import EditorHeader from '../components/EditorHeader'
import EditorToolbar from '../components/EditorToolbar'
import ImageWrapToolbar from '../components/ImageWrapToolbar'
import ShareModal from '../components/ShareModal'
import LoadingSpinner from '../components/ui/LoadingSpinner'
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-[#5f6368]">Opening document…</p>
        </div>
      </div>
    )
  }

  if (error && !contentJson) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white px-6 py-5 text-center shadow-sm">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <EditorHeader
        title={title}
        onTitleChange={handleTitleChange}
        saveState={saveState}
        isOwner={isOwner}
        onShare={() => setShareOpen(true)}
      />

      {editor && <EditorToolbar editor={editor} onDownload={handleDownload} />}
      {editor && <ImageWrapToolbar editor={editor} />}

      {error && (
        <div className="mx-auto mt-3 max-w-[816px] px-4">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {error}
          </div>
        </div>
      )}

      <main className="flex-1 overflow-auto px-4 pb-16 pt-6">
        <div className="editor-canvas-enter mx-auto max-w-[816px]">
          <div className="editor-canvas-enter overflow-hidden rounded-lg border border-[#dadce0] bg-white shadow-sm">
            <div className="editor-page relative px-8 py-10 sm:px-14 sm:py-12">
              <DocumentEditor
                documentId={id}
                content={contentJson}
                onChange={handleContentChange}
                onEditorReady={handleEditorReady}
              />
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-[#80868b]">
            Changes save automatically every few seconds
          </p>
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
