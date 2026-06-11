import { cn } from '../../utils/cn'

export default function FloatingDocCard({
  title = 'Untitled',
  lines = 4,
  variant = 'dark',
  className,
  style,
}) {
  const isDark = variant === 'dark'

  return (
    <div
      className={cn(
        'gdocx-float-doc absolute rounded-xl',
        isDark ? 'gdocx-float-doc--dark' : 'gdocx-float-doc--light rounded-lg',
        className,
      )}
      style={style}
      aria-hidden
    >
      <div className={cn('border-b px-3 py-2', isDark ? 'border-white/15' : 'border-[var(--gdocx-border)]/40 px-2 py-1.5')}>
        <div
          className={cn(
            'rounded-full',
            isDark ? 'h-1.5 w-16 bg-white/40' : 'h-1 w-10 bg-[var(--gdocx-blue)]/20',
          )}
        />
        <p
          className={cn(
            'mt-1.5 truncate font-medium',
            isDark ? 'text-[9px] text-white/70' : 'mt-1 text-[8px] text-[var(--gdocx-text-secondary)]/70',
          )}
        >
          {title}
        </p>
      </div>
      <div className={cn('space-y-1.5', isDark ? 'px-3 py-2.5' : 'space-y-1 px-2 py-1.5')}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'rounded-full',
              isDark ? 'h-1 bg-white/25' : 'h-0.5 bg-[var(--gdocx-border)]/50',
            )}
            style={{ width: `${88 - i * 12}%` }}
          />
        ))}
      </div>
    </div>
  )
}
