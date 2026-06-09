import UserAvatarMenu from './UserAvatarMenu'

export default function AppHeader({ children }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">{children}</div>
        <UserAvatarMenu />
      </div>
    </header>
  )
}
