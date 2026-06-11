import { cn } from '../../utils/cn'

function MiniPaper({ accent, children, className, rotate = -2.5 }) {
  return (
    <div className={cn('gdocx-template-thumb', className)}>
      <div className="gdocx-template-thumb__paper" style={{ '--thumb-rotate': `${rotate}deg` }}>
        <div className="gdocx-template-thumb__accent" style={{ background: accent }} aria-hidden />
        <div className="gdocx-template-thumb__content">{children}</div>
      </div>
    </div>
  )
}

function H1({ children }) {
  return <p className="gdocx-template-thumb__h1">{children}</p>
}

function H2({ children }) {
  return <p className="gdocx-template-thumb__h2">{children}</p>
}

function H3({ children }) {
  return <p className="gdocx-template-thumb__h3">{children}</p>
}

function Meta({ children }) {
  return <p className="gdocx-template-thumb__meta">{children}</p>
}

function Placeholder({ children }) {
  return <span className="gdocx-template-thumb__placeholder">{children}</span>
}

function BulletList({ items }) {
  return (
    <ul className="gdocx-template-thumb__list">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
}

function OrderedList({ items }) {
  return (
    <ol className="gdocx-template-thumb__olist">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ol>
  )
}

function Quote({ children }) {
  return <blockquote className="gdocx-template-thumb__quote">{children}</blockquote>
}

const ACCENTS = {
  blank: 'linear-gradient(90deg, #4285f4, #34a853)',
  meeting: 'linear-gradient(90deg, #4285f4, #1a73e8)',
  brief: 'linear-gradient(90deg, #ea4335, #fbbc04)',
  report: 'linear-gradient(90deg, #9334e6, #4285f4)',
}

export function BlankDocumentThumbnail() {
  return (
    <MiniPaper accent={ACCENTS.blank} rotate={-1.5}>
      <H1>Untitled</H1>
      <p className="gdocx-template-thumb__cursor-line">
        <span className="gdocx-template-thumb__cursor" aria-hidden />
      </p>
      <p className="gdocx-template-thumb__ghost-line" />
      <p className="gdocx-template-thumb__ghost-line gdocx-template-thumb__ghost-line--short" />
    </MiniPaper>
  )
}

export function ImportUploadThumbnail() {
  return (
    <div className="gdocx-import-upload" aria-hidden>
      <div className="gdocx-import-upload__glow" />
      <div className="gdocx-import-upload__orbit gdocx-import-upload__orbit--a">
        <span className="gdocx-import-upload__file-chip">.txt</span>
      </div>
      <div className="gdocx-import-upload__orbit gdocx-import-upload__orbit--b">
        <span className="gdocx-import-upload__file-chip gdocx-import-upload__file-chip--green">.md</span>
      </div>
      <div className="gdocx-import-upload__orbit gdocx-import-upload__orbit--c">
        <span className="gdocx-import-upload__file-chip gdocx-import-upload__file-chip--yellow">.docx</span>
      </div>
      <div className="gdocx-import-upload__orbit gdocx-import-upload__orbit--d">
        <span className="gdocx-import-upload__file-chip gdocx-import-upload__file-chip--purple">.json</span>
      </div>
      <div className="gdocx-import-upload__orbit gdocx-import-upload__orbit--e">
        <span className="gdocx-import-upload__file-chip gdocx-import-upload__file-chip--red">.html</span>
      </div>

      <div className="gdocx-import-upload__zone">
        <div className="gdocx-import-upload__ring" />
        <div className="gdocx-import-upload__icon">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <p className="gdocx-import-upload__label">Drop to upload</p>
        <p className="gdocx-import-upload__sublabel">or click to browse</p>
      </div>
    </div>
  )
}

export function MeetingNotesThumbnail() {
  return (
    <MiniPaper accent={ACCENTS.meeting}>
      <H1>Meeting notes</H1>
      <Meta>
        <strong>Date:</strong> <Placeholder>[Add date]</Placeholder>
        {' · '}
        <strong>Time:</strong> <Placeholder>[Start – end]</Placeholder>
      </Meta>
      <H2>Attendees</H2>
      <BulletList items={[<><Placeholder>[Name], [Role]</Placeholder></>]} />
      <H2>Agenda</H2>
      <OrderedList
        items={[
          <>
            <strong>Welcome</strong> — <Placeholder>[5 min]</Placeholder>
          </>,
          <>
            <strong>[Topic 1]</strong> — <Placeholder>[15 min]</Placeholder>
          </>,
        ]}
      />
      <H2>Action items</H2>
      <BulletList
        items={[
          <>
            <strong>Owner:</strong> <Placeholder>[Name]</Placeholder> · <strong>Due:</strong>{' '}
            <Placeholder>[Date]</Placeholder>
          </>,
        ]}
      />
    </MiniPaper>
  )
}

export function ProjectBriefThumbnail() {
  return (
    <MiniPaper accent={ACCENTS.brief} rotate={-2}>
      <H1>Project brief</H1>
      <Meta>
        <strong>Project:</strong> <Placeholder>[Project name]</Placeholder>
      </Meta>
      <H2>Summary</H2>
      <p className="gdocx-template-thumb__p">
        <Placeholder>[Short overview of what you are building]</Placeholder>
      </p>
      <H2>Goals & success metrics</H2>
      <BulletList
        items={[
          <>
            <strong>Goal:</strong> <Placeholder>[Outcome]</Placeholder>
          </>,
        ]}
      />
      <H2>Timeline & milestones</H2>
      <OrderedList
        items={[
          <>
            <strong>Kickoff</strong> — <Placeholder>[Date]</Placeholder>
          </>,
        ]}
      />
    </MiniPaper>
  )
}

export function WeeklyReportThumbnail() {
  return (
    <MiniPaper accent={ACCENTS.report} rotate={2}>
      <H1>Weekly report</H1>
      <Meta>
        <strong>Week of:</strong> <Placeholder>[Date range]</Placeholder>
      </Meta>
      <H2>Summary</H2>
      <Quote>
        <Placeholder>[Overall progress and key updates]</Placeholder>
      </Quote>
      <H2>Highlights</H2>
      <BulletList items={[<><Placeholder>[Completed deliverable]</Placeholder></>]} />
      <H2>Plan for next week</H2>
      <OrderedList items={[<><Placeholder>[Priority 1]</Placeholder></>]} />
    </MiniPaper>
  )
}

const THUMBNAIL_MAP = {
  meeting: MeetingNotesThumbnail,
  brief: ProjectBriefThumbnail,
  report: WeeklyReportThumbnail,
}

export default function TemplateDocumentThumbnail({ variant }) {
  const Component = THUMBNAIL_MAP[variant]
  if (!Component) return null
  return <Component />
}
