import DocsLogo from '../DocsLogo'
import UserAvatarMenu from '../UserAvatarMenu'

export default function DashboardHeader({ search, onSearchChange }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#dadce0]/80 bg-white/80 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-6">
        <button
          type="button"
          className="rounded-full p-2.5 text-[#5f6368] transition hover:bg-[#f1f3f4]"
          aria-label="Main menu"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>

        <DocsLogo />

        <div className="mx-auto hidden max-w-xl flex-1 sm:block">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#5f6368]"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search documents"
              className="w-full rounded-full border border-transparent bg-[#f1f3f4] py-2.5 pl-10 pr-4 text-sm text-[#202124] outline-none transition placeholder:text-[#5f6368] focus:border-[#4285f4]/30 focus:bg-white focus:shadow-[0_1px_3px_rgba(66,133,244,0.15)]"
            />
          </div>
        </div>

        <UserAvatarMenu />
      </div>

      <div className="px-4 pb-3 sm:hidden">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#5f6368]"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search documents"
            className="w-full rounded-full bg-[#f1f3f4] py-2.5 pl-10 pr-4 text-sm text-[#202124] outline-none"
          />
        </div>
      </div>
    </header>
  )
}
