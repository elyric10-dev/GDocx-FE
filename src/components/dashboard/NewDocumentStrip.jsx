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
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4285f4] via-[#34a853] to-[#fbbc04] p-[2px] shadow-md"
            aria-hidden
          >
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white">
              <svg className="h-5 w-5 text-[var(--gdocx-blue)]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z" />
              </svg>
            </div>
          </div>
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
