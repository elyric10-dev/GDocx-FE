import { generateHTML } from '@tiptap/html'
import { generateText } from '@tiptap/core'
import { editorExtensions } from './editorExtensions'

export { editorExtensions }

function sanitizeFilename(title) {
  const safe = title.trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase()
  return safe || 'document'
}

function triggerDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadDocument(title, contentJson, format) {
  const baseName = sanitizeFilename(title)

  if (format === 'json') {
    triggerDownload(
      JSON.stringify(contentJson, null, 2),
      `${baseName}.json`,
      'application/json',
    )
    return
  }

  if (format === 'html') {
    const body = generateHTML(contentJson, editorExtensions)
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title.replace(/</g, '&lt;')}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 816px; margin: 2rem auto; padding: 0 1rem; color: #202124; line-height: 1.5; }
    h1 { font-size: 1.75rem; margin: 0.5em 0 0.25em; }
    h2 { font-size: 1.375rem; margin: 0.5em 0 0.25em; }
    h3 { font-size: 1.125rem; margin: 0.5em 0 0.25em; }
    p { margin: 0 0 0.25em; }
    ul, ol { margin: 0.25em 0; padding-left: 1.5rem; }
    blockquote { border-left: 3px solid #dadce0; margin: 0.25em 0; padding-left: 0.75em; color: #5f6368; }
    pre { background: #f1f3f4; border-radius: 4px; padding: 0.75rem; overflow-x: auto; }
    hr { border: none; border-top: 1px solid #dadce0; margin: 1rem 0; }
    img { max-width: 100%; height: auto; border-radius: 4px; margin: 0.5em 0; }
    mark { border-radius: 2px; padding: 0.1em 0; }
  </style>
</head>
<body>
  <h1>${title.replace(/</g, '&lt;')}</h1>
  ${body}
</body>
</html>`
    triggerDownload(html, `${baseName}.html`, 'text/html')
    return
  }

  if (format === 'txt') {
    const text = generateText(contentJson, editorExtensions)
    triggerDownload(`${title}\n\n${text}`, `${baseName}.txt`, 'text/plain')
  }
}
