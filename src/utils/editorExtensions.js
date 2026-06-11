import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { ExtendedImageResize } from '../extensions/ExtendedImageResize'

export const editorExtensions = [
  StarterKit,
  Underline,
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  ExtendedImageResize.configure({
    inline: false,
    allowBase64: true,
    minWidth: 80,
    maxWidth: 760,
  }),
]

export function migrateImageNodes(content) {
  if (!content || typeof content !== 'object') return content

  if (Array.isArray(content)) {
    return content.map(migrateImageNodes)
  }

  const next = { ...content }
  if (next.type === 'image') {
    next.type = 'imageResize'
  }
  if (Array.isArray(next.content)) {
    next.content = next.content.map(migrateImageNodes)
  }
  return next
}

export const TEXT_COLORS = [
  { label: 'Default', value: null },
  { label: 'Red', value: '#d93025' },
  { label: 'Orange', value: '#e8710a' },
  { label: 'Yellow', value: '#f9ab00' },
  { label: 'Green', value: '#188038' },
  { label: 'Blue', value: '#1a73e8' },
  { label: 'Purple', value: '#9334e6' },
  { label: 'Gray', value: '#5f6368' },
]

export const HIGHLIGHT_COLORS = [
  { label: 'None', value: null },
  { label: 'Yellow', value: '#fef9c3' },
  { label: 'Green', value: '#dcfce7' },
  { label: 'Cyan', value: '#cffafe' },
  { label: 'Blue', value: '#dbeafe' },
  { label: 'Pink', value: '#fce7f3' },
  { label: 'Orange', value: '#ffedd5' },
  { label: 'Purple', value: '#f3e8ff' },
]

export function readImageAsDataUrl(file, maxBytes = 5 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select an image file.'))
      return
    }
    if (file.size > maxBytes) {
      reject(new Error('Image must be under 5 MB.'))
      return
    }

    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Failed to read image.'))
    reader.readAsDataURL(file)
  })
}

export async function insertImageFile(editor, file) {
  const src = await readImageAsDataUrl(file)
  editor.chain().focus().setImage({ src }).run()
}

export function insertImageFromClipboard(editor, clipboardData) {
  if (!clipboardData) return false

  const items = clipboardData.items
  if (items) {
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (!file) continue
        insertImageFile(editor, file).catch(() => {})
        return true
      }
    }
  }

  const files = clipboardData.files
  if (files?.length) {
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        insertImageFile(editor, file).catch(() => {})
        return true
      }
    }
  }

  return false
}

export function insertImageFromDrop(editor, dataTransfer) {
  if (!dataTransfer?.files?.length) return false

  let handled = false
  for (const file of dataTransfer.files) {
    if (file.type.startsWith('image/')) {
      insertImageFile(editor, file).catch(() => {})
      handled = true
    }
  }
  return handled
}
