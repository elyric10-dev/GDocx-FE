import { cn } from '../../utils/cn'

const SIZES = {
  sm: 'text-[1.05rem]',
  md: 'text-[1.35rem]',
  lg: 'text-2xl',
  xl: 'text-[2rem]',
}

export default function LogoWordmark({ size = 'md', variant = 'default', className }) {
  const isLight = variant === 'light'

  return (
    <span
      className={cn(
        'gdocx-logo-wordmark inline-flex items-baseline font-normal tracking-tight',
        SIZES[size] || SIZES.md,
        className,
      )}
    >
      <span className={cn('gdocx-logo-wordmark__g font-medium', isLight && 'gdocx-logo-wordmark__g--light')}>
        G
      </span>
      <span
        className={cn(
          'gdocx-logo-wordmark__doc font-semibold',
          isLight ? 'text-white' : 'text-[var(--gdocx-text)]',
        )}
      >
        Doc
      </span>
      <span className={cn('gdocx-logo-wordmark__x font-semibold', isLight && 'gdocx-logo-wordmark__x--light')}>
        x
      </span>
    </span>
  )
}
