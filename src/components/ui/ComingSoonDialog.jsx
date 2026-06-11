import { useEffect } from 'react'
import { cn } from '../../utils/cn'
import BrandStripe from './BrandStripe'
import PrimaryButton from './PrimaryButton'

export default function ComingSoonDialog({ open, toolName, onClose }) {
  useEffect(() => {
    if (!open) return undefined

    function handleEscape(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={cn(
          'gdocx-glass-panel gdocx-enter-menu w-full max-w-sm overflow-hidden rounded-2xl',
          'border border-[var(--gdocx-border)]/80 shadow-2xl',
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="coming-soon-title"
        onClick={(event) => event.stopPropagation()}
      >
        <BrandStripe />

        <div className="px-6 py-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--gdocx-surface)]">
            <svg className="h-7 w-7 text-[var(--gdocx-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 id="coming-soon-title" className="text-lg font-semibold text-[var(--gdocx-text)]">
            {toolName}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--gdocx-text-secondary)]">
            This tool is planned for a future release. For now, continue working in GDocx Documents.
          </p>

          <div className="mt-6">
            <PrimaryButton type="button" onClick={onClose} className="w-full">
              Got it
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}
