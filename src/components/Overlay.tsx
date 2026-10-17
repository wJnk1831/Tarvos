'use client'
import { useState } from "react"
import History from "./History"
import SettingsModal from "./SettingsModal"

export default function Overlay() {
  const [capture, setCapture] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [selection, setSelection] = useState({ startX: 0, startY: 0, endX: 0, endY: 0 })
  const [mouseDown, setMouseDown] = useState(false)

  const rect = {
    left: Math.min(selection.startX, selection.endX),
    top: Math.min(selection.startY, selection.endY),
    width: Math.abs(selection.endX - selection.startX),
    height: Math.abs(selection.endY - selection.startY)
  }

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    setMouseDown(true)
    setSelection({ startX: e.clientX, startY: e.clientY, endX: e.clientX, endY: e.clientY })
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!mouseDown) return
    setSelection(prev => ({ ...prev, endX: e.clientX, endY: e.clientY }))
  }

  function onMouseUp() {
    setMouseDown(false)
    if (!mouseDown) return
    console.log(selection)
  }

  return (
    <div className="absolute inset-0 z-10 select-none overflow-hidden">
      <div className="overlay absolute inset-0 cursor-crosshair" onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
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
          <div className="absolute inset-0 bg-black/30" />
        )}
      </div>
      <SettingsModal />
      <History />
    </div>
  )
}