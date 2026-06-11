import { cn } from '../../utils/cn'
import BrandStripe from './BrandStripe'

export default function GlassPanel({ children, className, showStripe = true, variant = 'default' }) {
  return (
    <div
      className={cn(
        'gdocx-glass-panel gdocx-enter-menu overflow-hidden rounded-2xl',
        variant === 'menu' && 'gdocx-menu-panel',
        className,
      )}
    >
      {showStripe && <BrandStripe />}
      {children}
    </div>
  )
}
