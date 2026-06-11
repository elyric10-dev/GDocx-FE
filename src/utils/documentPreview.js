export function formatOpenedDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function extractPreviewLines(title) {
  const words = title.split(/\s+/).filter(Boolean)
  const lines = [
    title.slice(0, 28) || 'Untitled',
    words.length > 2 ? `${words[0]} ${words[1]}…` : 'Start writing here…',
    '—',
    '···',
  ]
  return lines
}
