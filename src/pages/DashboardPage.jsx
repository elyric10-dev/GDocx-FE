import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import ShareModal from '../components/ShareModal'
import { useAuth } from '../context/AuthContext'
import { documentService } from '../services/documentService'

function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function DocumentIcon({ variant }) {
  if (variant === 'shared') {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    </div>
  )
}

function SharedCountBadge({ count }) {
  if (!count) return null

  const label = count === 1 ? 'Shared with 1 person' : `Shared with ${count} people`

  return (
    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 ring-inset">
      {label}
    </span>
  )
}

function DocumentList({ documents, emptyMessage, onShare, variant = 'owned' }) {
  const isShared = variant === 'shared'
  const rowAccent = isShared
    ? 'border-l-violet-500 hover:bg-violet-50/60'
    : 'border-l-indigo-500 hover:bg-indigo-50/40'

  if (documents.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-slate-600">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-slate-200">
      {documents.map((document) => (
        <li
          key={document.id}
          className={`flex items-center justify-between gap-4 border-l-4 px-6 py-4 transition ${rowAccent}`}
        >
          <Link to={`/documents/${document.id}`} className="flex min-w-0 flex-1 items-start gap-3 transition hover:opacity-80">
            <DocumentIcon variant={variant} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{document.title}</p>
                {!isShared && <SharedCountBadge count={document.share_count} />}
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {isShared && document.owner_email ? (
                  <>
                    <span className="font-medium text-violet-700">Owner: {document.owner_email}</span>
                    <span className="mx-1.5 text-slate-300">·</span>
                  </>
                ) : null}
                Updated {formatDate(document.updated_at)}
              </p>
            </div>
          </Link>
          {onShare && (
            <button
              type="button"
              onClick={() => onShare(document)}
              className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-white"
            >
              Share
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}

function DocumentSection({ title, description, variant, count, loading, children }) {
  const isShared = variant === 'shared'

  return (
    <section
      className={`overflow-hidden rounded-2xl border shadow-sm ${
        isShared
          ? 'border-violet-200 bg-gradient-to-b from-violet-50/80 to-white'
          : 'border-indigo-200 bg-gradient-to-b from-indigo-50/60 to-white'
      }`}
    >
      <div
        className={`border-b px-6 py-4 ${
          isShared ? 'border-violet-200 bg-violet-100/50' : 'border-indigo-200 bg-indigo-100/40'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3
              className={`text-sm font-semibold uppercase tracking-wide ${
                isShared ? 'text-violet-800' : 'text-indigo-800'
              }`}
            >
              {title}
            </h3>
            <p className="mt-0.5 text-sm text-slate-600">{description}</p>
          </div>
          {!loading && (
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                isShared ? 'bg-violet-200 text-violet-900' : 'bg-indigo-200 text-indigo-900'
              }`}
            >
              {count}
            </span>
          )}
        </div>
      </div>
      {children}
    </section>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [ownedDocuments, setOwnedDocuments] = useState([])
  const [sharedDocuments, setSharedDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [shareDocument, setShareDocument] = useState(null)

  const loadDocuments = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const [owned, shared] = await Promise.all([
        documentService.list(),
        documentService.listShared(),
      ])
      setOwnedDocuments(owned)
      setSharedDocuments(shared)
    } catch (err) {
      if (err.response?.status === 401) {
        return
      }
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

  async function handleCreateDocument() {
    setCreating(true)
    setError('')
    try {
      const document = await documentService.create()
      navigate(`/documents/${document.id}`)
    } catch (err) {
      const message =
        err.response?.data?.detail || err.message || 'Failed to create document'
      setError(typeof message === 'string' ? message : 'Failed to create document')
    } finally {
      setCreating(false)
    }
  }

  function handleShared() {
    loadDocuments()
  }

  function renderListContent(documents, emptyMessage, variant, onShare) {
    if (loading) {
      return (
        <div className="flex items-center justify-center px-6 py-16">
          <div
            className={`h-8 w-8 animate-spin rounded-full border-4 border-t-transparent ${
              variant === 'shared' ? 'border-violet-600' : 'border-indigo-600'
            }`}
          />
        </div>
      )
    }

    if (variant === 'owned' && documents.length === 0) {
      return (
        <div className="px-6 py-16 text-center">
          <p className="text-slate-600">No documents yet.</p>
          <button
            type="button"
            onClick={handleCreateDocument}
            disabled={creating}
            className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Create your first document
          </button>
        </div>
      )
    }

    return (
      <DocumentList
        documents={documents}
        emptyMessage={emptyMessage}
        onShare={onShare}
        variant={variant}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader>
        <Link to="/" className="text-lg font-semibold text-slate-900">
          GDocx
        </Link>
      </AppHeader>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Your documents</h2>
            <p className="mt-1 text-sm text-slate-600">Create, edit, and share your documents.</p>
          </div>
          <button
            type="button"
            onClick={handleCreateDocument}
            disabled={creating}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? 'Creating…' : 'New document'}
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-8">
          <DocumentSection
            title="Owned documents"
            description="Documents you created and can share with others."
            variant="owned"
            count={ownedDocuments.length}
            loading={loading}
          >
            {renderListContent(ownedDocuments, 'No documents yet.', 'owned', setShareDocument)}
          </DocumentSection>

          <DocumentSection
            title="Shared with me"
            description="Documents others have shared with you."
            variant="shared"
            count={sharedDocuments.length}
            loading={loading}
          >
            {renderListContent(
              sharedDocuments,
              'No documents have been shared with you yet.',
              'shared',
            )}
          </DocumentSection>
        </div>
      </main>

      {shareDocument && (
        <ShareModal
          document={shareDocument}
          onClose={() => setShareDocument(null)}
          onShared={handleShared}
        />
      )}
    </div>
  )
}
