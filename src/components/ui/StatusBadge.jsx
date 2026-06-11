export default function StatusBadge({ label, pulse = false }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gdocx-blue)]/20 bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur-sm">
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--gdocx-green)] opacity-60" />
        )}
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--gdocx-green)]" />
      </span>
      <span className="text-xs font-medium text-[var(--gdocx-text-secondary)]">{label}</span>
    </div>
  )
}
