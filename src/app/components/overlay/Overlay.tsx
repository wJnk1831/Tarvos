'use client'
import { handleOnMouseDown, handleOnMouseMove, handleOnMouseUp } from "@/app/event-handler/GlobalEvents"
import { useAppStore } from "@/shared/store/useAppStore"
import History from "@/app/components/history/History"
import Toolbar from "@/app/components/toolbar/Toolbar"

export default function Overlay() {
  const { isCapture, clickStart, clickEnd, ocrHistory } = useAppStore()

  const rect = {
    left: Math.min(clickStart.x, clickEnd.x),
    top: Math.min(clickStart.y, clickEnd.y),
    width: Math.abs(clickEnd.x - clickStart.x),
    height: Math.abs(clickEnd.y - clickStart.y),
  }

  return (
    <div onMouseDown={handleOnMouseDown} onMouseMove={handleOnMouseMove} onMouseUp={(e) => handleOnMouseUp(e, rect)}
      className="inset-0 cursor-crosshair w-screen h-screen select-none flex flex-col justify-between ">
      {!isCapture && <Toolbar />}

      {!isCapture && <div className="overlay absolute inset-0 bg-black/30" />}

      {isCapture && (
        <div
          className="absolute border border-white pointer-events-none"
          style={{
            left: rect.left,
            top: rect.top,
            width: rect.width,  
            height: rect.height,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.30)',
          }}
        />
      )}

      {!isCapture && ocrHistory.length > 0 && <History />}

    </div>
  )
}

