import { Link } from 'react-router-dom'

export default function DocsLogo({ compact = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 transition hover:opacity-80" title="Back to documents">
      <div className="relative flex h-9 w-9 items-center justify-center">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#4285f4] via-[#34a853] to-[#fbbc04] opacity-90" />
        <svg
          className="relative h-5 w-5 text-white drop-shadow-sm"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8 13h8v1.5H8V13zm0 3h5v1.5H8V16z" />
        </svg>
      </div>
      {!compact && (
        <span className="hidden text-[1.35rem] font-normal tracking-tight text-[#5f6368] sm:inline">
          G<span className="text-[#202124]">Docx</span>
        </span>
      )}
    </Link>
  )
}
