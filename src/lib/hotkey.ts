export const DEFAULT_HOTKEY = 'Ctrl+Shift+O'

const STORAGE_KEY = 'capture-hotkey'

const MODIFIER_CODES = new Set([
  'ControlLeft', 'ControlRight',
  'ShiftLeft', 'ShiftRight',
  'AltLeft', 'AltRight',
  'MetaLeft', 'MetaRight',
])

export type HotkeyResult = { ok: true; hotkey: string } | { ok: false; error: string }

function keyFromCode(code: string): string | null {
  if (/^Key[A-Z]$/.test(code)) return code.slice(3)
  if (/^Digit[0-9]$/.test(code)) return code.slice(5)
  if (/^F([1-9]|1[0-2])$/.test(code)) return code
  if (code === 'Space') return 'Space'
  return null
}

export function hotkeyFromEvent(e: KeyboardEvent): HotkeyResult | null {
  if (MODIFIER_CODES.has(e.code)) return null

  if (e.metaKey) {
    return { ok: false, error: 'Windows key shortcuts are reserved by the system' }
  }

  const key = keyFromCode(e.code)
  if (!key) return { ok: false, error: 'Use a letter, number, F1–F12 or Space' }

  if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
    return { ok: false, error: 'Use at least one modifier (Ctrl, Alt or Shift)' }
  }

  if (e.ctrlKey && e.altKey) {
    return { ok: false, error: 'Ctrl + Alt acts as AltGr on many keyboard layouts' }
  }

  if (e.altKey && e.shiftKey && !e.ctrlKey) {
    return { ok: false, error: 'Alt + Shift switches the keyboard layout in Windows' }
  }

  const modifiers = [e.ctrlKey && 'Ctrl', e.altKey && 'Alt', e.shiftKey && 'Shift'].filter(Boolean)

  return { ok: true, hotkey: [...modifiers, key].join('+') }
}

export function formatHotkey(hotkey: string): string {
  return hotkey.split('+').join(' + ')
}

export function loadHotkey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_HOTKEY
  } catch {
    return DEFAULT_HOTKEY
  }
}

export function saveHotkey(hotkey: string) {
  try {
    localStorage.setItem(STORAGE_KEY, hotkey)
  } catch {
    return
  }
}