'use client'

import { useState } from "react"
import { useAppStore } from "@/shared/store/useAppStore"

const LANGUAGES = [
  { value: 'eng', label: 'English' },
  { value: 'por', label: 'Português' },
]

export default function Toolbar() {
  const [toggleMenu, setToggleMenu] = useState(false)
  const { ocrOptions, setOcrOptions } = useAppStore()

  const toggleLanguage = (lang) => {
    const newLanguages = ocrOptions.languages.includes(lang)
      ? ocrOptions.languages.filter(l => l !== lang)
      : [...ocrOptions.languages, lang]

    setOcrOptions({ ...ocrOptions, languages: newLanguages })
  }

  return (
    <div className="cursor-default self-end p-4 z-50 flex flex-col items-end gap-2">
      <button
        onClick={() => setToggleMenu(!toggleMenu)}
        className="btn-glass-secondary"
      >
        Config
      </button>

      {toggleMenu && (
        <div className="mt-2 rounded-xl bg-neutral-900/80 backdrop-blur border border-neutral-700/60 shadow-[0_0_30px_rgba(0,0,0,0.6)] p-4 flex flex-col gap-6 text-sm text-neutral-200">

          <div className="flex flex-col gap-2">
            <span className="text-neutral-400 text-xs uppercase tracking-wide">Languages</span>
            {LANGUAGES.map(lang => (
              <label key={lang.value} className="flex items-center gap-2 cursor-pointer hover:text-white transition">
                <input
                  type="checkbox"
                  checked={ocrOptions.languages.includes(lang.value)}
                  onChange={() => toggleLanguage(lang.value)}
                  className="accent-orange-500"
                />
                {lang.label}
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-neutral-800">
            <span className="text-neutral-400 text-xs uppercase tracking-wide">Output</span>

            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition">
              <input
                type="checkbox"
                checked={ocrOptions.preserveLineBreaks}
                onChange={() => setOcrOptions({ ...ocrOptions, preserveLineBreaks: !ocrOptions.preserveLineBreaks })}
                className="accent-orange-500"
              />
              Preserve line breaks
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition">
              <input
                type="checkbox"
                checked={ocrOptions.trimWhitespace}
                onChange={() => setOcrOptions({ ...ocrOptions, trimWhitespace: !ocrOptions.trimWhitespace })}
                className="accent-orange-500"
              />
              Trim whitespace
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition">
              <input
                type="checkbox"
                checked={ocrOptions.removeExtraSpaces}
                onChange={() => setOcrOptions({ ...ocrOptions, removeExtraSpaces: !ocrOptions.removeExtraSpaces })}
                className="accent-orange-500"
              />
              Remove extra spaces
            </label>
          </div>

          <div className="flex flex-col gap-2 border-neutral-800">
            <span className="text-neutral-400 text-xs uppercase tracking-wide">Behavior</span>

            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition">
              <input
                type="checkbox"
                checked={ocrOptions.copyToClipboard}
                onChange={() => setOcrOptions({ ...ocrOptions, copyToClipboard: !ocrOptions.copyToClipboard })}
                className="accent-orange-500"
              />
              Copy to clipboard
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition">
              <input
                type="checkbox"
                checked={ocrOptions.saveToHistory}
                onChange={() => setOcrOptions({ ...ocrOptions, saveToHistory: !ocrOptions.saveToHistory })}
                className="accent-orange-500"
              />
              Save to history
            </label>
          </div>

        </div>
      )}
    </div>
  )
}
