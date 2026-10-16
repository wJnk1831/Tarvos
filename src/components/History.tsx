'use client'

import { ChevronUp, HistoryIcon, Copy } from "lucide-react"
import { useState } from "react"

export default function History() {
  const [historyOpen, setHistoryOpen] = useState(false)

  const history = [
    { id: 1, text: "Example OCR text extracted from a screenshot. This is a preview of a saved capture." },
    { id: 2, text: "Another example of extracted text, demonstrating how multiple captures appear in the history list." },
    { id: 3, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore." },
    { id: 4, text: "Sample text from a document, application window, or other selected screen region." },
  ]

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error("Failed to copy text:", error)
    }
  }

  return (
    <div className="absolute bottom-10 right-4 z-40 w-65 cursor-default">
      <div className="flex flex-col items-stretch gap-2">
        <button type="button" onClick={() => setHistoryOpen((open) => !open)} className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-t-lg border border-white/10 bg-[#141416]/90 px-3 text-zinc-300 shadow-lg backdrop-blur-xl transition hover:bg-[#222226]">
          <div className="flex items-center gap-2">
            <HistoryIcon size={14} />
            <span className="text-[10px] font-medium">History</span>
            <span className="rounded-md bg-white/[0.07] px-1.5 py-0.5 text-[9px] text-zinc-400">{history.length}</span>
          </div>
          <ChevronUp size={12} className={`ml-1 transition-transform ${historyOpen ? "rotate-180" : ""}`} />
        </button>

        {historyOpen && (
          <div className="mb-2 w-full overflow-hidden rounded-b-2xl border border-white/10 bg-[#141416]/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <div className="history-scroll max-h-65 overflow-y-auto p-2">
              {history.length === 0 ? (
                <div className="px-3 py-8 text-center">
                  <HistoryIcon size={18} className="mx-auto mb-2 text-zinc-700" />
                  <p className="text-[10px] text-zinc-500">No captures found.</p>
                </div>
              ) : (
                history.map((entry) => (
                  <button key={entry.id} type="button" onClick={() => handleCopy(entry.text)} className="mb-1 flex w-full cursor-pointer items-start gap-3 rounded-lg border border-transparent p-3 text-left transition hover:bg-white/[0.04]">
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-3 whitespace-pre-wrap text-[10px] leading-4 text-zinc-300">{entry.text}</p>
                    </div>
                    <Copy size={12} className="mt-1 shrink-0 text-zinc-600" />
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
