import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { primaryMonitor } from '@tauri-apps/api/window';

const TOAST_DURATION_MS = 4000;
const TOAST_WIDTH = 280;
const TOAST_HEIGHT = 80;
const TOAST_PADDING = 40;

/**
 * @param {Object} options
 * @param {string} [options.message='Done'] 
 * @param {string} [options.type='main'] 
 */
export async function showToast(options = {}) {
  const { message = 'Done', type = 'main' } = options

  const monitor = await primaryMonitor()
  if (!monitor) return

  const x = monitor.size.width - TOAST_WIDTH - TOAST_PADDING
  const y = monitor.size.height - TOAST_HEIGHT - TOAST_PADDING

  const params = new URLSearchParams({ message, type })
  const url = `./toast?${params.toString()}`
  const label = `toast-${Date.now()}`

  const webview = new WebviewWindow(label, {
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
  })

  webview.once('tauri://created', () => {
    webview.show();
    setTimeout(() => webview.close(), TOAST_DURATION_MS)
  })

  webview.once('tauri://error', (err) => {
    console.error('Toast window error:', err)
  })
}