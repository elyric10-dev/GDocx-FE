import { cn } from '../../utils/cn'

const COLOR_MAP = {
  blue: 'var(--gdocx-blue)',
  green: 'var(--gdocx-green)',
  yellow: 'var(--gdocx-yellow)',
  red: 'var(--gdocx-red)',
}

export default function FeatureChip({ label, color = 'blue', className }) {
  const accent = COLOR_MAP[color] || color

  return (
    <div
      className={cn(
        'pointer-events-none flex select-none flex-col items-center gap-2 text-center',
        className,
      )}
      aria-hidden
    >
      <span
        className="block h-1 w-7 rounded-full opacity-90"
        style={{ backgroundColor: accent }}
      />
      <span className="text-[11px] font-normal tracking-wide text-[var(--gdocx-text-muted)]">
        {label}
      </span>
    </div>
  )
}
