'use client'
import { ChevronDown, Keyboard, Settings2 } from "lucide-react"
import { useEffect, useState } from "react"
import { OCR_LANGUAGES, OCR_LAYOUTS, type OcrFormat, type OcrLanguage, type OcrOptions, type OcrPsm, } from "../types"
import { DEFAULT_HOTKEY, formatHotkey, hotkeyFromEvent } from "../lib/hotkey"

interface Props {
  options: OcrOptions
  onChange: (options: OcrOptions) => void
  hotkey: string
  onHotkeyChange: (hotkey: string) => void
}

const OUTPUT_OPTIONS: { id: keyof OcrFormat; label: string }[] = [
  { id: 'preserveLineBreaks', label: 'Preserve line breaks' },
  { id: 'trimWhitespace', label: 'Trim whitespace' },
  { id: 'removeExtraSpaces', label: 'Remove extra spaces' },
]

const selectClass = "w-full cursor-pointer rounded-lg border border-white/10 bg-[#0f0f11] px-2.5 py-2 text-[12px] text-zinc-300 outline-none transition hover:bg-[#1a1a1d] focus:border-[#ff7a4a]/50"

export default function SettingsModal({ options, onChange, hotkey, onHotkeyChange }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [hotkeyModalOpen, setHotkeyModalOpen] = useState(false)

  const [recording, setRecording] = useState(false)
  const [recordedHotkey, setRecordedHotkey] = useState("")
  const [hotkeyError, setHotkeyError] = useState("")

  useEffect(() => {
    if (!recording) return

    function onKeyDown(e: KeyboardEvent) {
      e.preventDefault()
      e.stopPropagation()

      if (e.code === 'Escape') {
        setRecording(false)
        setHotkeyError("")
        return
      }

      const result = hotkeyFromEvent(e)
      if (!result) return

      if (result.ok) {
        setRecordedHotkey(result.hotkey)
        setHotkeyError("")
        setRecording(false)
      } else {
        setHotkeyError(result.error)
      }
    }

    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [recording])

  function openHotkeyModal() {
    setRecordedHotkey("")
    setHotkeyError("")
    setHotkeyModalOpen(true)
  }

  function closeHotkeyModal() {
    setHotkeyModalOpen(false)
    setRecording(false)
    setRecordedHotkey("")
    setHotkeyError("")
  }

  function saveHotkey() {
    if (!recordedHotkey) return
    onHotkeyChange(recordedHotkey)
    closeHotkeyModal()
  }

  function resetHotkey() {
    onHotkeyChange(DEFAULT_HOTKEY)
    closeHotkeyModal()
  }

  function handleFormatChange(id: keyof OcrFormat) {
    onChange({ ...options, format: { ...options.format, [id]: !options.format[id] } })
  }

  function handleLanguageChange(language: OcrLanguage) {
    onChange({ ...options, language })
  }

  function handlePsmChange(psm: OcrPsm) {
    onChange({ ...options, psm })
  }

  return (
    <div className="absolute right-4 top-4 cursor-default select-none">
      <button className={`flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm backdrop-blur-md transition border-white/10 bg-[#141416] text-zinc-300 hover:bg-[#222226] ${settingsOpen && 'bg-[#151517]'} `} onClick={() => { setSettingsOpen((open) => !open) }} >
        <Settings2 size={14} /> Settings <ChevronDown size={12} className={`transition-transform ${settingsOpen ? "rotate-180" : ""}`} />
      </button>

      {settingsOpen && (
        <div className="absolute right-0 top-10 z-40 w-70 rounded-xl border border-white/10 bg-[#151517] p-4 shadow-2xl shadow-black/50 backdrop-blur-xl">

          <div className="mb-4 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-200">General settings</span>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-500">Recognition</p>

            <div className="flex flex-col gap-2 border-t border-white/5 pt-2.5">
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-zinc-500">Language</span>
                <select
                  value={options.language}
                  onChange={e => handleLanguageChange(e.target.value as OcrLanguage)}
                  className={selectClass}
                >
                  {OCR_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.label}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-zinc-500">Text layout</span>
                <select
                  value={options.psm}
                  onChange={e => handlePsmChange(Number(e.target.value) as OcrPsm)}
                  className={selectClass}
                >
                  {OCR_LAYOUTS.map(layout => (
                    <option key={layout.psm} value={layout.psm}>{layout.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-500">Output formats</p>

            <div className="flex flex-col justify-between gap-3 border-t border-white/5 py-2.5">
              {OUTPUT_OPTIONS.map(opt => (
                <label key={opt.id} className="flex items-center gap-2 cursor-pointer hover:text-white transition">
                  <input
                    type="checkbox"
                    checked={options.format[opt.id]}
                    onChange={() => handleFormatChange(opt.id)}
                    className="accent-orange-500 cursor-pointer"
                  />

                  <span className="text-[12px] text-zinc-400">{opt.label}</span>
                </label>
              ))}

            </div>
          </div>

          <button onClick={openHotkeyModal} className="mt-3 cursor-pointer flex w-full items-center justify-between rounded-lg border border-white/8 p-2.5 text-[12px] text-zinc-300 hover:bg-white/4">
            <span className="flex items-center gap-2"><Keyboard size={13} /> Shortcut</span>
            <kbd>{formatHotkey(hotkey)}</kbd>
          </button>

        </div>
      )}


      {hotkeyModalOpen && (
        <div className="fixed inset-0 z-130 grid place-items-center bg-black/65 p-4 backdrop-blur-sm" >
          <div className="w-full max-w-90 rounded-2xl border border-white/10 bg-[#151517] p-5 shadow-2xl shadow-black/60">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-sm font-semibold text-zinc-100">Capture Shortcut</h2>
                <p className="mt-1 text-[12px] text-zinc-500">Set the key combination to open the overlay.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setRecording(true); setRecordedHotkey(""); setHotkeyError("") }}
              className={`cursor-pointer flex min-h-19 w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed transition ${recording ? "border-[#ff7a4a]/40 bg-[#ff7a4a]/[0.07]" : "border-white/12 bg-black/20 hover:bg-white/2.5"}`}
            >
              <Keyboard size={18} className={recording ? "text-[#ff9668]" : "text-zinc-500"} />
              <span className="text-sm text-zinc-200">
                {recording ? "Press the keys…" : formatHotkey(recordedHotkey || hotkey)}
              </span>
              <span className={`text-[12px] ${hotkeyError ? "text-red-400" : "text-zinc-600"}`}>
                {hotkeyError || (recording ? "Use at least one modifier and one key · Esc to cancel" : "Click to record a different combination")}
              </span>
            </button>
            <div className="mt-5 flex items-center justify-between text-sm">
              <button onClick={resetHotkey} className="cursor-pointer text-[12px] text-zinc-500 transition hover:text-zinc-300">Reset to default</button>
              <div className="flex gap-2">
                <button onClick={closeHotkeyModal} className="cursor-pointer rounded-lg border border-white/8 px-3 py-2 text-zinc-400 hover:bg-white/4">Cancel</button>
                <button onClick={saveHotkey} disabled={!recordedHotkey} className="cursor-pointer rounded-lg bg-[#f5602a] px-4 py-2 font-semibold text-white transition hover:bg-[#ff7a4a] disabled:cursor-not-allowed disabled:opacity-50">Save Shortcut</button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}