import { useEffect, useRef, useState } from 'react'

function MenuDropdown({ label, children }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded px-2.5 py-1 text-sm text-[#202124] transition hover:bg-[#e8eaed]"
      >
        {label}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-md border border-[#dadce0] bg-white py-1 shadow-lg">
          {children({ close: () => setOpen(false) })}
        </div>
      )}
    </div>
  )
}

function MenuItem({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center px-4 py-2 text-left text-sm text-[#202124] transition hover:bg-[#f1f3f4]"
    >
      {children}
    </button>
  )
}

export default function EditorMenuBar({ editor, onDownload }) {
  function runEditorAction(action) {
    if (!editor) return
    action()
  }

  return (
    <div className="flex items-center gap-0.5 border-b border-[#dadce0] bg-white px-2">
      <MenuDropdown label="File">
        {({ close }) => (
          <>
            <MenuItem
              onClick={() => {
                onDownload('html')
                close()
              }}
            >
              Download as HTML
            </MenuItem>
            <MenuItem
              onClick={() => {
                onDownload('txt')
                close()
              }}
            >
              Download as plain text
            </MenuItem>
            <MenuItem
              onClick={() => {
                onDownload('json')
                close()
              }}
            >
              Download as JSON
            </MenuItem>
          </>
        )}
      </MenuDropdown>

      <MenuDropdown label="Edit">
        {({ close }) => (
          <>
            <MenuItem
              onClick={() => {
                runEditorAction(() => editor.chain().focus().undo().run())
                close()
              }}
            >
              Undo
            </MenuItem>
            <MenuItem
              onClick={() => {
                runEditorAction(() => editor.chain().focus().redo().run())
                close()
              }}
            >
              Redo
            </MenuItem>
          </>
        )}
      </MenuDropdown>
    </div>
  )
}
