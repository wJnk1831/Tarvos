'use client'

import { useState } from "react"
import { useAppStore } from "@/shared/store/useAppStore"

interface LanguageOption {
  value: string
  label: string
}

const LANGUAGES: LanguageOption[] = [
  { value: 'eng', label: 'English' },
  { value: 'por', label: 'Português' },
]

export default function Toolbar() {
  const [toggleMenu, setToggleMenu] = useState<boolean>(false)
  const { selectedLanguage, setSelectedLanguage, ocrOptions, setOcrOptions } = useAppStore()

  return (
    <div className="cursor-default self-end p-4 z-50 flex flex-col items-end gap-2">
      <button onClick={() => setToggleMenu(!toggleMenu)} className="btn-glass-secondary">Config</button>

      {toggleMenu && (
        <div className="mt-2 rounded-xl bg-neutral-900/80 backdrop-blur border border-neutral-700/60 p-4 flex flex-col gap-6 text-sm text-neutral-200 shadow-2xl">

          <div className="flex flex-col gap-2">
            <span className="text-neutral-400 text-xs uppercase tracking-wide">Language</span>
            {LANGUAGES.map(lang => (
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
            {[
              { id: 'preserveLineBreaks', label: 'Preserve line breaks' },
              { id: 'trimWhitespace', label: 'Trim whitespace' },
              { id: 'removeExtraSpaces', label: 'Remove extra spaces' }
            ].map(opt => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer hover:text-white transition">
                <input
                  type="checkbox"
                  checked={(ocrOptions as any)[opt.id]}
                  onChange={() => setOcrOptions({ ...ocrOptions, [opt.id]: !(ocrOptions as any)[opt.id] })}
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
        </div>
      )}
    </div>
  )
}