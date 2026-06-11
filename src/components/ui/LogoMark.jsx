import { cn } from '../../utils/cn'

const SIZES = {
  xs: 'gdocx-logo-mark--xs',
  sm: 'gdocx-logo-mark--sm',
  md: 'gdocx-logo-mark--md',
  lg: 'gdocx-logo-mark--lg',
}

function LogoIcon() {
  return (
    <svg className="gdocx-logo-mark__svg" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 4h8l4 4v13a1.5 1.5 0 01-1.5 1.5H7A1.5 1.5 0 015.5 21V5.5A1.5 1.5 0 017 4z"
        fill="white"
        fillOpacity="0.95"
      />
      <path d="M15 4v4h4" fill="#e8f0fe" />
      <path d="M15 4l4 4h-3a1 1 0 01-1-1V4z" fill="#4285f4" fillOpacity="0.85" />
      <rect x="8" y="11" width="9" height="1.2" rx="0.6" fill="#4285f4" fillOpacity="0.9" />
      <rect x="8" y="14" width="7" height="1.2" rx="0.6" fill="#34a853" fillOpacity="0.85" />
      <rect x="8" y="17" width="5.5" height="1.2" rx="0.6" fill="#fbbc04" fillOpacity="0.9" />
    </svg>
  )
}

export default function LogoMark({ size = 'md', className }) {
  return (
    <div
      className={cn('gdocx-logo-mark', SIZES[size] || SIZES.md, className)}
      aria-hidden
    >
      <div className="gdocx-logo-mark__glow" />
      <div className="gdocx-logo-mark__frame">
        <div className="gdocx-logo-mark__stripe" />
        <div className="gdocx-logo-mark__inner">
          <LogoIcon />
        </div>
      </div>
    </div>
  )
}
