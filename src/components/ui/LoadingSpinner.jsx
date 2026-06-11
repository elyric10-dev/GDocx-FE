import { cn } from '../../utils/cn'

export default function LoadingSpinner({ size = 'md', className }) {
  const sizes = {
    sm: 'h-8 w-8 border-[3px]',
    md: 'h-9 w-9 border-4',
    lg: 'h-10 w-10 border-4',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-[var(--gdocx-blue)] border-t-transparent',
        sizes[size] || sizes.md,
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  )
}
