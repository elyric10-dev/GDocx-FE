import { useEditorState } from '@tiptap/react'
import { NodeSelection } from '@tiptap/pm/state'
import { TEXT_WRAP_MODES } from '../extensions/ExtendedImageResize'

const MODES = [
  { id: TEXT_WRAP_MODES.BLOCK, label: 'Block', title: 'Block layout' },
  { id: TEXT_WRAP_MODES.WRAP_LEFT, label: 'Wrap L', title: 'Text wraps on the right' },
  { id: TEXT_WRAP_MODES.WRAP_RIGHT, label: 'Wrap R', title: 'Text wraps on the left' },
  { id: TEXT_WRAP_MODES.BEHIND, label: 'Behind', title: 'Image behind text — drag to move' },
  { id: TEXT_WRAP_MODES.FRONT, label: 'Front', title: 'Image in front of text — drag to move' },
]

function normalizeWrap(value) {
  return value && Object.values(TEXT_WRAP_MODES).includes(value) ? value : TEXT_WRAP_MODES.BLOCK
}

export default function ImageWrapToolbar({ editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      const { selection } = currentEditor.state
      const isImageSelected =
        currentEditor.isFocused &&
        selection instanceof NodeSelection &&
        selection.node.type.name === 'imageResize'

      return {
        isImageSelected,
        textWrap: isImageSelected
          ? normalizeWrap(selection.node.attrs.textWrap)
          : TEXT_WRAP_MODES.BLOCK,
      }
    },
  })

  if (!state?.isImageSelected) return null

  const isLayered =
    state.textWrap === TEXT_WRAP_MODES.BEHIND || state.textWrap === TEXT_WRAP_MODES.FRONT

  return (
    <div className="sticky top-[108px] z-20 border-b border-[#dadce0]/50 bg-[#f8f9fa]/90 px-4 py-2 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[816px] flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-[#5f6368]">Text wrapping</span>
        <div className="flex flex-wrap gap-1">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              title={mode.title}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => editor.chain().focus().setImageTextWrap(mode.id).run()}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                state.textWrap === mode.id
                  ? 'bg-[#e8f0fe] text-[#1a73e8] ring-1 ring-[#1a73e8]/30'
                  : 'bg-white text-[#444746] hover:bg-[#f1f3f4] ring-1 ring-[#dadce0]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
        {isLayered && (
          <span className="text-xs text-[#80868b]">
            Hold Alt/Option and click to reselect · drag to move
          </span>
        )}
      </div>
    </div>
  )
}
