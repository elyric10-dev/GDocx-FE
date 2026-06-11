import { cn } from '../../utils/cn'

export default function TextField({
  id,
  label,
  type = 'text',
  icon,
  className,
  inputClassName,
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[var(--gdocx-text)]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--gdocx-text-muted)]">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          className={cn('gdocx-input', icon && 'gdocx-input--with-icon', inputClassName)}
          {...props}
        />
      </div>
    </div>
  )
}
