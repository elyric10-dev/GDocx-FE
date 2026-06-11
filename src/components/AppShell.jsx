import AppBackground from './AppBackground'

export default function AppShell({ children }) {
  return (
    <div className="app-shell relative min-h-screen">
      <AppBackground />
      <div className="relative z-0">{children}</div>
    </div>
  )
}
