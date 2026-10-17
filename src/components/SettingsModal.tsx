'use client'
import { ChevronDown, Keyboard, Settings2, } from "lucide-react";
import { useState } from "react";

export default function SettingsModal() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [hotkeyModalOpen, setHotkeyModalOpen] = useState(false)

  const [hotkey, setHotkey] = useState('Ctrl + Shift + X')
  const [recording, setRecording] = useState(false)
  const [recordedHotkey, setRecordedHotkey] = useState("")

  const OUTPUT_OPTIONS = [
    { id: 'preserveLineBreaks', label: 'Preserve line breaks' },
    { id: 'trimWhitespace', label: 'Trim whitespace' },
    { id: 'removeExtraSpaces', label: 'Remove extra spaces' },
  ]

  return (
    <div className="absolute right-4 top-7 cursor-default select-none">
      <button className={`flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm backdrop-blur-md transition border-white/10 bg-[#141416] text-zinc-300 hover:bg-[#222226] ${settingsOpen && 'bg-[#151517]'} `} onClick={() => { setSettingsOpen((open) => !open) }} >
        <Settings2 size={14} /> Settings <ChevronDown size={12} className={`transition-transform ${settingsOpen ? "rotate-180" : ""}`} />
      </button>

      {settingsOpen && (
        <div className="absolute right-0 top-10 z-40 w-70 rounded-xl border border-white/10 bg-[#151517] p-4 shadow-2xl shadow-black/50 backdrop-blur-xl">

          <div className="mb-4 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-200">General settings</span>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-500">Output formats</p>

            <div className="flex flex-col justify-between gap-3 border-t border-white/5 py-2.5">
              {OUTPUT_OPTIONS.map(opt => (
                <label key={opt.id} className="flex items-center gap-2 cursor-pointer hover:text-white transition">
                  <input
                    type="checkbox"
                    // checked={ocrOptions[opt.id]}
                    // onChange={() => handleOutputChange(opt.id)}
                    className="accent-orange-500 cursor-pointer"
                  />

                  <span className="text-[12px] text-zinc-400">{opt.label}</span>
                </label>
              ))}

            </div>
          </div>

          <button onClick={() => setHotkeyModalOpen(true)} className="mt-3 cursor-pointer flex w-full items-center justify-between rounded-lg border border-white/8 p-2.5 text-[12px] text-zinc-300 hover:bg-white/4">
            <span className="flex items-center gap-2"><Keyboard size={13} /> Shortcut</span>
            <kbd>{hotkey}</kbd>
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
              onClick={() => { setRecording(true); setRecordedHotkey("") }}
              className={`cursor-pointer flex min-h-19 w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed transition ${recording ? "border-[#ff7a4a]/40 bg-[#ff7a4a]/[0.07]" : "border-white/12 bg-black/20 hover:bg-white/2.5"}`}
            >
              <Keyboard size={18} className={recording ? "text-[#ff9668]" : "text-zinc-500"} />
              <span className="text-sm text-zinc-200">{recording ? "Press the keys…" : recordedHotkey || hotkey}</span>
              <span className="text-[12px] text-zinc-600">{recording ? "Use at least one modifier and one key" : "Click to record a different combination"}</span>
            </button>
            <div className="mt-5 text-sm flex justify-end gap-2">
              <button onClick={() => { setHotkeyModalOpen(false); setRecording(false) }} className="cursor-pointer rounded-lg border border-white/8 px-3 py-2 text-zinc-400 hover:bg-white/4">Cancel</button>
              <button disabled={!recording} className={`cursor-pointer ${!recording && 'opacity-70'} rounded-lg bg-[#f5602a] px-4 py-2 font-semibold text-white transition hover:bg-[#ff7a4a]`}>Save Shortcut</button>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}

