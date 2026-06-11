import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function displayNameFromEmail(email) {
  if (!email) return 'User'
  const local = email.split('@')[0] || 'User'
  return local.charAt(0).toUpperCase() + local.slice(1)
}

export default function UserAvatarMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const initial = user?.email?.charAt(0).toUpperCase() || '?'
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
        className={`group relative flex h-9 w-9 items-center justify-center rounded-full transition ${
          open ? 'ring-2 ring-[#4285f4]/40 ring-offset-2' : ''
        }`}
        title={user?.email}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4285f4] via-[#34a853] to-[#fbbc04] opacity-90 transition group-hover:opacity-100" />
        <span className="relative flex h-[calc(100%-3px)] w-[calc(100%-3px)] items-center justify-center rounded-full bg-[#1a73e8] text-sm font-semibold text-white shadow-inner">
          {initial}
        </span>
      </button>

      {open && (
        <div
          className="user-menu-enter absolute right-0 top-full z-50 mt-3 w-[280px] overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-xl shadow-[#4285f4]/10 backdrop-blur-xl"
          role="menu"
        >
          {/* Brand stripe */}
          <div className="flex h-1">
            <div className="flex-1 bg-[#4285f4]" />
            <div className="flex-1 bg-[#34a853]" />
            <div className="flex-1 bg-[#fbbc04]" />
            <div className="flex-1 bg-[#ea4335]" />
          </div>

          <div className="relative overflow-hidden px-4 pb-1 pt-4">
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#4285f4]/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-[#34a853]/10 blur-2xl" />

            <div className="relative flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#4285f4] via-[#34a853] to-[#fbbc04] opacity-80" />
                <div className="relative m-[2px] flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#1a73e8] text-base font-semibold text-white">
                  {initial}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#202124]">{displayName}</p>
                <p className="truncate text-xs text-[#5f6368]">{user?.email}</p>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#e8f5e9] px-2 py-0.5 text-[10px] font-medium text-[#188038]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#34a853]" />
                  Signed in
                </span>
              </div>
            </div>
          </div>

          <div className="mx-4 my-3 h-px bg-gradient-to-r from-transparent via-[#dadce0] to-transparent" />

          <div className="px-3 pb-3">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition hover:border-red-100 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1f3f4] text-[#5f6368] transition group-hover:bg-red-100 group-hover:text-[#d93025]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </span>
              <span>
                <span className="block text-sm font-medium text-[#202124] group-hover:text-[#d93025]">
                  Sign out
                </span>
                <span className="block text-[11px] text-[#80868b]">End your session</span>
              </span>
            </button>
          </div>

          <div className="border-t border-[#e8eaed]/80 bg-[#f8f9fa]/60 px-4 py-2.5">
            <p className="text-center text-[10px] font-medium tracking-wide text-[#80868b]">
              GDocx workspace
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
