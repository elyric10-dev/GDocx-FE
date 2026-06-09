import { useCallback, useEffect, useState } from 'react'
import { documentService } from '../services/documentService'

export default function ShareModal({ document, onClose, onShared }) {
  const [users, setUsers] = useState([])
  const [shares, setShares] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [removingUserId, setRemovingUserId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [shareUsers, documentShares] = await Promise.all([
        documentService.listShareUsers(),
        documentService.listDocumentShares(document.id),
      ])
      setUsers(shareUsers)
      setShares(documentShares)

      const sharedUserIds = new Set(documentShares.map((share) => share.user_id))
      const availableUsers = shareUsers.filter((user) => !sharedUserIds.has(user.id))
      setSelectedUserId(availableUsers[0]?.id || '')
    } catch (err) {
      const message =
        err.response?.data?.detail || err.message || 'Failed to load sharing options'
      setError(typeof message === 'string' ? message : 'Failed to load sharing options')
    } finally {
      setLoading(false)
    }
  }, [document.id])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!selectedUserId) return

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await documentService.share(document.id, selectedUserId)
      setSuccess('Document shared successfully.')
      await loadData()
      onShared?.()
    } catch (err) {
      const message =
        err.response?.data?.detail || err.message || 'Failed to share document'
      setError(typeof message === 'string' ? message : 'Failed to share document')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRemoveShare(userId) {
    setRemovingUserId(userId)
    setError('')
    setSuccess('')

    try {
      await documentService.unshare(document.id, userId)
      setSuccess('Share removed.')
      await loadData()
      onShared?.()
    } catch (err) {
      const message =
        err.response?.data?.detail || err.message || 'Failed to remove share'
      setError(typeof message === 'string' ? message : 'Failed to remove share')
    } finally {
      setRemovingUserId(null)
    }
  }

  const sharedUserIds = new Set(shares.map((share) => share.user_id))
  const availableUsers = users.filter((user) => !sharedUserIds.has(user.id))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Share document</h2>
            <p className="mt-1 text-sm text-slate-600">{document.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h3 className="mb-2 text-sm font-medium text-slate-700">Shared with</h3>
              {shares.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500">
                  Not shared with anyone yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {shares.map((share) => (
                    <li
                      key={share.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                    >
                      <span className="truncate text-sm text-slate-800">{share.user_email}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveShare(share.user_id)}
                        disabled={removingUserId === share.user_id}
                        className="rounded-md px-2 py-1 text-sm text-slate-500 transition hover:bg-white hover:text-red-600 disabled:opacity-50"
                        aria-label={`Remove share for ${share.user_email}`}
                        title="Remove access"
                      >
                        {removingUserId === share.user_id ? '…' : '✕'}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {availableUsers.length === 0 ? (
              <p className="text-sm text-slate-600">All available users already have access.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="share-user" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Share with
                  </label>
                  <select
                    id="share-user"
                    value={selectedUserId}
                    onChange={(event) => setSelectedUserId(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {availableUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.email}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !selectedUserId}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Sharing…' : 'Share'}
                </button>
              </form>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
