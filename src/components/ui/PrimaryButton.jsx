import { cn } from '../../utils/cn'

export default function PrimaryButton({
  children,
  className,
  showArrow = false,
  type = 'button',
  ...props
}) {
  return (
    <button type={type} className={cn('gdocx-btn-primary group', className)} {...props}>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
        {showArrow && (
          <svg
            className="h-4 w-4 transition group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        )}
      </span>
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition duration-700 group-hover:translate-x-full" />
    </button>
  )
}
