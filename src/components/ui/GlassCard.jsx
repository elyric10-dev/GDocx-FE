import { cn } from '../../utils/cn'

export default function GlassCard({ children, className, glow = false }) {
  return (
    <div className={cn('gdocx-glass-card relative overflow-hidden rounded-2xl', className)}>
      {glow && (
        <>
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--gdocx-blue)]/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-[var(--gdocx-green)]/15 blur-2xl" />
        </>
      )}
      <div className="relative">{children}</div>
    </div>
  )
}
