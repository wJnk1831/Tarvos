import { getCurrentWindow } from "@tauri-apps/api/window"
import { isRegistered, register, unregister } from "@tauri-apps/plugin-global-shortcut"
import { useAppStore } from "@/store/useAppStore"

const registeredShortcuts: string[] = []

export async function registerCaptureHotkey(shortcut: string = 'Alt+Shift+S'): Promise<void> {
  try {
    try { await unregister(shortcut) } catch { }

    await register(shortcut, handleOpenApp)
  } catch (error) {
    console.error('Failed to register hotkey:', error)
  }
}

export async function unregisterCaptureHotkey(hotkey: string) {
  const exists = await isRegistered(hotkey)

  if (exists) {
    await unregister(hotkey)
  }
}

export async function registerHideHotkey(shortcut: string = 'Escape'): Promise<void> {
  try {
    await register(shortcut, handleCloseApp)
    registeredShortcuts.push(shortcut)
  } catch (error) {
    console.error('Failed to register hotkey:', error)
  }
}

async function handleOpenApp(): Promise<void> {
  const { setToolbarMenuOpen, setToggleHistoryModal } = useAppStore.getState()
  setToolbarMenuOpen(false)
  setToggleHistoryModal(false)
  const window = getCurrentWindow()
  await window.show()
  await window.setFullscreen(true)
  await window.setFocus()
}

async function handleCloseApp(): Promise<void> {
  const { isChangeHotKeyModalOpen, setIsChangeHotKeyModalOpen } = useAppStore.getState()

  if (isChangeHotKeyModalOpen) {
    setIsChangeHotKeyModalOpen(false)
    return
  }

  const window = getCurrentWindow()
  await window.hide()
}