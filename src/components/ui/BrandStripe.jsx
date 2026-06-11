import { cn } from '../../utils/cn'

const COLORS = ['bg-[var(--gdocx-blue)]', 'bg-[var(--gdocx-green)]', 'bg-[var(--gdocx-yellow)]', 'bg-[var(--gdocx-red)]']

export function BrandDots({ className, size = 'default' }) {
  return (
    <div
      className={cn(
        'gdocx-brand-dots',
        size === 'thick' && 'gdocx-brand-dots--thick',
        size === 'bottom' && 'gdocx-brand-dots--bottom',
        className,
      )}
      aria-hidden
    >
      {COLORS.map((color) => (
        <span key={color} className={color} />
      ))}
    </div>
  )
}

export default function BrandStripe({ className, thin = false }) {
  return (
    <div className={cn('gdocx-brand-stripe', thin && 'gdocx-brand-stripe--thin', className)} aria-hidden>
      {COLORS.map((color) => (
        <div key={color} className={color} />
      ))}
    </div>
  )
}
