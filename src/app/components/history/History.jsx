'use client'

import { useAppStore } from "@/shared/store/useAppStore"
import { useState } from "react"

export default function History() {
  const { toggleHistoryModal, setToggleHistoryModal, ocrHistory } = useAppStore()
  const [copiedId, setCopiedId] = useState(null)

  async function handleCopyTextToClipboard(text, id) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1000)
  }

  return (
    <div className="mr-4 mb-3 self-end z-50 flex flex-col items-end cursor-default">
      <div className="w-[280px] flex flex-col items-stretch">
        <button
          onClick={() => setToggleHistoryModal(!toggleHistoryModal)}
          className="w-full cursor-pointer px-4 py-2 rounded-lg bg-neutral-900/80 backdrop-blur border text-center border-neutral-700/60 text-neutral-200 hover:text-white hover:opacity-80 transition"
        >
          History
        </button>

        {toggleHistoryModal && (
          <div className="mt-2 w-full max-h-[260px] overflow-auto rounded-xl bg-neutral-900/80 backdrop-blur border border-neutral-700/60 shadow-[0_0_30px_rgba(0,0,0,0.6)] p-3 flex flex-col gap-3 scrollbar-primary">
            {ocrHistory.map((data) => (
              <div
                key={data.id}
                onClick={() => handleCopyTextToClipboard(data.text, data.id)}
                className="relative cursor-pointer rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-sm text-neutral-200 hover:border-orange-500/40 hover:bg-neutral-800/60 transition"
              >
                {copiedId === data.id && (
                  <div className="absolute inset-0 rounded-lg bg-black/70 flex items-center justify-center text-orange-400 font-medium">
                    Copied
                  </div>
                )}
                <span className="line-clamp-3">{data.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
