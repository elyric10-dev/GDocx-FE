import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import GlassPanel from '../ui/GlassPanel'
import { extractPreviewLines, formatOpenedDate } from '../../utils/documentPreview'

const PREVIEW_LINE_COLORS = [
  'bg-[#4285f4]/35',
  'bg-[#34a853]/30',
  'bg-[#fbbc04]/35',
  'bg-[#e8eaed]',
]

function DocumentIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z" />
    </svg>
  )
}

function ShareBadge({ variant, count }) {
  if (variant === 'shared-with-me') {
    return (
      <span className="gdocx-doc-badge gdocx-doc-badge--violet" title="Someone else shared this with you">
        <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
        Shared with me
      </span>
    )
  }

  if (variant === 'owned-shared' && count > 0) {
    return (
      <span className="gdocx-doc-badge gdocx-doc-badge--green" title="You shared this with others">
        <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11A2.99 2.99 0 0018 8.92a3 3 0 10-3-3 3 3 0 003 3c0 .24-.04.47-.09.7l-7.05 4.12c.52.48 1.2.78 1.96.78a3 3 0 110 6 3 3 0 010-6z" />
        </svg>
        {count} shared
      </span>
    )
  }

  return null
}

function DocumentPreview({ title, shared = false, compact = false }) {
  const lines = extractPreviewLines(title)

  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden',
        compact
          ? shared
            ? 'gdocx-doc-list__thumb--shared p-1'
            : 'gdocx-doc-list__thumb p-1'
          : cn('p-4', shared ? 'gdocx-doc-card__preview--shared' : 'gdocx-doc-card__preview'),
      )}
    >
      <div
        className={cn(
          'gdocx-doc-card__paper relative mx-auto rounded-lg',
          compact ? 'mt-1 h-[calc(100%-0.25rem)] max-w-[88%] rounded-md' : 'mt-2 h-[calc(100%-0.5rem)] max-w-[82%] rounded-t-md',
        )}
        style={{ transform: compact ? 'rotate(-2deg)' : 'rotate(-2.5deg)' }}
      >
        <div className="border-b border-[#e8eaed]/80 px-2.5 py-1.5">
          <p className={cn('truncate font-semibold text-[#202124]', compact ? 'text-[7px]' : 'text-[10px]')}>
            {lines[0]}
          </p>
        </div>
        <div className={cn('space-y-1', compact ? 'px-2 py-1.5' : 'space-y-1.5 px-3 py-2.5')}>
          {PREVIEW_LINE_COLORS.map((color, index) => (
            <div
              key={index}
              className={cn('rounded-full', color, compact ? 'h-0.5' : 'h-1')}
              style={{ width: `${92 - index * 14}%` }}
            />
          ))}
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
          variant="menu"
          className={cn('absolute right-0 z-50 w-[232px]', menuPositionClass)}
        >
          <div className="px-2 py-2">
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
            {showShare && showDelete && (
              <div
                className="my-1.5 h-px bg-gradient-to-r from-transparent via-[var(--gdocx-border)] to-transparent"
                role="separator"
                aria-hidden
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
      <div className="gdocx-doc-card relative flex flex-col rounded-2xl">
        <div className="overflow-hidden rounded-2xl">
          <div className="gdocx-doc-card__stripe" aria-hidden />

          <Link to={`/documents/${document.id}`} className="block">
            <div className="relative h-[148px] overflow-hidden">
              <DocumentPreview title={document.title} shared={isSharedWithMe} />
              <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
                {isSharedWithMe && <ShareBadge variant="shared-with-me" />}
                {canManage && document.share_count > 0 && (
                  <ShareBadge variant="owned-shared" count={document.share_count} />
                )}
              </div>
            </div>

            <div className={cn('flex items-center gap-3 px-3 py-3', canManage && 'pr-10')}>
              <div className={cn('gdocx-doc-card__icon', isSharedWithMe && 'gdocx-doc-card__icon--shared')}>
                <DocumentIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--gdocx-text)]">{document.title}</p>
                <p className="mt-0.5 truncate text-xs text-[var(--gdocx-text-secondary)]">
                  {isSharedWithMe && document.owner_email ? `${document.owner_email} · ` : ''}
                  Opened {formatOpenedDate(document.updated_at)}
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="absolute bottom-2.5 right-1.5 z-20">
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
    <li className="gdocx-doc-list__row group flex items-center gap-4 border-b border-[#e8eaed]/80 px-3 py-3 last:border-b-0">
      <Link to={`/documents/${document.id}`} className="flex min-w-0 flex-1 items-center gap-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
          <DocumentPreview title={document.title} shared={isSharedWithMe} compact />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-semibold text-[var(--gdocx-text)]">{document.title}</p>
            {isSharedWithMe && <ShareBadge variant="shared-with-me" />}
            {canManage && document.share_count > 0 && (
              <ShareBadge variant="owned-shared" count={document.share_count} />
            )}
          </div>
          <p className="mt-0.5 text-sm text-[var(--gdocx-text-secondary)]">
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
