import { invoke } from '@tauri-apps/api/core'
import { loadHotkey, saveHotkey, DEFAULT_HOTKEY } from './hotkey'

export function hotkeyToTauri(hotkey: string): string {
  return hotkey
    .split('+')
    .map(part => {
      if (part === 'Ctrl') return 'CmdOrControl'
      if (part === 'Alt') return 'Alt'
      if (part === 'Shift') return 'Shift'
      return part
    })
    .join('+')
}

export async function registerCaptureShortcut(hotkey: string): Promise<void> {
  const tauriShortcut = hotkeyToTauri(hotkey)
  try {
    await invoke('register_global_shortcut', { shortcut: tauriShortcut })
  } catch (err) {
    console.error('Failed to register global shortcut:', err)
  }
}

export async function syncGlobalShortcut(): Promise<string> {
  const hotkey = loadHotkey()
  await registerCaptureShortcut(hotkey)
  return hotkey
}

export {
  DEFAULT_HOTKEY,
  loadHotkey,
  saveHotkey,
}