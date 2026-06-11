function MiniDoc({ className, title }) {
  return (
    <div
      className={`app-float-doc pointer-events-none absolute rounded-lg border border-[#4285f4]/10 bg-white/40 shadow-sm backdrop-blur-sm ${className}`}
      aria-hidden
    >
      <div className="border-b border-[#dadce0]/40 px-2 py-1.5">
        <div className="h-1 w-10 rounded-full bg-[#4285f4]/20" />
        <p className="mt-1 truncate text-[8px] font-medium text-[#5f6368]/70">{title}</p>
      </div>
      <div className="space-y-1 px-2 py-1.5">
        <div className="h-0.5 w-full rounded-full bg-[#dadce0]/50" />
        <div className="h-0.5 w-4/5 rounded-full bg-[#dadce0]/40" />
        <div className="h-0.5 w-3/5 rounded-full bg-[#dadce0]/30" />
      </div>
    </div>
  )
}

export default function AppBackground() {
  return (
    <div className="app-background pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="app-bg-base absolute inset-0" />
      <div className="app-bg-mesh absolute inset-0" />

      <div className="app-bg-orb app-bg-orb-1 absolute -left-24 top-[12%] h-96 w-96 rounded-full bg-[#4285f4]/12 blur-3xl" />
      <div className="app-bg-orb app-bg-orb-2 absolute -right-20 top-[35%] h-80 w-80 rounded-full bg-[#34a853]/10 blur-3xl" />
      <div className="app-bg-orb app-bg-orb-3 absolute bottom-[15%] left-[20%] h-72 w-72 rounded-full bg-[#fbbc04]/8 blur-3xl" />
      <div className="app-bg-orb app-bg-orb-4 absolute right-[30%] top-[8%] h-48 w-48 rounded-full bg-[#ea4335]/6 blur-3xl" />

      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #c4c7c5 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <MiniDoc className="app-float-1 right-[6%] top-[14%] hidden w-24 opacity-60 lg:block xl:w-28" title="Notes" />
      <MiniDoc className="app-float-2 bottom-[18%] left-[4%] hidden w-20 opacity-50 md:block lg:w-24" title="Draft" />
      <MiniDoc className="app-float-3 bottom-[32%] right-[12%] hidden w-20 opacity-40 xl:block" title="Ideas" />

      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-3 opacity-30">
        <div className="h-0.5 w-10 rounded-full bg-[#4285f4]" />
        <div className="h-0.5 w-10 rounded-full bg-[#34a853]" />
        <div className="h-0.5 w-10 rounded-full bg-[#fbbc04]" />
        <div className="h-0.5 w-10 rounded-full bg-[#ea4335]" />
      </div>
    </div>
  )
}
