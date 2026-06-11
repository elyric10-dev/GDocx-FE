function t(text, marks) {
  const node = { type: 'text', text }
  if (marks?.length) node.marks = marks
  return node
}

const italic = (text) => t(text, [{ type: 'italic' }])
const bold = (text) => t(text, [{ type: 'bold' }])

function heading(level, ...content) {
  return { type: 'heading', attrs: { level }, content }
}

function paragraph(...content) {
  return { type: 'paragraph', content: content.length ? content : undefined }
}

function bulletList(...items) {
  return { type: 'bulletList', content: items }
}

function orderedList(...items) {
  return { type: 'orderedList', content: items }
}

function listItem(...content) {
  return { type: 'listItem', content: [paragraph(...content)] }
}

function blockquote(...content) {
  return { type: 'blockquote', content: [paragraph(...content)] }
}

function doc(...nodes) {
  return { type: 'doc', content: nodes }
}

export const DOCUMENT_TEMPLATES = [
  {
    id: 'meeting',
    label: 'Meeting notes',
    subtitle: 'Agenda & action items',
    type: 'template',
    title: 'Meeting notes',
    preview: 'meeting',
    contentJson: doc(
      heading(1, t('Meeting notes')),
      paragraph(
        bold('Date: '),
        italic('[Add date]'),
        t('  ·  '),
        bold('Time: '),
        italic('[Start – end]'),
        t('  ·  '),
        bold('Location: '),
        italic('[Room or video link]'),
      ),
      heading(2, t('Attendees')),
      bulletList(
        listItem(italic('[Name], [Role]')),
        listItem(italic('[Name], [Role]')),
        listItem(italic('[Name], [Role]')),
      ),
      heading(2, t('Objective')),
      paragraph(italic('[What should this meeting accomplish?]')),
      heading(2, t('Agenda')),
      orderedList(
        listItem(bold('Welcome & context'), t(' — '), italic('[5 min]')),
        listItem(bold('[Topic 1]'), t(' — '), italic('[15 min]')),
        listItem(bold('[Topic 2]'), t(' — '), italic('[15 min]')),
        listItem(bold('Action items & next steps'), t(' — '), italic('[5 min]')),
      ),
      heading(2, t('Discussion notes')),
      paragraph(bold('[Topic 1]'), t(' — '), italic('[Key points, decisions, and context]')),
      paragraph(bold('[Topic 2]'), t(' — '), italic('[Key points, decisions, and context]')),
      heading(2, t('Decisions')),
      bulletList(
        listItem(italic('[Decision 1 — who approved]') ),
        listItem(italic('[Decision 2 — who approved]')),
      ),
      heading(2, t('Action items')),
      bulletList(
        listItem(
          bold('Owner: '),
          italic('[Name]'),
          t('  ·  '),
          bold('Task: '),
          italic('[What needs to be done]'),
          t('  ·  '),
          bold('Due: '),
          italic('[Date]'),
        ),
        listItem(
          bold('Owner: '),
          italic('[Name]'),
          t('  ·  '),
          bold('Task: '),
          italic('[What needs to be done]'),
          t('  ·  '),
          bold('Due: '),
          italic('[Date]'),
        ),
      ),
      heading(2, t('Next meeting')),
      paragraph(italic('[Date, time, and proposed agenda items]')),
    ),
  },
  {
    id: 'brief',
    label: 'Project brief',
    subtitle: 'Goals & timeline',
    type: 'template',
    title: 'Project brief',
    preview: 'brief',
    contentJson: doc(
      heading(1, t('Project brief')),
      paragraph(
        bold('Project: '),
        italic('[Project name]'),
        t('  ·  '),
        bold('Owner: '),
        italic('[Name]'),
        t('  ·  '),
        bold('Status: '),
        italic('[Draft / In progress / Approved]'),
      ),
      heading(2, t('Summary')),
      paragraph(
        italic(
          '[Write a short overview — what you are building, who it is for, and why it matters now.]',
        ),
      ),
      heading(2, t('Problem statement')),
      paragraph(italic('[What pain point or opportunity does this project address?]')),
      heading(2, t('Goals & success metrics')),
      bulletList(
        listItem(bold('Goal: '), italic('[Primary outcome]'), t(' — '), italic('[How you will measure it]')),
        listItem(bold('Goal: '), italic('[Secondary outcome]'), t(' — '), italic('[How you will measure it]')),
        listItem(bold('Goal: '), italic('[Stretch outcome]'), t(' — '), italic('[How you will measure it]')),
      ),
      heading(2, t('Scope')),
      heading(3, t('In scope')),
      bulletList(
        listItem(italic('[Deliverable or requirement included]')),
        listItem(italic('[Deliverable or requirement included]')),
      ),
      heading(3, t('Out of scope')),
      bulletList(
        listItem(italic('[Explicitly excluded item]')),
        listItem(italic('[Explicitly excluded item]')),
      ),
      heading(2, t('Timeline & milestones')),
      orderedList(
        listItem(bold('Kickoff'), t(' — '), italic('[Date]'), t(' — '), italic('[What happens]')),
        listItem(bold('Milestone 1'), t(' — '), italic('[Date]'), t(' — '), italic('[Deliverable]')),
        listItem(bold('Milestone 2'), t(' — '), italic('[Date]'), t(' — '), italic('[Deliverable]')),
        listItem(bold('Launch / handoff'), t(' — '), italic('[Date]'), t(' — '), italic('[Final deliverable]')),
      ),
      heading(2, t('Stakeholders')),
      bulletList(
        listItem(bold('Sponsor: '), italic('[Name / team]')),
        listItem(bold('Contributors: '), italic('[Names / teams]')),
        listItem(bold('Reviewers: '), italic('[Names / teams]')),
      ),
      heading(2, t('Risks & open questions')),
      bulletList(
        listItem(bold('Risk: '), italic('[Describe risk]'), t(' — '), bold('Mitigation: '), italic('[Plan]')),
        listItem(bold('Question: '), italic('[Unresolved decision or dependency]')),
      ),
    ),
  },
  {
    id: 'report',
    label: 'Weekly report',
    subtitle: 'Team status update',
    type: 'template',
    title: 'Weekly report',
    preview: 'report',
    contentJson: doc(
      heading(1, t('Weekly report')),
      paragraph(
        bold('Week of: '),
        italic('[Date range]'),
        t('  ·  '),
        bold('Author: '),
        italic('[Your name]'),
        t('  ·  '),
        bold('Team: '),
        italic('[Team or project name]'),
      ),
      heading(2, t('Summary')),
      blockquote(
        italic('[2–3 sentences on overall progress, health, and anything leadership should know immediately.]'),
      ),
      heading(2, t('Highlights')),
      bulletList(
        listItem(italic('[Win or completed deliverable this week]')),
        listItem(italic('[Win or completed deliverable this week]')),
        listItem(italic('[Win or completed deliverable this week]')),
      ),
      heading(2, t('In progress')),
      bulletList(
        listItem(
          bold('[Workstream]'),
          t(' — '),
          italic('[Current status]'),
          t(' — '),
          bold('ETA: '),
          italic('[Date]'),
        ),
        listItem(
          bold('[Workstream]'),
          t(' — '),
          italic('[Current status]'),
          t(' — '),
          bold('ETA: '),
          italic('[Date]'),
        ),
      ),
      heading(2, t('Blockers & risks')),
      bulletList(
        listItem(
          bold('Blocker: '),
          italic('[What is stuck]'),
          t(' — '),
          bold('Needs: '),
          italic('[Help required]'),
        ),
        listItem(bold('Risk: '), italic('[What could slip and why]')),
      ),
      heading(2, t('Plan for next week')),
      orderedList(
        listItem(italic('[Priority 1]')),
        listItem(italic('[Priority 2]')),
        listItem(italic('[Priority 3]')),
      ),
      heading(2, t('Notes')),
      paragraph(italic('[Optional context, links, or follow-ups.]')),
    ),
  },
]
