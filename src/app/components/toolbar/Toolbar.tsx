'use client'

import { SUPPORTED_LANGUAGES } from "@/core/languages"
import { useAppStore } from "@/store/useAppStore"

interface OutputOption {
  id: keyof Pick<import('@/types').OcrOptions, 'preserveLineBreaks' | 'trimWhitespace' | 'removeExtraSpaces'>
  label: string
}

const OUTPUT_OPTIONS: OutputOption[] = [
  { id: 'preserveLineBreaks', label: 'Preserve line breaks' },
  { id: 'trimWhitespace', label: 'Trim whitespace' },
  { id: 'removeExtraSpaces', label: 'Remove extra spaces' },
]

export default function Toolbar() {
  const { toolbarMenuOpen, setToolbarMenuOpen, selectedLanguage, setSelectedLanguage, ocrOptions, setOcrOptions, isChangeHotKeyModalOpen, setIsChangeHotKeyModalOpen } = useAppStore()

  const handleOutputChange = (optId: OutputOption['id']) => {
    setOcrOptions({
      ...ocrOptions,
      [optId]: !ocrOptions[optId],
    })
  }

  return (
    <div className="cursor-default self-end p-4 z-50 flex flex-col items-end gap-2">
      <button onClick={() => setToolbarMenuOpen(!toolbarMenuOpen)} className="btn-glass-secondary outline-0">Config</button>

      {toolbarMenuOpen && (
        <div className="mt-2 rounded-xl bg-neutral-900/80 backdrop-blur border border-neutral-700/60 p-4 flex flex-col gap-6 text-sm text-neutral-200 shadow-2xl">

          <div className="flex flex-col gap-2">
            <span className="text-neutral-400 text-xs uppercase tracking-wide">Language</span>
            {SUPPORTED_LANGUAGES.map(lang => (
              <label key={lang.value} className="flex items-center gap-2 cursor-pointer hover:text-white transition">
                <input
                  type="radio"
                  name="language"
                  value={lang.value}
                  checked={selectedLanguage === lang.value}
                  onChange={() => setSelectedLanguage(lang.value)}
                  className="accent-orange-500 cursor-pointer"
                />
                {lang.label}
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-neutral-400 text-xs uppercase tracking-wide">Output</span>
            {OUTPUT_OPTIONS.map(opt => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer hover:text-white transition">
                <input
                  type="checkbox"
                  checked={ocrOptions[opt.id]}
                  onChange={() => handleOutputChange(opt.id)}
                  className="accent-orange-500 cursor-pointer"
                />
                {opt.label}
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-neutral-400 text-xs uppercase tracking-wide">Behavior</span>
            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition">
              <input
                type="checkbox"
                checked={ocrOptions.copyToClipboard}
                onChange={() => setOcrOptions({ ...ocrOptions, copyToClipboard: !ocrOptions.copyToClipboard })}
                className="accent-orange-500 cursor-pointer"
              />
              Copy to clipboard
            </label>
          </div>

          <button onClick={() => setIsChangeHotKeyModalOpen(!isChangeHotKeyModalOpen)} className="btn-glass-ghost">Change hot Key</button>
        </div>
      )}
    </div>
  )
}
