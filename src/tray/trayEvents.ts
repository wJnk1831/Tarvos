import { getCurrentWindow } from "@tauri-apps/api/window"
import { exit } from "@tauri-apps/plugin-process"
import { TrayIconEvent } from "@tauri-apps/api/tray"

export function handleEventsOnTrayIcon(event: TrayIconEvent): void {
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