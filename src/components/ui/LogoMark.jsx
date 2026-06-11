import { cn } from '../../utils/cn'

export default function LogoMark({ size = 'md', className }) {
  const sizes = {
    sm: { box: 'h-9 w-9 rounded-lg', icon: 'h-5 w-5' },
    md: { box: 'h-11 w-11 rounded-xl', icon: 'h-6 w-6' },
    lg: { box: 'h-11 w-11 rounded-xl', icon: 'h-6 w-6' },
  }

  const { box, icon } = sizes[size] || sizes.md

  return (
    <div
      className={cn(
        'gdocx-gradient-brand flex items-center justify-center shadow-lg shadow-[var(--gdocx-blue)]/30',
        box,
        className,
      )}
    >
      <svg className={cn(icon, 'text-white')} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8 13h8v1.5H8V13zm0 3h5v1.5H8V16z" />
      </svg>
    </div>
  )
}
