import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { primaryMonitor } from '@tauri-apps/api/window';

const TOAST_DURATION_MS = 2000
const TOAST_WIDTH = 280
const TOAST_HEIGHT = 80
const TOAST_PADDING = 40

/**
 * @param {Object} options
 * @param {string} [options.message='Done'] 
 * @param {string} [options.type='main'] 
 */
export async function showToast(options = {}) {
  const { message = 'Done', type = 'main' } = options

  const toastWin = await WebviewWindow.getByLabel('toast-window')

  if (toastWin) {
    await toastWin.emit('new-notification', { id: Date.now(), text: message, type })

    await toastWin.show()
  }
}

export async function CreateToastWindow() {
  const monitor = await primaryMonitor()
  if (!monitor) return

  const x = monitor.size.width - TOAST_WIDTH - TOAST_PADDING
  const y = monitor.size.height - TOAST_HEIGHT - TOAST_PADDING

  const url = `./toast`

  const webview = new WebviewWindow('toast-window', {
    url,
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
    webview.webview.setAutoSize(true)
  })
}