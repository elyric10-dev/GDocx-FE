import { Link } from 'react-router-dom'
import UserAvatarMenu from './UserAvatarMenu'

function SaveStatus({ saveState }) {
  const labels = {
    saving: 'Saving…',
    unsaved: 'Unsaved changes',
    error: 'Save failed',
    saved: 'Saved to GDocx',
  }

  const colors = {
    saving: 'text-[#5f6368]',
    unsaved: 'text-[#ea8600]',
    error: 'text-[#d93025]',
    saved: 'text-[#5f6368]',
  }

  return (
    <span className={`text-xs ${colors[saveState] || colors.saved}`}>
      {labels[saveState] || labels.saved}
    </span>
  )
}

export default function EditorHeader({
  title,
  onTitleChange,
  saveState,
  isOwner,
  onShare,
}) {
  return (
    <header className="border-b border-[#dadce0] bg-white">
      <div className="flex items-center gap-3 px-3 py-2">
        <Link
          to="/"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:bg-[#f1f3f4]"
          title="Back to dashboard"
        >
          <svg className="h-5 w-5 text-[#1a73e8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>

        <div className="h-8 w-px shrink-0 bg-[#dadce0]" aria-hidden="true" />

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f0fe]">
          <svg className="h-5 w-5 text-[#1a73e8]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2 5 5h-5V4zM8 13h8v2H8v-2zm0 4h8v2H8v-2z" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <input
            type="text"
            value={title}
            onChange={onTitleChange}
            placeholder="Untitled document"
            className="w-full truncate border-0 bg-transparent text-lg text-[#202124] outline-none placeholder:text-[#80868b]"
          />
          <SaveStatus saveState={saveState} />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isOwner && (
            <button
              type="button"
              onClick={onShare}
              className="rounded-full bg-[#c2e7ff] px-5 py-2 text-sm font-medium text-[#001d35] transition hover:bg-[#a8daf7]"
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
