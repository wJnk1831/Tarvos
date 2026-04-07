import { TrayIcon, TrayIconEvent } from '@tauri-apps/api/tray'
import { Menu } from '@tauri-apps/api/menu'
import { defaultWindowIcon } from '@tauri-apps/api/app'
import { handleEventsOnTrayIcon, handleFinishApp, handleInitCapture } from './trayEvents'

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