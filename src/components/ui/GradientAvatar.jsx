import { cn } from '../../utils/cn'

export default function GradientAvatar({
  label,
  size = 'md',
  shape = 'circle',
  className,
  innerClassName,
}) {
  const sizes = {
    sm: { outer: 'h-8 w-8 text-sm', inner: shape === 'circle' ? 'h-[calc(100%-2px)] w-[calc(100%-2px)]' : 'm-[2px] h-9 w-9 text-base', ring: 'inset-0' },
    md: { outer: 'h-9 w-9 text-sm', inner: shape === 'circle' ? 'h-[calc(100%-3px)] w-[calc(100%-3px)]' : 'm-[2px] h-11 w-11 text-base', ring: 'inset-0' },
    lg: { outer: 'h-11 w-11', inner: shape === 'circle' ? 'h-[calc(100%-3px)] w-[calc(100%-3px)] text-base' : 'm-[2px] h-11 w-11 text-base', ring: 'inset-0' },
  }

  const s = sizes[size] || sizes.md
  const rounded = shape === 'circle' ? 'rounded-full' : 'rounded-[10px]'
  const outerRounded = shape === 'circle' ? 'rounded-full' : 'rounded-xl'

  return (
    <div className={cn('relative flex items-center justify-center', s.outer, outerRounded, className)}>
      <span className={cn('gdocx-gradient-ring absolute opacity-90', s.ring, outerRounded)} />
      <span
        className={cn(
          'relative flex items-center justify-center bg-[var(--gdocx-blue-dark)] font-semibold text-white',
          rounded,
          s.inner,
          innerClassName,
        )}
      >
        {label}
      </span>
    </div>
  )
}
