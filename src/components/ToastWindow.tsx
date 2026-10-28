import { useEffect, useMemo, useRef, useState } from 'react'
import { emit } from '@tauri-apps/api/event'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { LogicalPosition, LogicalSize } from '@tauri-apps/api/dpi'
import { primaryMonitor } from '@tauri-apps/api/window'
import type { ToastItem, ToastType } from '../lib/toast'

const WIDTH = 280
const PADDING = 16
const DURATION = 3000

const styles: Record<ToastType, { color: string; icon: string }> = {
  default: {
    color: 'text-zinc-400',
    icon: '•',
  },
  success: {
    color: 'text-emerald-500',
    icon: '✓',
  },
  error: {
    color: 'text-red-500',
    icon: '!',
  },
  info: {
    color: 'text-sky-500',
    icon: 'i',
  },
}

export default function ToastWindow() {
  const [items, setItems] = useState<ToastItem[]>([])
  const timers = useRef(
    new Map<number, ReturnType<typeof setTimeout>>(),
  )

  const win = useMemo(() => getCurrentWebviewWindow(), [])

  useEffect(() => {
    let disposed = false
    let unlisten: (() => void) | undefined
    const localTimers = timers.current

    async function setup() {
      const stop = await win.listen<ToastItem>(
        'toast:new',
        ({ payload }) => {
          const previousTimer = localTimers.get(payload.id)

          if (previousTimer) {
            clearTimeout(previousTimer)
          }

          setItems((current) => {
            const exists = current.some(
              (item) => item.id === payload.id,
            )

            if (exists) {
              return current.map((item) =>
                item.id === payload.id ? payload : item,
              )
            }

            return [...current, payload]
          })

          const timer = setTimeout(() => {
            localTimers.delete(payload.id)

            setItems((current) =>
              current.filter((item) => item.id !== payload.id),
            )
          }, DURATION)

          localTimers.set(payload.id, timer)
        },
      )

      if (disposed) {
        stop()
        return
      }

      unlisten = stop

      await emit('toast:ready')
    }

    void setup().catch(console.error)

    return () => {
      disposed = true
      unlisten?.()

      localTimers.forEach(clearTimeout)
      localTimers.clear()
    }
  }, [win])

  useEffect(() => {
    let cancelled = false

    async function fitWindow() {
      try {
        if (items.length === 0) {
          try {
            await win.hide()
          } catch {
            // ignore hide errors
          }

          if (!cancelled) {
            try {
              await win.setSize(new LogicalSize(WIDTH, 1))
            } catch {
              // ignore size errors
            }
          }

          return
        }

        const element = document.getElementById('toast-list')

        if (!element) return

        const height = element.scrollHeight
        const monitor = await primaryMonitor()

        if (!monitor || cancelled) return

        const scale = monitor.scaleFactor
        const monitorWidth = monitor.size.width / scale
        const monitorHeight = monitor.size.height / scale

        await win.setSize(
          new LogicalSize(WIDTH, height),
        )

        if (cancelled) return

        await win.setPosition(
          new LogicalPosition(
            Math.max(
              PADDING,
              monitorWidth - WIDTH - PADDING,
            ),
            monitorHeight - height - PADDING,
          ),
        )
      } catch (error) {
        console.error('Error', error)
      }
    }

    void fitWindow()

    return () => {
      cancelled = true
    }
  }, [items, win])

  useEffect(() => {
    document.documentElement.style.background = 'transparent'
    document.body.style.background = 'transparent'
    document.body.style.margin = '0'

    return () => {
      document.documentElement.style.background = ''
      document.body.style.background = ''
      document.body.style.margin = ''
    }
  }, [])

  return (
    <div
      id="toast-list"
      className="flex w-70 flex-col gap-3 bg-transparent p-0"
    >
      {items.map((item) => {
        const style = styles[item.type]

        return (
          <div
            key={item.id}
            className="
              flex min-h-16.5 w-full items-center gap-4
              rounded-[15px] border border-[#222224]
              bg-[#111113] px-5 py-4
              shadow-[0_4px_16px_rgba(0,0,0,0.18)]
              select-none
            "
          >
            <span
              className={`
                flex h-5 w-5 shrink-0
                items-center justify-center rounded-full
                border-2 border-current text-[13px]
                font-semibold leading-none ${style.color}
              `}
              aria-hidden="true"
            >
              {style.icon}
            </span>

            <p className="min-w-0 flex-1 wrap-break-word text-[12px] font-medium text-[#E4E4E7]">
              {item.text}
            </p>
          </div>
        )
      })}
    </div>
  )
}