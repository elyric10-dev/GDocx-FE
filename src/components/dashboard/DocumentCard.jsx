import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import GlassPanel from '../ui/GlassPanel'
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

function DocumentMenuAction({ icon, title, description, tone = 'default', disabled, onClick }) {
  const isDanger = tone === 'danger'

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-3 rounded-xl border border-transparent px-2.5 py-2 text-left transition disabled:cursor-not-allowed disabled:opacity-60',
        isDanger
          ? 'hover:border-red-100 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50'
          : 'hover:border-[#d2e3fc] hover:bg-gradient-to-r hover:from-[#e8f0fe] hover:to-[#f1f8ff]',
      )}
    >
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition',
          isDanger
            ? 'bg-[var(--gdocx-surface)] text-[var(--gdocx-text-secondary)] group-hover:bg-red-100 group-hover:text-[var(--gdocx-red)]'
            : 'bg-[#e8f0fe] text-[var(--gdocx-blue-dark)] group-hover:bg-[#d2e3fc]',
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span
          className={cn(
            'block text-sm font-medium',
            isDanger
              ? 'text-[var(--gdocx-text)] group-hover:text-[var(--gdocx-red)]'
              : 'text-[var(--gdocx-text)]',
          )}
        >
          {title}
        </span>
        {description && (
          <span className="block text-[11px] text-[var(--gdocx-text-muted)]">{description}</span>
        )}
      </span>
    </button>
  )
}

function DocumentMenu({ doc, canManage, onShare, onDelete, deleting, menuUp = false }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const showShare = canManage && onShare
  const showDelete = canManage && onDelete
  const hasActions = showShare || showDelete

  useEffect(() => {
    if (!hasActions) return undefined

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    window.document.addEventListener('mousedown', handleClickOutside)
    window.document.addEventListener('keydown', handleEscape)
    return () => {
      window.document.removeEventListener('mousedown', handleClickOutside)
      window.document.removeEventListener('keydown', handleEscape)
    }
  }, [hasActions])

  if (!hasActions) return null

  const menuPositionClass = menuUp ? 'bottom-full mb-2' : 'top-full mt-2'

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen((value) => !value)
        }}
        className={cn(
          'rounded-full p-1.5 text-[#5f6368] opacity-0 transition hover:bg-[#e8f0fe] hover:text-[var(--gdocx-blue-dark)] group-hover:opacity-100 data-[open=true]:opacity-100',
          open && 'bg-[#e8f0fe] text-[var(--gdocx-blue-dark)] opacity-100 ring-2 ring-[var(--gdocx-blue)]/25',
        )}
        data-open={open}
        aria-label="Document options"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>

      {open && (
        <GlassPanel
          role="menu"
          className={cn('absolute right-0 z-50 w-[232px]', menuPositionClass)}
        >
          <div className="relative overflow-hidden px-3 pb-1 pt-3">
            <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[var(--gdocx-blue)]/12 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-3 -left-3 h-14 w-14 rounded-full bg-[var(--gdocx-green)]/10 blur-2xl" />

            <div className="relative flex items-start gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e8f0fe] text-[var(--gdocx-blue)]">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--gdocx-text)]">{doc.title}</p>
                <p className="text-[11px] text-[var(--gdocx-text-muted)]">Document actions</p>
              </div>
            </div>
          </div>

          <div className="mx-3 my-2 h-px bg-gradient-to-r from-transparent via-[var(--gdocx-border)] to-transparent" />

          <div className="space-y-1 px-2 pb-2">
            {showShare && (
              <DocumentMenuAction
                title="Share"
                description="Invite collaborators"
                icon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                }
                onClick={() => {
                  setOpen(false)
                  onShare(doc)
                }}
              />
            )}
            {showDelete && (
              <DocumentMenuAction
                tone="danger"
                title={deleting ? 'Deleting…' : 'Delete'}
                description="Remove permanently"
                disabled={deleting}
                icon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                }
                onClick={() => {
                  setOpen(false)
                  onDelete(doc)
                }}
              />
            )}
          </div>
        </GlassPanel>
      )}
    </div>
  )
}

export function DocumentGridCard({
  document,
  variant,
  canManage,
  onShare,
  onDelete,
  deletingId,
  style,
}) {
  const isSharedWithMe = !canManage && variant === 'shared'

  return (
    <article
      className="group dashboard-card-enter relative z-0 flex flex-col has-[[data-open=true]]:z-50"
      style={style}
    >
      <div className="relative flex flex-col rounded-xl border border-[#dadce0] bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#c4c7c5] hover:shadow-md">
        <Link to={`/documents/${document.id}`} className="block">
          <div className="relative h-[140px] overflow-hidden rounded-t-xl">
            <DocumentPreview title={document.title} />
            {isSharedWithMe && (
              <span
                className="absolute right-2 top-2 rounded-full bg-violet-600/90 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm"
                title="Someone else shared this with you"
              >
                Shared with me
              </span>
            )}
            {canManage && document.share_count > 0 && (
              <span
                className="absolute right-2 top-2 rounded-full bg-emerald-600/90 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm"
                title="You shared this with others"
              >
                {document.share_count} shared
              </span>
            )}
          </div>

          <div
            className={`flex items-start gap-2 border-t border-[#e8eaed] px-3 py-2.5 ${canManage ? 'pr-10' : ''}`}
          >
            <svg className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#4285f4]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z" />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#202124]">{document.title}</p>
              <p className="mt-0.5 truncate text-xs text-[#5f6368]">
                {isSharedWithMe && document.owner_email
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
            canManage={canManage}
            onShare={onShare}
            onDelete={onDelete}
            deleting={deletingId === document.id}
            menuUp
          />
        </div>
      </div>
    </article>
  )
}

export function DocumentListRow({
  document,
  variant,
  canManage,
  onShare,
  onDelete,
  deletingId,
}) {
  const isSharedWithMe = !canManage && variant === 'shared'

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
            {isSharedWithMe && (
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                Shared with me
              </span>
            )}
            {canManage && document.share_count > 0 && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                Shared · {document.share_count}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-[#5f6368]">
            {isSharedWithMe && document.owner_email ? `${document.owner_email} · ` : ''}
            Opened {formatOpenedDate(document.updated_at)}
          </p>
        </div>
      </Link>
      <DocumentMenu
        doc={document}
        canManage={canManage}
        onShare={onShare}
        onDelete={onDelete}
        deleting={deletingId === document.id}
      />
    </li>
  )
}
