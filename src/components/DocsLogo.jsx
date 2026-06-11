import { Link } from 'react-router-dom'
import LogoMark from './ui/LogoMark'

export default function DocsLogo({ compact = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 transition hover:opacity-80" title="Back to documents">
      <LogoMark size="sm" />
      {!compact && (
        <span className="hidden text-[1.35rem] font-normal tracking-tight text-[var(--gdocx-text-secondary)] sm:inline">
          G<span className="text-[var(--gdocx-text)]">Docx</span>
        </span>
      )}
    </Link>
  )
}
