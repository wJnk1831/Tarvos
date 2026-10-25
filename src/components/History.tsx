'use client'

import { ChevronUp, HistoryIcon, Copy } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { writeText } from "@tauri-apps/plugin-clipboard-manager"
import type { HistoryItem } from "../types"

interface Props {
  items: HistoryItem[]
}

const COPIED_FEEDBACK_MS = 1000

export default function History({ items }: Props) {
  const [historyOpen, setHistoryOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  async function handleCopy(item: HistoryItem) {
    try {
      await writeText(item.text)

      if (timerRef.current) clearTimeout(timerRef.current)
      setCopiedId(item.id)
      timerRef.current = setTimeout(() => setCopiedId(null), COPIED_FEEDBACK_MS)
    } catch (error) {
      console.error("Failed to copy text:", error)
    }
  }

  return (
    <div className="absolute bottom-5 right-4 z-40 w-65 cursor-default">
      <div className="flex flex-col items-stretch gap-2">
        <button
          type="button"
          onClick={() => setHistoryOpen(open => !open)}
          className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-t-lg border border-white/10 bg-[#141416] px-3 text-zinc-300 shadow-lg backdrop-blur-xl transition hover:bg-[#222226]"
        >
          <div className="flex items-center gap-2">
            <HistoryIcon size={14} />
            <span className="text-[10px] font-medium">History</span>
            <span className="rounded-md bg-white/[0.07] px-1.5 py-0.5 text-[9px] text-zinc-400">{items.length}</span>
          </div>
          <ChevronUp size={12} className={`ml-1 transition-transform ${historyOpen ? "rotate-180" : ""}`} />
        </button>

        {historyOpen && (
          <div className="mb-2 w-full overflow-hidden rounded-b-2xl border border-white/10 bg-[#141416] shadow-2xl shadow-black/50 backdrop-blur-xl">
            <div className="history-scroll max-h-65 overflow-y-auto p-2">
              {items.length === 0 ? (
                <div className="px-3 py-8 text-center">
                  <HistoryIcon size={18} className="mx-auto mb-2 text-zinc-700" />
                  <p className="text-[10px] text-zinc-500">No captures found.</p>
                </div>
              ) : (
                items.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleCopy(item)}
                    className="mb-1 flex w-full cursor-pointer items-start gap-3 rounded-lg border border-transparent p-3 text-left transition hover:bg-white/4"
                  >
                    <div className="relative min-w-0 flex-1">
                      <p className="line-clamp-3 whitespace-pre-wrap text-[10px] leading-4 text-zinc-300">{item.text}</p>
                      <span
                        className={`pointer-events-none absolute inset-0 flex items-center justify-center rounded bg-[#141416]/90 text-[10px] font-medium text-[#ff9668] transition-opacity duration-150 ${copiedId === item.id ? "opacity-100" : "opacity-0"}`}
                      >
                        Copied
                      </span>
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