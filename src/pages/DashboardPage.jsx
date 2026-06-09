import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import { documentService } from '../services/documentService'

function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)

  const loadDocuments = useCallback(async () => {
    setError('')
    try {
      const data = await documentService.list()
      setDocuments(data)
    } catch (err) {
      const message =
        err.response?.data?.detail || err.message || 'Failed to load documents'
      setError(typeof message === 'string' ? message : 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

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
            <p className="mt-1 text-sm text-slate-600">Create, edit, and manage your documents.</p>
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

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Owned documents
            </h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center px-6 py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
          ) : documents.length === 0 ? (
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
          ) : (
            <ul className="divide-y divide-slate-200">
              {documents.map((document) => (
                <li key={document.id}>
                  <Link
                    to={`/documents/${document.id}`}
                    className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{document.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Updated {formatDate(document.updated_at)}
                      </p>
                    </div>
                    <span className="text-sm text-indigo-600">Open</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
