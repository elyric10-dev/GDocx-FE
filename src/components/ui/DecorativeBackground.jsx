import { cn } from '../../utils/cn'
import { BrandDots } from './BrandStripe'
import FloatingDocCard from './FloatingDocCard'

const ORB_PRESETS = {
  app: [
    { className: 'gdocx-orb -left-24 top-[12%] h-96 w-96 bg-[rgba(66,133,244,0.12)]', delay: '' },
    { className: 'gdocx-orb gdocx-orb--delay-1 -right-20 top-[35%] h-80 w-80 bg-[rgba(52,168,83,0.1)]', delay: '1' },
    { className: 'gdocx-orb gdocx-orb--delay-2 bottom-[15%] left-[20%] h-72 w-72 bg-[rgba(251,188,4,0.08)]', delay: '2' },
    { className: 'gdocx-orb gdocx-orb--delay-3 right-[30%] top-[8%] h-48 w-48 bg-[rgba(234,67,53,0.06)]', delay: '3' },
  ],
  panel: [
    { className: 'gdocx-orb -right-16 top-20 h-64 w-64 bg-[rgba(66,133,244,0.15)]', delay: '' },
    { className: 'gdocx-orb gdocx-orb--delay-1 -left-12 bottom-24 h-56 w-56 bg-[rgba(52,168,83,0.12)]', delay: '1' },
    { className: 'gdocx-orb gdocx-orb--delay-2 right-1/4 top-1/2 h-40 w-40 bg-[rgba(251,188,4,0.1)]', delay: '2' },
  ],
  hero: [
    { className: 'gdocx-orb -left-20 top-1/4 h-72 w-72 bg-[rgba(66,133,244,0.4)]', delay: '' },
    { className: 'gdocx-orb gdocx-orb--delay-1 bottom-1/4 right-0 h-80 w-80 bg-[rgba(52,168,83,0.35)]', delay: '1' },
    { className: 'gdocx-orb gdocx-orb--delay-2 left-1/3 top-0 h-56 w-56 bg-[rgba(251,188,4,0.25)]', delay: '2' },
    { className: 'gdocx-orb gdocx-orb--delay-3 bottom-0 left-1/4 h-48 w-48 bg-[rgba(234,67,53,0.2)]', delay: '3' },
  ],
}

const DOC_PRESETS = {
  app: [
    { title: 'Notes', variant: 'light', className: 'right-[6%] top-[14%] hidden w-24 opacity-60 lg:block xl:w-28', lines: 3, rotate: '-6deg' },
    { title: 'Draft', variant: 'light', className: 'bottom-[18%] left-[4%] hidden w-20 opacity-50 md:block lg:w-24', lines: 3, rotate: '5deg' },
    { title: 'Ideas', variant: 'light', className: 'bottom-[32%] right-[12%] hidden w-20 opacity-40 xl:block', lines: 3, rotate: '-4deg' },
  ],
  hero: [
    { title: 'Project brief', variant: 'dark', className: 'left-[8%] top-[18%] w-36 lg:w-44', lines: 5, rotate: '-8deg' },
    { title: 'Meeting notes', variant: 'dark', className: 'right-[6%] top-[12%] w-32 lg:right-[12%] lg:w-40', lines: 4, rotate: '6deg' },
    { title: 'Draft v2', variant: 'dark', className: 'bottom-[22%] left-[18%] hidden w-36 sm:block lg:bottom-[28%] lg:w-44', lines: 3, rotate: '4deg' },
    { title: 'Ideas', variant: 'dark', className: 'bottom-[18%] right-[10%] w-28 lg:w-36', lines: 4, rotate: '-5deg' },
  ],
}

function DotPattern({ size = 32, opacity = 0.35, light = false }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        opacity,
        backgroundImage: light
          ? 'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)'
          : 'radial-gradient(circle at 1px 1px, #c4c7c5 1px, transparent 0)',
        backgroundSize: light ? '48px 48px' : `${size}px ${size}px`,
      }}
      aria-hidden
    />
  )
}

export default function DecorativeBackground({
  variant = 'app',
  className,
  showDocs = true,
  showBrandDots = false,
  children,
}) {
  const isHero = variant === 'hero'
  const isPanel = variant === 'panel'
  const isApp = variant === 'app'

  const baseClass = isHero ? 'gdocx-bg-dark' : isPanel ? 'gdocx-bg-panel' : 'gdocx-bg-app'
  const meshClass = isHero ? 'gdocx-mesh-bold opacity-90' : 'gdocx-mesh-soft'

  return (
    <div className={cn('h-full min-h-full overflow-hidden', className)}>
      <div className={cn('absolute inset-0', baseClass)} />
      <div className={cn('absolute inset-0', meshClass)} />

      {ORB_PRESETS[variant]?.map((orb) => (
        <div
          key={orb.className}
          className={cn('absolute rounded-full blur-3xl', orb.className)}
          aria-hidden
        />
      ))}

      <DotPattern size={isHero ? 48 : 32} opacity={isHero ? 0.07 : 0.35} light={isHero} />

      {showDocs &&
        DOC_PRESETS[variant]?.map((doc) => (
          <FloatingDocCard
            key={doc.title}
            title={doc.title}
            lines={doc.lines}
            variant={doc.variant}
            className={doc.className}
            style={{ '--gdocx-float-rotate': doc.rotate }}
          />
        ))}

      {showBrandDots && (
        <BrandDots size="bottom" className="absolute bottom-0 left-0 right-0 justify-center pb-3 opacity-30" />
      )}

      {children}
    </div>
  )
}
