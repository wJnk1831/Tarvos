import { TrayIcon } from '@tauri-apps/api/tray'
import { Menu } from '@tauri-apps/api/menu'
import { defaultWindowIcon } from '@tauri-apps/api/app'
import { handleEventsOnTrayIcon, handleFinishApp, handleInitCapture } from './trayEvents'

export async function createTray() {
  const menu = await Menu.new({
    items: [
      {
        id: 'capture',
        text: 'get text',
        action: (e) => handleInitCapture(e),
      },
      {
        id: 'exit',
        text: 'exit',
        action: (e) => handleFinishApp(e),

      },
    ],
  })

  const tray = await TrayIcon.new({
    icon: await defaultWindowIcon(),
    menu,
    menuOnLeftClick: false,
    action: (e) => handleEventsOnTrayIcon(e),
  })

  return tray
}
