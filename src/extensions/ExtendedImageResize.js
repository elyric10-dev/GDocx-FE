import ImageResize from 'tiptap-extension-resize-image'
import { NodeSelection, Plugin, PluginKey } from '@tiptap/pm/state'

export const TEXT_WRAP_MODES = {
  BLOCK: 'block',
  WRAP_LEFT: 'wrap-left',
  WRAP_RIGHT: 'wrap-right',
  BEHIND: 'behind',
  FRONT: 'front',
}

const LAYERED_MODES = new Set([TEXT_WRAP_MODES.BEHIND, TEXT_WRAP_MODES.FRONT])

const WRAPPER_STYLES = {
  [TEXT_WRAP_MODES.BLOCK]: 'display: flex; margin: 0;',
  [TEXT_WRAP_MODES.WRAP_LEFT]:
    'display: inline-block; float: left; padding-right: 12px; padding-bottom: 8px;',
  [TEXT_WRAP_MODES.WRAP_RIGHT]:
    'display: inline-block; float: right; padding-left: 12px; padding-bottom: 8px;',
  [TEXT_WRAP_MODES.BEHIND]: 'display: block; margin: 0;',
  [TEXT_WRAP_MODES.FRONT]: 'display: block; margin: 0;',
}

function normalizeTextWrap(value) {
  if (value && Object.values(TEXT_WRAP_MODES).includes(value)) return value
  return TEXT_WRAP_MODES.BLOCK
}

function extractWidthFromContainerStyle(containerStyle) {
  if (!containerStyle) return null
  const match = containerStyle.match(/width:\s*([0-9.]+)px/)
  return match ? match[1] : null
}

function resetContainerStyle(containerStyle) {
  const width = extractWidthFromContainerStyle(containerStyle)
  return width
    ? `width: ${width}px; height: auto; cursor: pointer;`
    : 'width: 100%; height: auto; cursor: pointer;'
}

function syncImageWrapDom(view) {
  view.state.doc.descendants((node, pos) => {
    if (node.type.name !== 'imageResize') return

    const dom = view.nodeDOM(pos)
    if (!(dom instanceof HTMLElement)) return

    const mode = normalizeTextWrap(node.attrs.textWrap)
    dom.setAttribute('data-text-wrap', mode)
    dom.classList.add('image-resize-wrapper')
    dom.style.setProperty('--img-x', `${node.attrs.offsetX || 0}px`)
    dom.style.setProperty('--img-y', `${node.attrs.offsetY || 0}px`)
  })
}

function findImagePos(view, wrapper) {
  let found = null
  view.state.doc.descendants((node, pos) => {
    if (node.type.name !== 'imageResize') return
    if (view.nodeDOM(pos) === wrapper) {
      found = pos
      return false
    }
  })
  return found
}

function findLayeredImageAtPoint(view, clientX, clientY) {
  let hit = null

  view.state.doc.descendants((node, pos) => {
    if (node.type.name !== 'imageResize') return
    const mode = normalizeTextWrap(node.attrs.textWrap)
    if (!LAYERED_MODES.has(mode)) return

    const dom = view.nodeDOM(pos)
    if (!(dom instanceof HTMLElement)) return

    const rect = dom.getBoundingClientRect()
    if (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    ) {
      // Prefer front over behind; later nodes over earlier when overlapping
      if (!hit || mode === TEXT_WRAP_MODES.FRONT || pos > hit.pos) {
        hit = { pos, node, mode }
      }
    }
  })

  return hit
}

function clampImageOffset(view, pos, offsetX, offsetY) {
  const dom = view.nodeDOM(pos)
  const parent = view.dom
  if (!(dom instanceof HTMLElement) || !(parent instanceof HTMLElement)) {
    return { offsetX, offsetY }
  }

  const maxX = Math.max(0, parent.clientWidth - dom.offsetWidth)
  const maxY = Math.max(0, parent.clientHeight - dom.offsetHeight)

  return {
    offsetX: Math.min(Math.max(0, offsetX), maxX),
    offsetY: Math.min(Math.max(0, offsetY), maxY),
  }
}

function selectImageAt(view, pos) {
  const { state } = view
  if (state.selection instanceof NodeSelection && state.selection.from === pos) return
  view.dispatch(state.tr.setSelection(NodeSelection.create(state.doc, pos)))
}

function createImageWrapPlugin() {
  let dragState = null

  return new Plugin({
    key: new PluginKey('imageTextWrap'),
    appendTransaction(transactions, _oldState, newState) {
      if (!transactions.some((tr) => tr.docChanged)) return null

      let tr = null

      newState.doc.descendants((node, pos) => {
        if (node.type.name !== 'imageResize') return

        const textWrap = normalizeTextWrap(node.attrs.textWrap)
        const expectedWrapper = WRAPPER_STYLES[textWrap]
        const needsWrapperFix = node.attrs.wrapperStyle !== expectedWrapper

        let nextContainerStyle = node.attrs.containerStyle
        if (textWrap !== TEXT_WRAP_MODES.BLOCK && nextContainerStyle?.includes('margin')) {
          nextContainerStyle = resetContainerStyle(nextContainerStyle)
        }

        const needsContainerFix = nextContainerStyle !== node.attrs.containerStyle

        if (!needsWrapperFix && !needsContainerFix && textWrap === node.attrs.textWrap) return

        tr = tr ?? newState.tr
        tr.setNodeMarkup(pos, null, {
          ...node.attrs,
          textWrap,
          wrapperStyle: expectedWrapper,
          containerStyle: needsContainerFix ? nextContainerStyle : node.attrs.containerStyle,
        })
      })

      return tr
    },
    view(view) {
      syncImageWrapDom(view)

      const setLayerPickMode = (active) => {
        view.dom.classList.toggle('layer-image-pick', active)
        view.dom.classList.toggle('cursor-crosshair', active)
      }

      const onKeyDown = (event) => {
        if (event.key === 'Alt') setLayerPickMode(true)
      }

      const onKeyUp = (event) => {
        if (event.key === 'Alt') setLayerPickMode(false)
      }

      const onBlur = () => setLayerPickMode(false)

      window.addEventListener('keydown', onKeyDown)
      window.addEventListener('keyup', onKeyUp)
      window.addEventListener('blur', onBlur)

      const onPointerMove = (event) => {
        if (!dragState) return
        const dx = event.clientX - dragState.startX
        const dy = event.clientY - dragState.startY
        let nextX = dragState.originX + dx
        let nextY = dragState.originY + dy

        const clamped = clampImageOffset(view, dragState.pos, nextX, nextY)
        dragState.dom.style.setProperty('--img-x', `${clamped.offsetX}px`)
        dragState.dom.style.setProperty('--img-y', `${clamped.offsetY}px`)
      }

      const onPointerUp = (event) => {
        if (!dragState) return

        const dx = event.clientX - dragState.startX
        const dy = event.clientY - dragState.startY
        const { pos, originX, originY, view: editorView } = dragState
        const node = editorView.state.doc.nodeAt(pos)

        if (node) {
          const clamped = clampImageOffset(
            editorView,
            pos,
            originX + dx,
            originY + dy,
          )
          editorView.dispatch(
            editorView.state.tr.setNodeMarkup(pos, null, {
              ...node.attrs,
              offsetX: clamped.offsetX,
              offsetY: clamped.offsetY,
            }),
          )
        }

        dragState = null
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
      }

      const onPointerDown = (event) => {
        const target = event.target
        if (!(target instanceof HTMLElement)) return

        const wrapper = target.closest('[data-text-wrap="behind"], [data-text-wrap="front"]')
        const layerPick = event.altKey || view.dom.classList.contains('layer-image-pick')

        if (!wrapper && layerPick) {
          const hit = findLayeredImageAtPoint(view, event.clientX, event.clientY)
          if (hit) {
            event.preventDefault()
            selectImageAt(view, hit.pos)
          }
          return
        }

        if (!wrapper || !(wrapper instanceof HTMLElement)) return
        if (target.closest('[data-resize-image-ui]')) return

        const pos = findImagePos(view, wrapper)
        if (pos == null) return

        const node = view.state.doc.nodeAt(pos)
        if (!node || node.type.name !== 'imageResize') return

        selectImageAt(view, pos)

        event.preventDefault()
        dragState = {
          view,
          pos,
          dom: wrapper,
          startX: event.clientX,
          startY: event.clientY,
          originX: node.attrs.offsetX || 0,
          originY: node.attrs.offsetY || 0,
        }

        window.addEventListener('pointermove', onPointerMove)
        window.addEventListener('pointerup', onPointerUp)
      }

      view.dom.addEventListener('pointerdown', onPointerDown)

      return {
        update() {
          syncImageWrapDom(view)
        },
        destroy() {
          view.dom.removeEventListener('pointerdown', onPointerDown)
          window.removeEventListener('keydown', onKeyDown)
          window.removeEventListener('keyup', onKeyUp)
          window.removeEventListener('blur', onBlur)
          window.removeEventListener('pointermove', onPointerMove)
          window.removeEventListener('pointerup', onPointerUp)
          setLayerPickMode(false)
        },
      }
    },
  })
}

export const ExtendedImageResize = ImageResize.extend({
  addAttributes() {
    const parent = this.parent?.() ?? {}

    return {
      ...parent,
      textWrap: {
        default: TEXT_WRAP_MODES.BLOCK,
        parseHTML: (element) =>
          normalizeTextWrap(
            element.getAttribute('data-text-wrap') ||
              element.closest('[data-text-wrap]')?.getAttribute('data-text-wrap'),
          ),
        renderHTML: (attributes) => ({
          'data-text-wrap': normalizeTextWrap(attributes.textWrap),
        }),
      },
      offsetX: {
        default: 0,
        parseHTML: (element) => Number(element.getAttribute('data-offset-x')) || 0,
        renderHTML: (attributes) =>
          attributes.offsetX ? { 'data-offset-x': String(attributes.offsetX) } : {},
      },
      offsetY: {
        default: 0,
        parseHTML: (element) => Number(element.getAttribute('data-offset-y')) || 0,
        renderHTML: (attributes) =>
          attributes.offsetY ? { 'data-offset-y': String(attributes.offsetY) } : {},
      },
    }
  },

  addCommands() {
    const parent = this.parent?.() ?? {}

    return {
      ...parent,
      setImageTextWrap:
        (textWrap) =>
        ({ tr, state, dispatch }) => {
          const { selection } = state
          if (!(selection instanceof NodeSelection)) return false

          const node = selection.node
          if (node.type.name !== 'imageResize') return false

          const mode = normalizeTextWrap(textWrap)
          const attrs = {
            ...node.attrs,
            textWrap: mode,
            wrapperStyle: WRAPPER_STYLES[mode] || WRAPPER_STYLES[TEXT_WRAP_MODES.BLOCK],
          }

          if (mode !== TEXT_WRAP_MODES.BLOCK) {
            attrs.containerStyle = resetContainerStyle(node.attrs.containerStyle)
          }

          if (mode === TEXT_WRAP_MODES.BLOCK) {
            attrs.offsetX = 0
            attrs.offsetY = 0
          }

          if (dispatch) {
            const nextTr = tr.setNodeMarkup(selection.from, null, attrs)
            dispatch(nextTr.setSelection(NodeSelection.create(nextTr.doc, selection.from)))
          }
          return true
        },
    }
  },

  addProseMirrorPlugins() {
    const parent = this.parent?.() ?? []
    return [...parent, createImageWrapPlugin()]
  },
})
