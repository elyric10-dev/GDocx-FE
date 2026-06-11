import DecorativeBackground from './ui/DecorativeBackground'

export default function AppBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <DecorativeBackground variant="app" showBrandDots className="h-full min-h-full" />
    </div>
  )
}
