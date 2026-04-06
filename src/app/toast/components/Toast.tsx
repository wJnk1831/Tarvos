'use client'
import { useEffect, useRef, useState } from 'react'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { LogicalSize, LogicalPosition } from '@tauri-apps/api/dpi'
import { primaryMonitor } from '@tauri-apps/api/window'
import { ToastMessage, ToastType } from '@/types/toast'

const TYPE_STYLES: Record<ToastType, string> = {
  main: 'bg-main',
  success: 'bg-success',
  error: 'bg-error',
  info: 'bg-info',
}

const TOAST_WIDTH = 280
const TOAST_PADDING = 40
const TOAST_DURATION = 2000

export function Toast() {
  const [messages, setMessages] = useState<ToastMessage[]>([])
  const lastHeightRef = useRef<number>(0)

  async function updateWindow(): Promise<void> {
    const webviewWindow = getCurrentWebviewWindow()
    const element = document.getElementById('toast-container')
    const monitor = await primaryMonitor()

    if (element && monitor) {
      const newHeight = messages.length > 0 ? element.offsetHeight : 0

      if (newHeight !== lastHeightRef.current) {
        await webviewWindow.setSize(new LogicalSize(TOAST_WIDTH, newHeight || 1))

        const monitorHeightLogical = monitor.size.height / monitor.scaleFactor
        const newY = monitorHeightLogical - newHeight - TOAST_PADDING

        const currentPos = await webviewWindow.outerPosition()
        const currentXLogical = currentPos.x / monitor.scaleFactor

        await webviewWindow.setPosition(new LogicalPosition(currentXLogical, newY))
        lastHeightRef.current = newHeight
      }
    }
  }

  useEffect(() => {
    updateWindow()
    const observer = new ResizeObserver(() => updateWindow())
    const container = document.getElementById('toast-container')
    if (container) observer.observe(container)
    return () => observer.disconnect()
  }, [messages])

  useEffect(() => {
    let unlistenFn: (() => void) | undefined

    const setup = async () => {
      const webview = getCurrentWebviewWindow()
      unlistenFn = await webview.listen<ToastMessage>('new-notification', (event) => {
        const newMsg = event.payload
        setMessages(prev => [...prev, newMsg])

        setTimeout(() => {
          setMessages(prev => {
            const updated = prev.filter(m => m.id !== newMsg.id)
            if (updated.length === 0) webview.hide()
            return updated
          })
        }, TOAST_DURATION)
      })
    }

    setup()
    return () => { if (unlistenFn) unlistenFn() }
  }, [])

  return (
    <div id="toast-container" className="inline-flex flex-col gap-3 w-70 select-none">
      {messages.map((msg) => (
        <div key={msg.id} className="w-full h-20 glass-card p-4 flex gap-4 items-center animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex gap-3 items-center flex-1 min-w-0 h-full">
            <div className={`status-bar shrink-0 h-full my-auto animate-pulse ${TYPE_STYLES[msg.type]}`} />
            <p className="text-sm tracking-wide text-white truncate">{msg.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}