import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { displayNameFromEmail, initialFromEmail } from '../utils/user'
import { cn } from '../utils/cn'
import GlassPanel from './ui/GlassPanel'
import GradientAvatar from './ui/GradientAvatar'

export default function UserAvatarMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const initial = initialFromEmail(user?.email)
  const displayName = displayNameFromEmail(user?.email)

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  async function handleLogout() {
    setOpen(false)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn('rounded-full transition', open && 'ring-2 ring-[var(--gdocx-blue)]/40 ring-offset-2')}
        title={user?.email}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <GradientAvatar label={initial} size="md" />
      </button>

      {open && (
        <GlassPanel
          className="absolute right-0 top-full z-50 mt-3 w-[280px]"
          role="menu"
        >
          <div className="relative overflow-hidden px-4 pb-1 pt-4">
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--gdocx-blue)]/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-[var(--gdocx-green)]/10 blur-2xl" />

            <div className="relative flex items-center gap-3">
              <GradientAvatar label={initial} size="lg" shape="square" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--gdocx-text)]">{displayName}</p>
                <p className="truncate text-xs text-[var(--gdocx-text-secondary)]">{user?.email}</p>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#e8f5e9] px-2 py-0.5 text-[10px] font-medium text-[#188038]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--gdocx-green)]" />
                  Signed in
                </span>
              </div>
            </div>
          </div>

          <div className="mx-4 my-3 h-px bg-gradient-to-r from-transparent via-[var(--gdocx-border)] to-transparent" />

          <div className="px-3 pb-3">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition hover:border-red-100 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--gdocx-surface)] text-[var(--gdocx-text-secondary)] transition group-hover:bg-red-100 group-hover:text-[var(--gdocx-red)]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </span>
              <span>
                <span className="block text-sm font-medium text-[var(--gdocx-text)] group-hover:text-[var(--gdocx-red)]">
                  Sign out
                </span>
                <span className="block text-[11px] text-[var(--gdocx-text-muted)]">End your session</span>
              </span>
            </button>
          </div>

          <div className="border-t border-[#e8eaed]/80 bg-[var(--gdocx-surface)]/60 px-4 py-2.5">
            <p className="text-center text-[10px] font-medium tracking-wide text-[var(--gdocx-text-muted)]">
              GDocx workspace
            </p>
          </div>
        </GlassPanel>
      )}
    </div>
  )
}
