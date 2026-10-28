import { emitTo, listen } from '@tauri-apps/api/event'
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'
import { primaryMonitor } from '@tauri-apps/api/window'

export type ToastType = 'default' | 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  text: string
  type: ToastType
}

const LABEL = 'toast-window'
const WIDTH = 460
const PADDING = 16

let windowPromise: Promise<WebviewWindow | null> | null = null
let nextId = 0

async function createToastWindow(): Promise<WebviewWindow | null> {
  const existing = await WebviewWindow.getByLabel(LABEL)

  if (existing) return existing

  const monitor = await primaryMonitor()

  if (!monitor) return null

  const scale = monitor.scaleFactor
  const monitorWidth = monitor.size.width / scale
  const monitorHeight = monitor.size.height / scale

  let resolveReady!: () => void

  const ready = new Promise<void>((resolve) => {
    resolveReady = resolve
  })

  const stopListening = await listen('toast:ready', () => {
    resolveReady()
  })

  try {
    const win = new WebviewWindow(LABEL, {
      url: '/toast.html',
      title: 'Toast',
      width: WIDTH,
      height: 1,
      x: Math.max(PADDING, monitorWidth - WIDTH - PADDING),
      y: monitorHeight - PADDING,
      decorations: false,
      transparent: true,
      alwaysOnTop: true,
      resizable: false,
      focusable: false,
      skipTaskbar: true,
      shadow: false,
      visible: false,
    })

    await new Promise<void>((resolve, reject) => {
      win.once('tauri://created', () => resolve())
      win.once('tauri://error', (event) => reject(event.payload))
    })

    await Promise.race([
      ready,
      new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error('Timeout ao inicializar a janela de toast')),
          10_000,
        )
      }),
    ])

    return win
  } finally {
    stopListening()
  }
}

async function ensureToastWindow() {
  if (!windowPromise) {
    windowPromise = createToastWindow().catch((error) => {
      windowPromise = null
      throw error
    })
  }

  return windowPromise
}

export async function showToast(
  text: string,
  type: ToastType = 'default',
) {
  const win = await ensureToastWindow()

  if (!win) return

  const payload: ToastItem = {
    id: ++nextId,
    text,
    type,
  }

  await emitTo(win.label, 'toast:new', payload)
  await win.show()
}

export const toast = {
  default: (text: string) => showToast(text, 'default'),
  success: (text: string) => showToast(text, 'success'),
  error: (text: string) => showToast(text, 'error'),
  info: (text: string) => showToast(text, 'info'),
}