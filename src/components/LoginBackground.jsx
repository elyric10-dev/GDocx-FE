function FloatingDoc({ className, lines = 4, title = 'Untitled' }) {
  return (
    <div
      className={`login-float-doc pointer-events-none absolute rounded-xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md ${className}`}
      aria-hidden
    >
      <div className="border-b border-white/15 px-3 py-2">
        <div className="h-1.5 w-16 rounded-full bg-white/40" />
        <p className="mt-1.5 truncate text-[9px] font-medium text-white/70">{title}</p>
      </div>
      <div className="space-y-1.5 px-3 py-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full bg-white/25"
            style={{ width: `${88 - i * 12}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function LoginBackground() {
  return (
    <div className="login-hero relative flex min-h-[38vh] flex-col justify-between overflow-hidden p-8 lg:min-h-screen lg:p-12">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#0f172a]" />
      <div className="login-mesh absolute inset-0 opacity-90" />

      {/* Color orbs */}
      <div className="login-orb login-orb-blue absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-[#4285f4]/40 blur-3xl" />
      <div className="login-orb login-orb-green absolute bottom-1/4 right-0 h-80 w-80 rounded-full bg-[#34a853]/35 blur-3xl" />
      <div className="login-orb login-orb-yellow absolute left-1/3 top-0 h-56 w-56 rounded-full bg-[#fbbc04]/25 blur-3xl" />
      <div className="login-orb login-orb-red absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-[#ea4335]/20 blur-3xl" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Floating documents */}
      <FloatingDoc
        className="login-float-1 left-[8%] top-[18%] w-36 lg:w-44"
        title="Project brief"
        lines={5}
      />
      <FloatingDoc
        className="login-float-2 right-[6%] top-[12%] w-32 lg:right-[12%] lg:w-40"
        title="Meeting notes"
        lines={4}
      />
      <FloatingDoc
        className="login-float-3 bottom-[22%] left-[18%] hidden w-36 sm:block lg:bottom-[28%] lg:w-44"
        title="Draft v2"
        lines={3}
      />
      <FloatingDoc
        className="login-float-4 bottom-[18%] right-[10%] w-28 lg:w-36"
        title="Ideas"
        lines={4}
      />

      {/* Hero copy */}
      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#4285f4] via-[#34a853] to-[#fbbc04] shadow-lg shadow-[#4285f4]/30">
            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8 13h8v1.5H8V13zm0 3h5v1.5H8V16z" />
            </svg>
          </div>
          <span className="text-2xl font-normal tracking-tight text-white">
            G<span className="font-medium">Docx</span>
          </span>
        </div>

        <h1 className="max-w-md text-3xl font-semibold leading-tight tracking-tight text-white lg:text-4xl xl:text-[2.75rem]">
          Write, share, and collaborate — all in one place.
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65 lg:text-base">
          Your documents, beautifully organized. Pick up where you left off from any device.
        </p>
      </div>

      {/* Bottom accent line */}
      <div className="relative z-10 hidden items-center gap-3 lg:flex">
        <div className="h-1 w-8 rounded-full bg-[#4285f4]" />
        <div className="h-1 w-8 rounded-full bg-[#34a853]" />
        <div className="h-1 w-8 rounded-full bg-[#fbbc04]" />
        <div className="h-1 w-8 rounded-full bg-[#ea4335]" />
        <span className="ml-2 text-xs text-white/40">Inspired by the tools you already love</span>
      </div>
    </div>
  )
}
