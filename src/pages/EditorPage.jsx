import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import DocumentEditor from '../components/DocumentEditor'
import { documentService } from '../services/documentService'

const AUTOSAVE_INTERVAL_MS = 3000

export default function EditorPage() {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [contentJson, setContentJson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saveState, setSaveState] = useState('saved')

  const titleRef = useRef('')
  const contentRef = useRef(null)
  const dirtyRef = useRef(false)
  const savingRef = useRef(false)

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  if (error && !contentJson) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AppHeader>
          <Link to="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            Back to dashboard
          </Link>
        </AppHeader>
        <main className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </main>
      </div>
    )
  }

  const saveLabel =
    saveState === 'saving'
      ? 'Saving…'
      : saveState === 'unsaved'
        ? 'Unsaved changes'
        : saveState === 'error'
          ? 'Save failed'
          : 'All changes saved'

  return (
    <div className="min-h-screen bg-slate-100">
      <AppHeader>
        <Link to="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          Dashboard
        </Link>
        <span className="text-sm text-slate-500">{saveLabel}</span>
      </AppHeader>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-8 py-6">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Untitled document"
              className="w-full border-0 bg-transparent text-3xl font-bold text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <DocumentEditor content={contentJson} onChange={handleContentChange} />
        </div>
      </main>
    </div>
  )
}
