import AppBackground from './AppBackground'

export default function AppShell({ children }) {
  return (
    <div className="app-shell gdocx-bg-app relative isolate min-h-screen">
      <AppBackground />
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
