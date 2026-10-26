import { TrayIcon, type TrayIconEvent } from '@tauri-apps/api/tray'
import { Menu } from '@tauri-apps/api/menu'
import { defaultWindowIcon } from '@tauri-apps/api/app'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { exit } from '@tauri-apps/plugin-process'

const TRAY_ID = 'main-tray'

export async function startCapture(): Promise<void> {
  const window = getCurrentWindow()
  await window.show()
  await window.setFullscreen(true)
  await window.setFocus()
}

export async function quitApp(): Promise<void> {
  await exit(0)
}

function handleTrayEvent(event: TrayIconEvent): void {
  if (event.type === 'Click' && event.button === 'Left' && event.buttonState === 'Up') {
    void startCapture()
  }
}

export async function createTray(): Promise<TrayIcon> {
  const existing = await TrayIcon.getById(TRAY_ID)
  if (existing) return existing

  const icon = await defaultWindowIcon()
  if (!icon) console.warn('No default window icon found. Check bundle.icon in tauri.conf.json')

  const menu = await Menu.new({
    items: [
      { id: 'capture', text: 'Start capture', action: () => void startCapture() },
      { id: 'exit', text: 'Exit', action: () => void quitApp() },
    ],
  })

  return TrayIcon.new({
    id: TRAY_ID,
    icon: icon ?? undefined,
    tooltip: 'OCR',
    menu,
    menuOnLeftClick: false,
    action: handleTrayEvent,
  })
}