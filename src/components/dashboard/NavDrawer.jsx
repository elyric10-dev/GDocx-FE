import { useEffect, useState } from 'react'
import { cn } from '../../utils/cn'
import BrandStripe from '../ui/BrandStripe'
import ComingSoonDialog from '../ui/ComingSoonDialog'
import LogoMark from '../ui/LogoMark'
import LogoWordmark from '../ui/LogoWordmark'

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm transition',
        active
          ? 'bg-[#e8f0fe] font-medium text-[#1a73e8]'
          : 'text-[var(--gdocx-text)] hover:bg-[var(--gdocx-surface)]',
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
          active ? 'bg-white shadow-sm' : 'bg-transparent',
        )}
      >
        {icon}
      </span>
      <span>{label}</span>
    </button>
  )
}

function Divider() {
  return <div className="mx-4 my-2 h-px bg-[var(--gdocx-border)]/70" />
}

const WORKSPACE_APPS = [
  {
    id: 'docs',
    label: 'Docs',
    available: true,
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden>
        <path fill="#4285F4" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z" />
      </svg>
    ),
  },
  {
    id: 'sheets',
    label: 'Sheets',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden>
        <path fill="#0F9D58" d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-1 16H6V5h12v14z" />
        <path fill="#0F9D58" d="M8 8h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z" />
      </svg>
    ),
  },
  {
    id: 'slides',
    label: 'Slides',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden>
        <path fill="#F4B400" d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-1 16H6V5h12v14z" />
        <path fill="#F4B400" d="M8 10l8 2-8 2V10z" />
      </svg>
    ),
  },
  {
    id: 'vids',
    label: 'Vids',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden>
        <path fill="#9334E6" d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-2 4l-5 3.5L17 14V7z" />
      </svg>
    ),
  },
  {
    id: 'forms',
    label: 'Forms',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden>
        <path fill="#673AB7" d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-2 14H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
    ),
  },
]

const UTILITY_ITEMS = [
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg className="h-6 w-6 text-[#5f6368]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96a7.02 7.02 0 00-1.62-.94l-.36-2.54A.49.49 0 0014 2h-4a.49.49 0 00-.49.42l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.63 8.1a.49.49 0 00.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.49.37 1.03.7 1.62.94l.36 2.54c.05.24.24.42.49.42h4c.25 0 .44-.18.49-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 00-.12-.61l-2.03-1.58zM12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" />
      </svg>
    ),
  },
  {
    id: 'help',
    label: 'Help & feedback',
    icon: (
      <svg className="h-6 w-6 text-[#5f6368]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
      </svg>
    ),
  },
]

const DriveIcon = (
  <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden>
    <path fill="#0066DA" d="M7.71 3.5L1.15 15h7.43L15.14 3.5H7.71z" />
    <path fill="#00AC47" d="M12.86 15L9.29 21.5h14.56L22.85 15H12.86z" />
    <path fill="#EA4335" d="M1.15 15l3.57 6.5h14.56L22.85 15H1.15z" />
  </svg>
)

export default function NavDrawer({ open, onClose }) {
  const [comingSoonTool, setComingSoonTool] = useState(null)

  useEffect(() => {
    if (!open) return undefined

    function handleEscape(event) {
      if (event.key !== 'Escape') return
      if (comingSoonTool) {
        setComingSoonTool(null)
        return
      }
      onClose()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose, comingSoonTool])

  useEffect(() => {
    if (!open) setComingSoonTool(null)
  }, [open])

  function handleAppClick(app) {
    if (app.available) {
      onClose()
      return
    }
    setComingSoonTool(app.label)
  }

  function handleUtilityClick(item) {
    setComingSoonTool(item.label)
  }

  return (
    <>
      <div
        className={cn('nav-drawer-backdrop', open && 'nav-drawer-backdrop--open')}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={cn('nav-drawer', open && 'nav-drawer--open')}
        aria-hidden={!open}
        aria-label="Main navigation"
      >
        <BrandStripe />

        <div className="flex items-center justify-between border-b border-[var(--gdocx-border)]/60 px-4 py-4">
          <div className="flex items-center gap-3">
            <LogoMark size="sm" />
            <LogoWordmark size="md" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[var(--gdocx-text-secondary)] transition hover:bg-[var(--gdocx-surface)]"
            aria-label="Close menu"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-2">
          {WORKSPACE_APPS.map((app) => (
            <NavItem
              key={app.id}
              icon={app.icon}
              label={app.label}
              active={app.available}
              onClick={() => handleAppClick(app)}
            />
          ))}

          <Divider />

          {UTILITY_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              onClick={() => handleUtilityClick(item)}
            />
          ))}

          <Divider />

          <NavItem icon={DriveIcon} label="Drive" onClick={() => setComingSoonTool('Drive')} />
        </nav>

        <footer className="border-t border-[var(--gdocx-border)]/60 px-4 py-3">
          <p className="text-center text-[11px] text-[var(--gdocx-text-muted)]">
            <button
              type="button"
              className="transition hover:text-[var(--gdocx-text-secondary)]"
              onClick={() => setComingSoonTool('Privacy Policy')}
            >
              Privacy Policy
            </button>
            <span className="mx-1.5">·</span>
            <button
              type="button"
              className="transition hover:text-[var(--gdocx-text-secondary)]"
              onClick={() => setComingSoonTool('Terms of Service')}
            >
              Terms of Service
            </button>
          </p>
        </footer>
      </aside>

      <ComingSoonDialog
        open={Boolean(comingSoonTool)}
        toolName={comingSoonTool}
        onClose={() => setComingSoonTool(null)}
      />
    </>
  )
}
