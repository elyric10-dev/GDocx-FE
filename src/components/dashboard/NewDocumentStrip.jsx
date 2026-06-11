import { cn } from '../../utils/cn'

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
  {
    id: 'meeting',
    label: 'Meeting notes',
    subtitle: 'Agenda & action items',
    type: 'template',
    title: 'Meeting notes',
    preview: 'meeting',
    contentJson: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Meeting notes' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Date · Attendees' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Agenda' }] },
        { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Action items' }] },
        { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
      ],
    },
  },
  {
    id: 'brief',
    label: 'Project brief',
    subtitle: 'Goals & timeline',
    type: 'template',
    title: 'Project brief',
    preview: 'brief',
    contentJson: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Project brief' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Overview' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Goals' }] },
        { type: 'paragraph' },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Timeline' }] },
        { type: 'paragraph' },
      ],
    },
  },
  {
    id: 'story',
    label: 'Story draft',
    subtitle: 'Creative writing',
    type: 'template',
    title: 'Untitled story',
    preview: 'story',
    contentJson: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Chapter one' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Once upon a time…' }] },
        { type: 'paragraph' },
      ],
    },
  },
]

const TEMPLATE_LINES = {
  meeting: ['bg-[#4285f4]/40', 'bg-[#34a853]/30', 'bg-[#fbbc04]/35', 'bg-[#e8eaed]'],
  brief: ['bg-[#ea4335]/40', 'bg-[#fbbc04]/35', 'bg-[#4285f4]/30', 'bg-[#e8eaed]'],
  story: ['bg-[#9334e6]/40', 'bg-[#4285f4]/25', 'bg-[#34a853]/25', 'bg-[#e8eaed]'],
}

function TemplatePaper({ variant, title }) {
  const lines = TEMPLATE_LINES[variant] || TEMPLATE_LINES.meeting

  return (
    <div
      className="gdocx-new-doc-card__paper relative mx-auto mt-3 h-[calc(100%-0.75rem)] w-[78%] rounded-md"
      style={{ transform: 'rotate(-2.5deg)' }}
    >
      <div className="border-b border-[#e8eaed]/80 px-2 py-1.5">
        <p className="truncate text-[8px] font-semibold text-[var(--gdocx-text)]">{title}</p>
      </div>
      <div className="space-y-1 px-2 py-2">
        {lines.map((color, index) => (
          <div
            key={index}
            className={cn('h-0.5 rounded-full', color)}
            style={{ width: `${90 - index * 12}%` }}
          />
        ))}
      </div>
    </div>
  )
}

function NewDocCard({ label, subtitle, disabled, onClick, importStyle, previewClass, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex w-[148px] shrink-0 flex-col gap-2.5 text-left disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div
        className={cn(
          'gdocx-new-doc-card relative h-[180px] overflow-hidden rounded-2xl',
          importStyle && 'gdocx-new-doc-card--import',
        )}
      >
        <div className="gdocx-new-doc-card__stripe" aria-hidden />
        <div
          className={cn(
            'relative flex h-[calc(100%-2px)] items-center justify-center',
            previewClass || 'gdocx-new-doc-card__preview',
          )}
        >
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
    <NewDocCard label="Blank document" subtitle="Start fresh" disabled={disabled} onClick={onClick}>
      <div className="gdocx-new-doc-card__plus flex h-14 w-14 items-center justify-center rounded-2xl p-[2px]">
        <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-white">
          <svg className="h-7 w-7 text-[var(--gdocx-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
      </div>
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
      importStyle
      previewClass="gdocx-new-doc-card__preview"
    >
      <div className="flex flex-col items-center gap-2">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f0fe] text-[var(--gdocx-blue-dark)] shadow-sm transition group-hover:scale-105">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </span>
        <span className="text-[10px] font-medium text-[var(--gdocx-text-muted)]">Drop or browse</span>
      </div>
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
      previewClass={`gdocx-new-doc-card__preview--${template.preview}`}
    >
      <TemplatePaper variant={template.preview} title={template.title} />
    </NewDocCard>
  )
}

export default function NewDocumentStrip({ busy, onBlank, onImport, onTemplate }) {
  return (
    <section className="gdocx-new-doc-strip">
      <div className="relative mx-auto max-w-[1400px] px-4 py-7 sm:px-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="h-9 w-1 shrink-0 rounded-full bg-gradient-to-b from-[var(--gdocx-blue)] via-[var(--gdocx-green)] to-[var(--gdocx-yellow)]" aria-hidden />
          <div>
            <h2 className="text-base font-semibold tracking-tight text-[var(--gdocx-text)]">
              Start a new document
            </h2>
            <p className="mt-0.5 text-xs text-[var(--gdocx-text-secondary)]">
              Blank page, import a file, or jump in with a template
            </p>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
