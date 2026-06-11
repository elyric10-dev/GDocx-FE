import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { extractPreviewLines, formatOpenedDate } from '../../utils/documentPreview'

function DocumentPreview({ title }) {
  const lines = extractPreviewLines(title)

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f8f9fa] p-4">
      <div className="relative mx-auto mt-2 h-[calc(100%-0.5rem)] max-w-[85%] rounded-t-sm border border-[#e8eaed] bg-white">
        <div className="border-b border-[#e8eaed] px-3 py-2">
          <p className="truncate text-[10px] font-semibold text-[#202124]">{lines[0]}</p>
        </div>
        <div className="space-y-1.5 px-3 py-2.5">
          <div className="h-1 w-full rounded-full bg-[#e8eaed]" />
          <div className="h-1 w-11/12 rounded-full bg-[#e8eaed]" />
          <div className="h-1 w-4/5 rounded-full bg-[#e8eaed]" />
          <div className="h-1 w-full rounded-full bg-[#f1f3f4]" />
        </div>
      </div>
    </div>
  )
}

function DocumentMenu({ doc, isOwned, onShare, onDelete, deleting }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    window.document.addEventListener('mousedown', handleClickOutside)
    return () => window.document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen((value) => !value)
        }}
        className="rounded-full p-1.5 text-[#5f6368] opacity-0 transition hover:bg-[#f1f3f4] group-hover:opacity-100 data-[open=true]:opacity-100"
        data-open={open}
        aria-label="Document options"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-[#dadce0] bg-white py-1 shadow-lg">
          {isOwned && onShare && (
            <button
              type="button"
              className="block w-full px-4 py-2 text-left text-sm text-[#202124] hover:bg-[#f1f3f4]"
              onClick={() => {
                setOpen(false)
                onShare(doc)
              }}
            >
              Share
            </button>
          )}
          {isOwned && onDelete && (
            <button
              type="button"
              disabled={deleting}
              className="block w-full px-4 py-2 text-left text-sm text-[#d93025] hover:bg-red-50 disabled:opacity-60"
              onClick={() => {
                setOpen(false)
                onDelete(doc)
              }}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function DocumentGridCard({ document, variant, onShare, onDelete, deletingId, style }) {
  const isOwned = variant === 'owned'
  const isShared = variant === 'shared'

  return (
    <article
      className="group dashboard-card-enter relative z-0 flex flex-col has-[[data-open=true]]:z-50"
      style={style}
    >
      <div className="relative flex flex-col rounded-xl border border-[#dadce0] bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#c4c7c5] hover:shadow-md">
        <Link to={`/documents/${document.id}`} className="block">
          <div className="relative h-[140px] overflow-hidden rounded-t-xl">
            <DocumentPreview title={document.title} />
            {isShared && (
              <span className="absolute right-2 top-2 rounded-full bg-violet-600/90 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm">
                Shared
              </span>
            )}
            {!isShared && document.share_count > 0 && (
              <span className="absolute right-2 top-2 rounded-full bg-emerald-600/90 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm">
                {document.share_count} shared
              </span>
            )}
          </div>

          <div className="flex items-start gap-2 border-t border-[#e8eaed] px-3 py-2.5 pr-10">
            <svg className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#4285f4]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z" />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#202124]">{document.title}</p>
              <p className="mt-0.5 truncate text-xs text-[#5f6368]">
                {isShared && document.owner_email
                  ? `${document.owner_email} · `
                  : ''}
                Opened {formatOpenedDate(document.updated_at)}
              </p>
            </div>
          </div>
        </Link>

        <div className="absolute bottom-2 right-1.5 z-10">
          <DocumentMenu
            doc={document}
            isOwned={isOwned}
            onShare={onShare}
            onDelete={onDelete}
            deleting={deletingId === document.id}
          />
        </div>
      </div>
    </article>
  )
}

export function DocumentListRow({ document, variant, onShare, onDelete, deletingId }) {
  const isOwned = variant === 'owned'
  const isShared = variant === 'shared'

  return (
    <li className="group flex items-center gap-4 border-b border-[#e8eaed] px-2 py-3 transition hover:bg-[#f8f9fa]">
      <Link to={`/documents/${document.id}`} className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#e8eaed] bg-[#f8f9fa]">
          <svg className="h-5 w-5 text-[#4285f4]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z" />
          </svg>
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-medium text-[#202124]">{document.title}</p>
            {isShared && (
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                Shared with me
              </span>
            )}
            {!isShared && document.share_count > 0 && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                Shared · {document.share_count}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-[#5f6368]">
            {isShared && document.owner_email ? `${document.owner_email} · ` : ''}
            Opened {formatOpenedDate(document.updated_at)}
          </p>
        </div>
      </Link>
      <DocumentMenu
        doc={document}
        isOwned={isOwned}
        onShare={onShare}
        onDelete={onDelete}
        deleting={deletingId === document.id}
      />
    </li>
  )
}
