import { cn } from '../../utils/cn'
import { DOCUMENT_TEMPLATES } from '../../utils/documentTemplates'
import TemplateDocumentThumbnail, {
  BlankDocumentThumbnail,
  ImportUploadThumbnail,
} from './TemplateDocumentThumbnail'

const STARTER_TEMPLATES = [
  {
    id: 'blank',
    label: 'Blank document',
    subtitle: 'Start fresh',
    type: 'blank',
  },
  {
    id: 'import',
    label: 'Import file',
    subtitle: '.txt · .md · .docx',
    type: 'import',
  },
  ...DOCUMENT_TEMPLATES,
]

function NewDocCard({
  label,
  subtitle,
  disabled,
  onClick,
  sceneClass,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex w-[156px] shrink-0 flex-col gap-2.5 text-left disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="gdocx-new-doc-card relative h-[188px] overflow-hidden rounded-2xl">
        <div className="gdocx-new-doc-card__stripe" aria-hidden />
        <div className={cn('gdocx-new-doc-card__scene relative h-[calc(100%-2px)]', sceneClass)}>
          <div className="gdocx-new-doc-card__scene-pattern" aria-hidden />
          {children}
        </div>
      </div>
      <div>
        <span className="block text-sm font-semibold text-[var(--gdocx-text)] transition group-hover:text-[var(--gdocx-blue-dark)]">
          {label}
        </span>
        {subtitle && (
          <span className="mt-0.5 block text-xs text-[var(--gdocx-text-secondary)]">{subtitle}</span>
        )}
      </div>
    </button>
  )
}

function BlankCard({ disabled, onClick }) {
  return (
    <NewDocCard
      label="Blank document"
      subtitle="Start fresh"
      disabled={disabled}
      onClick={onClick}
      sceneClass="gdocx-new-doc-card__scene--blank"
    >
      <BlankDocumentThumbnail />
    </NewDocCard>
  )
}

function ImportCard({ disabled, onClick }) {
  return (
    <NewDocCard
      label="Import file"
      subtitle=".txt · .md · .docx"
      disabled={disabled}
      onClick={onClick}
      sceneClass="gdocx-new-doc-card__scene--import"
    >
      <ImportUploadThumbnail />
    </NewDocCard>
  )
}

function TemplateCard({ template, disabled, onClick }) {
  return (
    <NewDocCard
      label={template.label}
      subtitle={template.subtitle}
      disabled={disabled}
      onClick={() => onClick(template)}
      sceneClass={`gdocx-new-doc-card__scene--${template.preview}`}
    >
      <TemplateDocumentThumbnail variant={template.preview} />
    </NewDocCard>
  )
}

export default function NewDocumentStrip({ busy, onBlank, onImport, onTemplate }) {
  return (
    <section className="gdocx-new-doc-strip">
      <div className="gdocx-new-doc-strip__orb gdocx-new-doc-strip__orb--blue" aria-hidden />
      <div className="gdocx-new-doc-strip__orb gdocx-new-doc-strip__orb--green" aria-hidden />
      <div className="gdocx-new-doc-strip__orb gdocx-new-doc-strip__orb--yellow" aria-hidden />
      <div className="gdocx-new-doc-strip__grid" aria-hidden />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-8 sm:px-8">
        <div className="mb-6 flex items-center gap-3">
          <div
            className="h-9 w-1 shrink-0 rounded-full bg-gradient-to-b from-[var(--gdocx-blue)] via-[var(--gdocx-green)] to-[var(--gdocx-yellow)]"
            aria-hidden
          />
          <div>
            <h2 className="text-base font-semibold tracking-tight text-[var(--gdocx-text)]">
              Start a new document
            </h2>
            <p className="mt-0.5 text-xs text-[var(--gdocx-text-secondary)]">
              Blank page, import a file, or jump in with a template
            </p>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <BlankCard disabled={busy} onClick={onBlank} />
          <ImportCard disabled={busy} onClick={onImport} />
          {STARTER_TEMPLATES.filter((t) => t.type === 'template').map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              disabled={busy}
              onClick={onTemplate}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export { STARTER_TEMPLATES }
