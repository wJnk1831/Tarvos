import { TrayIcon, TrayIconEvent } from '@tauri-apps/api/tray'
import { Menu } from '@tauri-apps/api/menu'
import { defaultWindowIcon } from '@tauri-apps/api/app'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { exit } from '@tauri-apps/plugin-process'

export async function createTray(): Promise<TrayIcon> {
  const menu = await Menu.new({
    items: [
      {
        id: 'capture',
        text: 'Get Text',
        action: () => handleInitCapture(),
      },
      {
        id: 'exit',
        text: 'Exit',
        action: () => handleFinishApp(),
      },
    ],
  })

  const tray = await TrayIcon.new({
    icon: await defaultWindowIcon() as any,
    menu,
    menuOnLeftClick: false,
    action: (e: TrayIconEvent) => handleEventsOnTrayIcon(e),
  })

  return tray
}

function handleEventsOnTrayIcon(event: TrayIconEvent): void {
  if (event.type === 'Click' && event.button === 'Left') {
    handleInitCapture()
  }
}

export async function handleInitCapture(): Promise<void> {
  const window = getCurrentWindow()
  await window.show()
  await window.setFullscreen(true)
  await window.setFocus()
}

export async function handleFinishApp(): Promise<void> {
  await exit(0)
}
