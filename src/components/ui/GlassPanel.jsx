import { cn } from '../../utils/cn'
import BrandStripe from './BrandStripe'

export default function GlassPanel({ children, className, showStripe = true }) {
  return (
    <div className={cn('gdocx-glass-panel gdocx-enter-menu overflow-hidden rounded-2xl', className)}>
      {showStripe && <BrandStripe />}
      {children}
    </div>
  )
}
