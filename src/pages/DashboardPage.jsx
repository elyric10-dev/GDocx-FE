import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import { DocumentGridCard, DocumentListRow } from '../components/dashboard/DocumentCard'
import NewDocumentStrip from '../components/dashboard/NewDocumentStrip'
import ShareModal from '../components/ShareModal'
import { useAuth } from '../context/AuthContext'
import { documentService } from '../services/documentService'
import { importFileAsDocument } from '../utils/importDocument'

const FILTER_OPTIONS = [
  { value: 'all', label: 'All documents' },
  { value: 'owned', label: 'Owned by me' },
  { value: 'shared', label: 'Shared with me' },
]

const SORT_OPTIONS = [
  { value: 'recent', label: 'Last opened' },
  { value: 'name', label: 'Name' },
]

function sortDocuments(documents, sortBy) {
  const sorted = [...documents]
  if (sortBy === 'name') {
    sorted.sort((a, b) => a.title.localeCompare(b.title))
  } else {
    sorted.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
  }
  return sorted
}

function filterBySearch(documents, query) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return documents
  return documents.filter((doc) => doc.title.toLowerCase().includes(normalized))
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [ownedDocuments, setOwnedDocuments] = useState([])
  const [sharedDocuments, setSharedDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [shareDocument, setShareDocument] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [documentToDelete, setDocumentToDelete] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [viewMode, setViewMode] = useState('grid')
  const fileInputRef = useRef(null)

  const loadDocuments = useCallback(async () => {
    setError('')
    setLoading(true)

    async function fetchDocuments() {
      const [owned, shared] = await Promise.all([
        documentService.list(),
        documentService.listShared(),
      ])
      return { owned, shared }
    }

    try {
      let result
      try {
        result = await fetchDocuments()
      } catch (err) {
        if (err.response?.status === 503) {
          await new Promise((resolve) => window.setTimeout(resolve, 500))
          result = await fetchDocuments()
        } else {
          throw err
        }
      }
      setOwnedDocuments(result.owned)
      setSharedDocuments(result.shared)
    } catch (err) {
      if (err.response?.status === 401) return
      const message =
        err.response?.data?.detail || err.message || 'Failed to load documents'
      setError(typeof message === 'string' ? message : 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user?.id) return
    loadDocuments()
  }, [user?.id, loadDocuments])

  const displayedDocuments = useMemo(() => {
    let docs = []

    if (filter === 'owned') {
      docs = ownedDocuments.map((doc) => ({ ...doc, _variant: 'owned' }))
    } else if (filter === 'shared') {
      docs = sharedDocuments.map((doc) => ({ ...doc, _variant: 'shared' }))
    } else {
      docs = [
        ...ownedDocuments.map((doc) => ({ ...doc, _variant: 'owned' })),
        ...sharedDocuments.map((doc) => ({ ...doc, _variant: 'shared' })),
      ]
    }

    docs = filterBySearch(docs, search)
    docs = sortDocuments(docs, sortBy)
    return docs
  }, [ownedDocuments, sharedDocuments, filter, search, sortBy])

  async function handleCreateDocument(title = 'Untitled', contentJson) {
    setBusy(true)
    setError('')
    try {
      const document = await documentService.create(title, contentJson)
      navigate(`/documents/${document.id}`)
    } catch (err) {
      const message =
        err.response?.data?.detail || err.message || 'Failed to create document'
      setError(typeof message === 'string' ? message : 'Failed to create document')
    } finally {
      setBusy(false)
    }
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setBusy(true)
    setError('')

    try {
      const { title, contentJson } = await importFileAsDocument(file)
      const document = await documentService.create(title, contentJson)
      navigate(`/documents/${document.id}`)
    } catch (err) {
      const message =
        err.response?.data?.detail || err.message || 'Failed to import document'
      setError(typeof message === 'string' ? message : 'Failed to import document')
    } finally {
      setBusy(false)
    }
  }

  async function handleTemplate(template) {
    await handleCreateDocument(template.title, template.contentJson)
  }

  async function confirmDeleteDocument() {
    if (!documentToDelete) return

    setDeletingId(documentToDelete.id)
    setError('')

    try {
      await documentService.delete(documentToDelete.id)
      setOwnedDocuments((current) =>
        current.filter((item) => item.id !== documentToDelete.id),
      )
      setDocumentToDelete(null)
    } catch (err) {
      const message =
        err.response?.data?.detail || err.message || 'Failed to delete document'
      setError(typeof message === 'string' ? message : 'Failed to delete document')
    } finally {
      setDeletingId(null)
    }
  }

  function renderEmptyState() {
    if (search.trim()) {
      return (
        <div className="col-span-full py-20 text-center">
          <p className="text-[#5f6368]">No documents match &ldquo;{search}&rdquo;</p>
        </div>
      )
    }

    if (filter === 'shared') {
      return (
        <div className="col-span-full py-20 text-center">
          <p className="text-[#5f6368]">Nothing shared with you yet.</p>
        </div>
      )
    }

    return (
      <div className="col-span-full py-20 text-center">
        <p className="text-[#5f6368]">Your canvas is empty — start something new above.</p>
        <button
          type="button"
          onClick={() => handleCreateDocument()}
          disabled={busy}
          className="mt-4 text-sm font-medium text-[#1a73e8] hover:underline disabled:opacity-60"
        >
          Create a blank document
        </button>
      </div>
    )
  }

  return (
    <div className="dashboard-bg min-h-screen">
      <DashboardHeader search={search} onSearchChange={setSearch} />

      <NewDocumentStrip
        busy={busy}
        onBlank={() => handleCreateDocument()}
        onImport={handleImportClick}
        onTemplate={handleTemplate}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.docx,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        className="hidden"
      />

      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-base font-normal text-[#202124]">Recent documents</h2>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-[#dadce0] bg-white px-3 py-1.5 text-sm text-[#202124] outline-none focus:border-[#4285f4] focus:ring-2 focus:ring-[#4285f4]/20"
            >
              {FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="flex rounded-lg border border-[#dadce0] bg-white p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`rounded-md p-1.5 transition ${
                  viewMode === 'grid'
                    ? 'bg-[#e8f0fe] text-[#1a73e8]'
                    : 'text-[#5f6368] hover:bg-[#f1f3f4]'
                }`}
                aria-label="Grid view"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`rounded-md p-1.5 transition ${
                  viewMode === 'list'
                    ? 'bg-[#e8f0fe] text-[#1a73e8]'
                    : 'text-[#5f6368] hover:bg-[#f1f3f4]'
                }`}
                aria-label="List view"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                </svg>
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-[#dadce0] bg-white px-3 py-1.5 text-sm text-[#202124] outline-none focus:border-[#4285f4] focus:ring-2 focus:ring-[#4285f4]/20"
              aria-label="Sort documents"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleImportClick}
              disabled={busy}
              className="rounded-lg border border-[#dadce0] bg-white p-1.5 text-[#5f6368] transition hover:bg-[#f1f3f4] disabled:opacity-60"
              aria-label="Import file"
              title="Import file"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8h-4V4h-4zm-1 8v4h2v-4h2l-3-3-3 3h2zm4-6V4.5L18.5 8H14z" />
              </svg>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError('')}
              className="shrink-0 text-red-500 transition hover:text-red-700"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#4285f4] border-t-transparent" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {displayedDocuments.length === 0
              ? renderEmptyState()
              : displayedDocuments.map((document, index) => (
                  <DocumentGridCard
                    key={`${document._variant}-${document.id}`}
                    document={document}
                    variant={document._variant}
                    onShare={document._variant === 'owned' ? setShareDocument : undefined}
                    onDelete={document._variant === 'owned' ? setDocumentToDelete : undefined}
                    deletingId={deletingId}
                    style={{ animationDelay: `${index * 40}ms` }}
                  />
                ))}
          </div>
        ) : (
          <ul className="overflow-visible rounded-xl border border-[#dadce0] bg-white">
            {displayedDocuments.length === 0 ? (
              <li className="py-20 text-center text-[#5f6368]">
                {search.trim()
                  ? `No documents match "${search}"`
                  : filter === 'shared'
                    ? 'Nothing shared with you yet.'
                    : 'Your canvas is empty — start something new above.'}
              </li>
            ) : (
              displayedDocuments.map((document) => (
                <DocumentListRow
                  key={`${document._variant}-${document.id}`}
                  document={document}
                  variant={document._variant}
                  onShare={document._variant === 'owned' ? setShareDocument : undefined}
                  onDelete={document._variant === 'owned' ? setDocumentToDelete : undefined}
                  deletingId={deletingId}
                />
              ))
            )}
          </ul>
        )}
      </main>

      {shareDocument && (
        <ShareModal
          document={shareDocument}
          onClose={() => setShareDocument(null)}
          onShared={loadDocuments}
        />
      )}

      <ConfirmDialog
        open={Boolean(documentToDelete)}
        title="Delete document?"
        message={
          documentToDelete
            ? `"${documentToDelete.title}" will be permanently deleted.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={Boolean(deletingId)}
        onConfirm={confirmDeleteDocument}
        onCancel={() => {
          if (!deletingId) setDocumentToDelete(null)
        }}
      />
    </div>
  )
}
