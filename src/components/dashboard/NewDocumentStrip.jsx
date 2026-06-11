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

function TemplatePreview({ variant }) {
  if (variant === 'meeting') {
    return (
      <div className="flex h-full flex-col gap-1.5 p-3">
        <div className="h-2 w-2/3 rounded bg-[#4285f4]/70" />
        <div className="h-1 w-full rounded bg-[#dadce0]" />
        <div className="h-1 w-5/6 rounded bg-[#dadce0]" />
        <div className="mt-1 h-1.5 w-1/3 rounded bg-[#34a853]/60" />
        <div className="flex gap-1">
          <div className="h-1 w-1 rounded-full bg-[#dadce0]" />
          <div className="h-1 flex-1 rounded bg-[#dadce0]" />
        </div>
        <div className="flex gap-1">
          <div className="h-1 w-1 rounded-full bg-[#dadce0]" />
          <div className="h-1 flex-1 rounded bg-[#dadce0]" />
        </div>
      </div>
    )
  }

  if (variant === 'brief') {
    return (
      <div className="flex h-full flex-col gap-1.5 p-3">
        <div className="h-2 w-3/4 rounded bg-[#ea4335]/60" />
        <div className="h-1 w-full rounded bg-[#dadce0]" />
        <div className="grid grid-cols-2 gap-1 pt-1">
          <div className="h-6 rounded bg-[#fbbc04]/25" />
          <div className="h-6 rounded bg-[#4285f4]/20" />
        </div>
        <div className="h-1 w-full rounded bg-[#dadce0]" />
        <div className="h-1 w-4/5 rounded bg-[#dadce0]" />
      </div>
    )
  }

  if (variant === 'story') {
    return (
      <div className="flex h-full flex-col gap-1.5 p-3">
        <div className="h-2 w-1/2 rounded bg-[#9334e6]/50" />
        <div className="h-1 w-full rounded bg-[#dadce0]" />
        <div className="h-1 w-full rounded bg-[#dadce0]" />
        <div className="h-1 w-11/12 rounded bg-[#dadce0]" />
        <div className="mt-auto h-1 w-2/3 rounded bg-[#dadce0]/80" />
      </div>
    )
  }

  return null
}

function BlankCard({ disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex w-[140px] shrink-0 flex-col gap-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="relative flex h-[180px] items-center justify-center overflow-hidden rounded-xl border border-[#dadce0] bg-white shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:border-[#4285f4]/40 group-hover:shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4285f4]/5 via-transparent to-[#fbbc04]/10 opacity-0 transition group-hover:opacity-100" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#4285f4] via-[#34a853] to-[#fbbc04] p-[2px] shadow-md transition group-hover:scale-110">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
            <svg className="h-7 w-7 text-[#4285f4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
        </div>
      </div>
      <span className="text-left text-sm text-[#202124]">Blank document</span>
    </button>
  )
}

function ImportCard({ disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex w-[140px] shrink-0 flex-col gap-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="flex h-[180px] items-center justify-center rounded-xl border border-dashed border-[#dadce0] bg-[#f8f9fa] transition duration-300 group-hover:-translate-y-1 group-hover:border-[#4285f4]/50 group-hover:bg-white group-hover:shadow-lg">
        <svg className="h-10 w-10 text-[#5f6368] transition group-hover:text-[#4285f4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>
      <span className="text-left text-sm text-[#202124]">Import file</span>
      <span className="-mt-1 text-left text-xs text-[#5f6368]">.txt · .md · .docx</span>
    </button>
  )
}

function TemplateCard({ template, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(template)}
      disabled={disabled}
      className="group flex w-[140px] shrink-0 flex-col gap-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="h-[180px] overflow-hidden rounded-xl border border-[#dadce0] bg-white shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:border-[#4285f4]/30 group-hover:shadow-lg">
        <TemplatePreview variant={template.preview} />
      </div>
      <span className="text-left text-sm text-[#202124]">{template.label}</span>
      <span className="-mt-1 text-left text-xs text-[#5f6368]">{template.subtitle}</span>
    </button>
  )
}

export default function NewDocumentStrip({ busy, onBlank, onImport, onTemplate }) {
  return (
    <section className="border-b border-[#dadce0]/60 bg-[#f8f9fa]">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-[#202124]">Start a new document</h2>
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
