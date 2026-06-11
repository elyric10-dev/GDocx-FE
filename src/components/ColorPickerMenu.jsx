import { useEffect, useRef, useState } from 'react'
import { addColorToHistory, loadColorHistory, normalizeHex } from '../utils/colorHistory'

function ColorSwatch({ color, selected, onClick, title }) {
  const isClear = color === null

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-[#f1f3f4] ${
        selected ? 'bg-[#e8f0fe] ring-2 ring-inset ring-[#1a73e8]' : ''
      }`}
    >
      {isClear ? (
        <span className="relative flex h-6 w-6 items-center justify-center rounded-full border border-[#dadce0] bg-white">
          <span className="absolute h-px w-5 rotate-45 bg-[#d93025]" aria-hidden />
        </span>
      ) : (
        <span
          className="h-6 w-6 rounded-full border border-black/10 shadow-sm"
          style={{ backgroundColor: color }}
        />
      )}
    </button>
  )
}

function CustomColorPicker({ activeColor, presetValues, onPreview, onCommit }) {
  const colorInputRef = useRef(null)
  const onPreviewRef = useRef(onPreview)
  const onCommitRef = useRef(onCommit)
  onPreviewRef.current = onPreview
  onCommitRef.current = onCommit

  const isCustomActive = activeColor && !presetValues.includes(activeColor)
  const [customColor, setCustomColor] = useState(isCustomActive ? activeColor : '#1a73e8')
  const [hexInput, setHexInput] = useState(isCustomActive ? activeColor : '#1a73e8')

  useEffect(() => {
    if (isCustomActive && activeColor) {
      setCustomColor(activeColor)
      setHexInput(activeColor)
    }
  }, [activeColor, isCustomActive])

  useEffect(() => {
    const input = colorInputRef.current
    if (!input) return undefined

    function handleInput(event) {
      const hex = event.target.value.toLowerCase()
      setCustomColor(hex)
      setHexInput(hex)
      onPreviewRef.current(hex)
    }

    function handleChange(event) {
      const hex = event.target.value.toLowerCase()
      setCustomColor(hex)
      setHexInput(hex)
      onCommitRef.current(hex)
    }

    input.addEventListener('input', handleInput)
    input.addEventListener('change', handleChange)
    return () => {
      input.removeEventListener('input', handleInput)
      input.removeEventListener('change', handleChange)
    }
  }, [])

  function applyHexInput() {
    const normalized = normalizeHex(hexInput)
    if (!normalized) return
    setCustomColor(normalized)
    setHexInput(normalized)
    onPreviewRef.current(normalized)
    onCommitRef.current(normalized)
  }

  return (
    <div className="mt-3 border-t border-[#e8eaed] pt-3">
      <p className="mb-2 text-xs font-medium text-[#5f6368]">Custom color</p>
      <div className="flex items-center gap-2">
        <label
          className={`relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#dadce0] transition hover:bg-[#f1f3f4] ${
            isCustomActive ? 'bg-[#e8f0fe] ring-2 ring-inset ring-[#1a73e8]' : ''
          }`}
          title="Open color picker"
        >
          <input
            ref={colorInputRef}
            type="color"
            value={customColor}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <span
            className="pointer-events-none h-6 w-6 rounded-full border border-black/10 shadow-sm"
            style={{ backgroundColor: customColor }}
          />
        </label>

        <input
          type="text"
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
          onBlur={applyHexInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              applyHexInput()
            }
          }}
          placeholder="#000000"
          spellCheck={false}
          className="min-w-0 flex-1 rounded-lg border border-[#dadce0] px-2.5 py-1.5 font-mono text-xs text-[#202124] outline-none focus:border-[#4285f4] focus:ring-2 focus:ring-[#4285f4]/20"
        />
      </div>
    </div>
  )
}

export default function ColorPickerMenu({
  label,
  icon,
  colors,
  activeColor,
  onSelect,
  historyKey,
}) {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState([])
  const ref = useRef(null)

  const presetValues = colors.map((item) => item.value).filter(Boolean)

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    window.document.addEventListener('mousedown', handleClickOutside)
    return () => window.document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (open) {
      setHistory(loadColorHistory(historyKey))
    }
  }, [open, historyKey])

  function previewColor(color) {
    onSelect(color)
  }

  function commitColor(color) {
    if (color) {
      setHistory(addColorToHistory(historyKey, color, presetValues))
    }
    onSelect(color)
  }

  function selectFromHistory(color) {
    setHistory(addColorToHistory(historyKey, color, presetValues))
    onSelect(color)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        title={label}
        className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm text-[#444746] transition hover:bg-[#f1f3f4]"
      >
        {icon}
        <svg className="h-3 w-3 text-[#5f6368]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M7 10l5 5 5-5H7z" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-[220px] rounded-xl border border-[#dadce0] bg-white p-3 shadow-lg">
          <p className="mb-3 text-xs font-medium text-[#5f6368]">{label}</p>
          <div className="grid grid-cols-4 place-items-center gap-1">
            {colors.map((item) => (
              <ColorSwatch
                key={item.label}
                color={item.value}
                title={item.label}
                selected={activeColor === item.value}
                onClick={() => {
                  onSelect(item.value)
                  setOpen(false)
                }}
              />
            ))}
          </div>

          {history.length > 0 && (
            <div className="mt-3 border-t border-[#e8eaed] pt-3">
              <p className="mb-2 text-xs font-medium text-[#5f6368]">Recent colors</p>
              <div className="grid grid-cols-4 place-items-center gap-1">
                {history.map((color) => (
                  <ColorSwatch
                    key={color}
                    color={color}
                    title={color}
                    selected={activeColor === color}
                    onClick={() => selectFromHistory(color)}
                  />
                ))}
              </div>
            </div>
          )}

          <CustomColorPicker
            activeColor={activeColor}
            presetValues={presetValues}
            onPreview={previewColor}
            onCommit={commitColor}
          />
        </div>
      )}
    </div>
  )
}
