import DecorativeBackground from './ui/DecorativeBackground'

export default function AppBackground() {
  return (
    <DecorativeBackground
      variant="app"
      showBrandDots
      className="pointer-events-none absolute inset-0 z-0 min-h-full"
    />
  )
}
