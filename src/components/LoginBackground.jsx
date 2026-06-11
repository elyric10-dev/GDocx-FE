import DecorativeBackground from './ui/DecorativeBackground'
import LogoMark from './ui/LogoMark'
import LogoWordmark from './ui/LogoWordmark'
import { BrandDots } from './ui/BrandStripe'

export default function LoginBackground() {
  return (
    <DecorativeBackground
      variant="hero"
      className="login-hero flex h-full min-h-[38vh] flex-col justify-between p-8 lg:min-h-screen lg:p-12"
    >
      <div className="relative z-10 max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <LogoMark size="lg" className="[filter:drop-shadow(0_4px_14px_rgba(0,0,0,0.25))]" />
          <LogoWordmark size="xl" variant="light" className="[text-shadow:0_1px_12px_rgba(0,0,0,0.35)]" />
        </div>

        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.4)] lg:text-4xl xl:text-[2.75rem]">
          Write, share, and collaborate — all in one place.
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-200 [text-shadow:0_1px_14px_rgba(0,0,0,0.45)] lg:text-base">
          Your documents, beautifully organized. Pick up where you left off from any device.
        </p>
      </div>

      <div className="relative z-10 hidden items-center gap-3 lg:flex">
        <BrandDots size="thick" />
        <span className="ml-2 text-xs text-white/70 [text-shadow:0_1px_8px_rgba(0,0,0,0.35)]">
          Inspired by the tools you already love
        </span>
      </div>
    </DecorativeBackground>
  )
}
