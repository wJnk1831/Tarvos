import { ToastMessage, ToastOptions } from '@/types/ToastTypes'
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'
import { primaryMonitor } from '@tauri-apps/api/window'

const TOAST_WIDTH = 280
const TOAST_HEIGHT = 80
const TOAST_PADDING = 40

export async function showToast(options: ToastOptions = {}): Promise<void> {
  const { message = 'Done', type = 'main' } = options
  const toastWin = await WebviewWindow.getByLabel('toast-window')

  if (toastWin) {
    const payload: ToastMessage = { id: Date.now(), text: message, type }
    await toastWin.emit('new-notification', payload)
    await toastWin.show()
  }
}

export async function CreateToastWindow(): Promise<void> {
  const monitor = await primaryMonitor()
  if (!monitor) return

  const x = monitor.size.width - TOAST_WIDTH - TOAST_PADDING
  const y = monitor.size.height - TOAST_HEIGHT - TOAST_PADDING

  const webview = new WebviewWindow('toast-window', {
    url: './toast',
    title: '',
    width: TOAST_WIDTH,
    height: TOAST_HEIGHT,
    x,
    y,
    alwaysOnTop: true,
    decorations: false,
    transparent: true,
    hiddenTitle: true,
    resizable: false,
    focusable: false,
    visible: false,
    skipTaskbar: true,
    shadow: false,
  })

  webview.once('tauri://created', () => {
    webview.show()
  })
}