'use client'
import { useEffect, useRef, useState } from "react"
import History from "./History"
import SettingsModal from "./SettingsModal"
import { DEFAULT_OCR_OPTIONS, detectSystemLanguage, recognizeRegion } from "../lib/ocr"
import { loadHotkey, saveHotkey } from "../lib/hotkey"
import { writeText } from "@tauri-apps/plugin-clipboard-manager"
import type { HistoryItem, OcrOptions } from "../types"
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow"
import { toast } from "../lib/toast"
import { syncGlobalShortcut } from "../lib/global-shortcut"

const MIN_WIDTH = 30
const MIN_HEIGHT = 10
const MAX_HISTORY = 50
const HIDE_SETTLE_MS = 150

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

export default function Overlay() {
  const [isCapture, setIsCapture] = useState(false)
  const [selection, setSelection] = useState({ startX: 0, startY: 0, endX: 0, endY: 0 })
  const [mouseDown, setMouseDown] = useState(false)
  const [capturing, setCapturing] = useState(false)

  const [ocrOptions, setOcrOptions] = useState<OcrOptions>({ ...DEFAULT_OCR_OPTIONS, language: detectSystemLanguage() })
  const [hotkey, setHotkey] = useState<string>(loadHotkey())
  const [ocrHistory, setOcrHistory] = useState<HistoryItem[]>([])

  const nextId = useRef(0)

  useEffect(() => {
    let cancelled = false

    async function init() {
      const registeredHotkey = await syncGlobalShortcut()
      if (cancelled) return
      if (registeredHotkey !== hotkey) {
        setHotkey(registeredHotkey)
      }
      toast.info(`Tarvos is ready. Press ${registeredHotkey}.`)
    }

    void init()

    return () => {
      cancelled = true
    }
  }, [hotkey])

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === "Escape" && !mouseDown) {
        await getCurrentWebviewWindow().hide()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [mouseDown])

  function handleHotkeyChange(next: string) {
    setHotkey(next)
    saveHotkey(next)
    void syncGlobalShortcut()
  }

  const rect = {
    left: Math.min(selection.startX, selection.endX),
    top: Math.min(selection.startY, selection.endY),
    width: Math.abs(selection.endX - selection.startX),
    height: Math.abs(selection.endY - selection.startY)
  }

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (capturing) return
    setIsCapture(true)
    setMouseDown(true)
    setSelection({ startX: e.clientX, startY: e.clientY, endX: e.clientX, endY: e.clientY })
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!mouseDown) return
    setSelection(prev => ({ ...prev, endX: e.clientX, endY: e.clientY }))
  }

  async function onMouseUp() {
    if (!mouseDown) return

    const region = { ...rect }

    setMouseDown(false)

    if (region.width < MIN_WIDTH || region.height < MIN_HEIGHT) {
      setIsCapture(false)
      return
    }

    setCapturing(true)

    try {
      await getCurrentWebviewWindow().hide()
      await sleep(HIDE_SETTLE_MS)

      const result = (await recognizeRegion(region, ocrOptions)).trim()
      if (!result) {
        toast.error("No text detected in the selected region")
        return
      }

      await writeText(result)

      setOcrHistory(prev =>
        [{ id: nextId.current++, text: result }, ...prev].slice(0, MAX_HISTORY)
      )

      toast.success("Text copied to clipboard")
    } catch (err) {
      console.error("Fail:", err)
      toast.error("OCR failed")
    } finally {
      setCapturing(false)
      setIsCapture(false)
    }
  }

  return (
    <div className="absolute inset-0 z-10 select-none overflow-hidden">
      <div
        className={`overlay absolute inset-0 ${capturing ? 'pointer-events-none' : 'cursor-crosshair'}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        {mouseDown ? (
          <>
            <div className="pointer-events-none fixed inset-x-0 top-0 bg-black/30" style={{ height: rect.top }} />
            <div className="pointer-events-none fixed inset-x-0 bottom-0 bg-black/30" style={{ top: rect.top + rect.height }} />
            <div className="pointer-events-none fixed left-0 bg-black/30" style={{ top: rect.top, width: rect.left, height: rect.height }} />
            <div className="pointer-events-none fixed right-0 bg-black/30" style={{ top: rect.top, left: rect.left + rect.width, height: rect.height }} />
            {rect.width > 0 && rect.height > 0 && (
              <div className="pointer-events-none fixed z-30 border border-[#ff9668] bg-transparent" style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}>
                <span className="absolute -left-px -top-px h-2 w-2 border-l-2 border-t-2 border-white" />
                <span className="absolute -right-px -top-px h-2 w-2 border-r-2 border-t-2 border-white" />
                <span className="absolute -bottom-px -left-px h-2 w-2 border-b-2 border-l-2 border-white" />
                <span className="absolute -bottom-px -right-px h-2 w-2 border-b-2 border-r-2 border-white" />
              </div>
            )}
          </>
        ) : (
          <div className={`absolute inset-0 ${capturing ? '' : 'bg-black/30'}`} />
        )}
      </div>

      {!isCapture && (
        <SettingsModal
          options={ocrOptions}
          onChange={setOcrOptions}
          hotkey={hotkey}
          onHotkeyChange={handleHotkeyChange}
        />
      )}
      <div className={isCapture ? 'invisible' : undefined}>
        <History items={ocrHistory} />
      </div>
    </div>
  )
}