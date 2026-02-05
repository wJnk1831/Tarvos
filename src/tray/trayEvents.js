import { getCurrentWindow } from "@tauri-apps/api/window"
import { exit } from "@tauri-apps/plugin-process"

export function handleEventsOnTrayIcon(event) {
  const { type, position, button, buttonState } = event

  if (type === 'Click' && button === 'Left') {
    handleInitCapture(event)
  }

}

export async function handleInitCapture(e) {
  const window = getCurrentWindow()

  await window.show()
  await window.setFullscreen(true)
  await window.setFocus()
}

export async function handleFinishApp() {
  await exit(0)
}