import DecorativeBackground from './ui/DecorativeBackground'
import LogoMark from './ui/LogoMark'
import { BrandDots } from './ui/BrandStripe'

export default function LoginBackground() {
  return (
    <DecorativeBackground
      variant="hero"
      className="login-hero flex min-h-[38vh] flex-col justify-between p-8 lg:min-h-screen lg:p-12"
    >
      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-3">
          <LogoMark size="lg" />
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

      <div className="relative z-10 hidden items-center gap-3 lg:flex">
        <BrandDots size="thick" />
        <span className="ml-2 text-xs text-white/40">Inspired by the tools you already love</span>
      </div>
    </DecorativeBackground>
  )
}
