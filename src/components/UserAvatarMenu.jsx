import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function UserAvatarMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const initial = user?.email?.charAt(0).toUpperCase() || '?'

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a73e8] text-sm font-medium text-white transition hover:bg-[#1765cc]"
        title={user?.email}
        aria-label="Account menu"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-lg border border-[#dadce0] bg-white py-1 shadow-lg">
          <div className="border-b border-[#dadce0] px-4 py-2.5">
            <p className="truncate text-sm font-medium text-[#202124]">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full px-4 py-2.5 text-left text-sm text-[#202124] transition hover:bg-[#f1f3f4]"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
