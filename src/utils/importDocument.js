import { generateJSON } from '@tiptap/html'
import { marked } from 'marked'
import mammoth from 'mammoth'
import { editorExtensions, migrateImageNodes } from './editorExtensions'

export const IMPORT_FORMATS_LABEL = '.txt · .md · .docx · .json · .html'

const SUPPORTED_EXTENSIONS = ['txt', 'md', 'docx', 'json', 'html', 'htm']

const EMPTY_DOC = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
}

function titleFromFilename(filename) {
  const name = filename.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim()
  return name || 'Untitled'
}

function normalizeTipTapJson(contentJson) {
  if (!contentJson || contentJson.type !== 'doc') {
    return EMPTY_DOC
  }

  if (!Array.isArray(contentJson.content) || contentJson.content.length === 0) {
    return { ...contentJson, content: [{ type: 'paragraph' }] }
  }

  return contentJson
}

function textToTipTapJson(text) {
  const trimmed = text.trim()
  if (!trimmed) return EMPTY_DOC

  const blocks = trimmed.split(/\n{2,}/)

  return {
    type: 'doc',
    content: blocks.map((block) => {
      const lines = block.split('\n')
      const content = []

      lines.forEach((line, index) => {
        if (line.length > 0) {
          content.push({ type: 'text', text: line })
        }
        if (index < lines.length - 1) {
          content.push({ type: 'hardBreak' })
        }
      })

      return {
        type: 'paragraph',
        content: content.length > 0 ? content : undefined,
      }
    }),
  }
}

function htmlToTipTapJson(html) {
  const json = generateJSON(html, editorExtensions)
  return normalizeTipTapJson(json)
}

async function parseTextFile(file) {
  const text = await file.text()
  return textToTipTapJson(text)
}

async function parseMarkdownFile(file) {
  const text = await file.text()
  const html = await marked.parse(text)
  return htmlToTipTapJson(html)
}

async function parseDocxFile(file) {
  const buffer = await file.arrayBuffer()
  const result = await mammoth.convertToHtml({ arrayBuffer: buffer })
  return htmlToTipTapJson(result.value)
}

function extractHtmlBody(html) {
  const trimmed = html.trim()
  if (!trimmed) return ''

  if (/<html[\s>]/i.test(trimmed) || /<body[\s>]/i.test(trimmed)) {
    const doc = new DOMParser().parseFromString(trimmed, 'text/html')
    return doc.body?.innerHTML?.trim() || ''
  }

  return trimmed
}

async function parseHtmlFile(file) {
  const text = await file.text()
  const bodyHtml = extractHtmlBody(text)
  if (!bodyHtml) return EMPTY_DOC
  return htmlToTipTapJson(bodyHtml)
}

async function parseJsonFile(file) {
  const text = await file.text()
  let parsed

  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Invalid JSON file. Please upload a valid exported document.')
  }

  if (!parsed || typeof parsed !== 'object' || parsed.type !== 'doc') {
    throw new Error('Invalid document JSON. Expected a TipTap document with type "doc".')
  }

  return migrateImageNodes(parsed)
}

function getExtension(filename) {
  const parts = filename.toLowerCase().split('.')
  return parts.length > 1 ? parts.pop() : ''
}

export function isSupportedImportFile(file) {
  return SUPPORTED_EXTENSIONS.includes(getExtension(file.name))
}

export async function importFileAsDocument(file) {
  if (!isSupportedImportFile(file)) {
    throw new Error('Unsupported file type. Please upload a .txt, .md, .docx, .json, or .html file.')
  }

  const extension = getExtension(file.name)
  let contentJson

  if (extension === 'txt') {
    contentJson = await parseTextFile(file)
  } else if (extension === 'md') {
    contentJson = await parseMarkdownFile(file)
  } else if (extension === 'json') {
    contentJson = await parseJsonFile(file)
  } else if (extension === 'html' || extension === 'htm') {
    contentJson = await parseHtmlFile(file)
  } else {
    contentJson = await parseDocxFile(file)
  }

  return {
    title: titleFromFilename(file.name),
    contentJson: normalizeTipTapJson(contentJson),
  }
}
