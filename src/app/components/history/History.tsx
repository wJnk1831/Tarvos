'use client'

import { useState } from "react"
import { useAppStore } from "@/store/useAppStore"

export default function History() {
  const { toggleHistoryModal, setToggleHistoryModal, ocrHistory } = useAppStore()

  const [copiedId, setCopiedId] = useState<string | number | null>(null)

  const handleCopyTextToClipboard = async (text: string, id: string | number): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="mr-4 mb-3 self-end z-50 flex flex-col items-end cursor-default">
      <div className="w-70 flex flex-col items-stretch">
        <button onClick={() => setToggleHistoryModal(!toggleHistoryModal)} className="w-full cursor-pointer px-4 py-2 rounded-lg bg-neutral-900/80 backdrop-blur border text-center border-neutral-700/60 text-neutral-200 hover:text-white hover:opacity-80 transition">
          History
        </button>

        {toggleHistoryModal && (
          <div className="mt-2 w-full max-h-65 overflow-auto rounded-xl bg-neutral-900/80 backdrop-blur border border-neutral-700/60 shadow-[0_0_30px_rgba(0,0,0,0.6)] p-3 flex flex-col gap-3 scrollbar-primary">
            {ocrHistory.length === 0 && <p className="text-xs text-neutral-500 text-center py-2">No history yet</p>}

            {ocrHistory.length > 0 && (
              ocrHistory.map((data) => (
                <div key={data.id} onClick={() => handleCopyTextToClipboard(data.text, data.id)} className="relative cursor-pointer rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-sm text-neutral-200 hover:border-orange-500/40 hover:bg-neutral-800/60 transition">
                  {copiedId === data.id && (
                    <div className="absolute inset-0 rounded-lg bg-black/70 flex items-center justify-center text-orange-400 font-medium animate-in fade-in duration-200">
                      Copied
                    </div>
                  )}
                  <span className="line-clamp-3">{data.text}</span>
                </div>
              ))
            )}

          </div>
        )}
      </div>
    </div>
  )
}