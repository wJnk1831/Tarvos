import { getCurrentWindow } from "@tauri-apps/api/window"
import { register } from "@tauri-apps/plugin-global-shortcut"

let registeredShortcuts = []

export async function registerCaptureHotkey(shortcut = 'Alt+Shift+S') {
  try {
    await register(shortcut, handleOpenApp)

    registeredShortcuts.push(shortcut)
  } catch (error) {
    console.error('Failed to register hotkey:', error)
  }
}

export async function registerHideHotkey(shortcut = 'Escape') {
  try {
    await register(shortcut, handleCloseApp)

    registeredShortcuts.push(shortcut)
  } catch (error) {
    console.error('Failed to register hotkey:', error)
  }
}

async function handleOpenApp() {
  const window = getCurrentWindow()
  await window.show()
  await window.setFullscreen(true)
  await window.setFocus()
}

async function handleCloseApp() {
  const window = getCurrentWindow()
  await window.hide()
}