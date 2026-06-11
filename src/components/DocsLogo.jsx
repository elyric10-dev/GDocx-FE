import { Link } from 'react-router-dom'
import { cn } from '../utils/cn'
import LogoMark from './ui/LogoMark'
import LogoWordmark from './ui/LogoWordmark'

export default function DocsLogo({ compact = false, className }) {
  return (
    <Link
      to="/"
      className={cn('group flex items-center gap-2.5 transition hover:opacity-90', className)}
      title="Back to documents"
    >
      <LogoMark
        size="sm"
        className="transition duration-300 group-hover:scale-[1.04] group-hover:shadow-lg"
      />
      {!compact && (
        <span className="hidden sm:inline">
          <LogoWordmark size="md" />
        </span>
      )}
    </Link>
  )
}
