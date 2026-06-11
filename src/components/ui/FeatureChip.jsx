const COLOR_MAP = {
  blue: 'var(--gdocx-blue)',
  green: 'var(--gdocx-green)',
  yellow: 'var(--gdocx-yellow)',
  red: 'var(--gdocx-red)',
}

export default function FeatureChip({ label, color = 'blue' }) {
  return (
    <div className="rounded-xl border border-white/60 bg-white/50 px-3 py-2.5 text-center shadow-sm backdrop-blur-sm">
      <div
        className="mx-auto mb-1.5 h-1 w-6 rounded-full"
        style={{ backgroundColor: COLOR_MAP[color] || color }}
      />
      <span className="text-[11px] font-medium text-[var(--gdocx-text-secondary)]">{label}</span>
    </div>
  )
}
