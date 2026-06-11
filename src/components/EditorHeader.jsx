import DocsLogo from './DocsLogo'
import UserAvatarMenu from './UserAvatarMenu'

function SaveStatus({ saveState }) {
  const config = {
    saved: { label: 'All changes saved', dot: 'bg-emerald-500', text: 'text-[#5f6368]' },
    saving: { label: 'Saving…', dot: 'bg-[#4285f4] animate-pulse', text: 'text-[#4285f4]' },
    unsaved: { label: 'Unsaved changes', dot: 'bg-amber-500', text: 'text-amber-600' },
    error: { label: 'Save failed', dot: 'bg-red-500', text: 'text-red-600' },
  }

  const { label, dot, text } = config[saveState] || config.saved

  return (
    <div className={`flex items-center gap-1.5 text-xs ${text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
      {label}
    </div>
  )
}

export default function EditorHeader({
  title,
  onTitleChange,
  saveState,
  isOwner,
  onShare,
  readOnly,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#dadce0]/80 bg-white/85 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 py-2.5 sm:px-6">
        <DocsLogo compact />

        <div className="h-6 w-px shrink-0 bg-[#dadce0]" aria-hidden />

        <div className="min-w-0 flex-1">
          <input
            type="text"
            value={title}
            onChange={onTitleChange}
            readOnly={readOnly}
            placeholder="Untitled document"
            className="w-full truncate border-0 bg-transparent text-base font-medium text-[#202124] outline-none placeholder:text-[#80868b] sm:text-lg"
          />
          <SaveStatus saveState={saveState} />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {readOnly && (
            <span className="hidden rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 sm:inline">
              View only
            </span>
          )}
          {isOwner && (
            <button
              type="button"
              onClick={onShare}
              className="rounded-full bg-gradient-to-r from-[#4285f4] to-[#6366f1] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md hover:brightness-105 sm:px-5"
            >
              Share
            </button>
          )}
          <UserAvatarMenu />
        </div>
      </div>
    </header>
  )
}
