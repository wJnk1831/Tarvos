import { useEffect } from "react"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { registerCaptureHotkey, registerHideHotkey } from "@/core/hotkeys"
import { createTray } from "@/core/tray"
import { handleOnKeyDown, handleWindowBlur } from "@/hooks/useCapture"
import { CreateToastWindow, showToast } from "@/core/toastEvents"
import { invoke } from "@tauri-apps/api/core"
import { useAppStore } from "@/store/useAppStore"
import { LazyStore } from "@tauri-apps/plugin-store"

const store = new LazyStore("settings.json")

export function useAppInit() {
  const { setCaptureHotkey } = useAppStore.getState()

  useEffect(() => {
    let focusUnlistenPromise: Promise<() => void> | undefined

    const init = async () => {
      let savedHotkey = await store.get<string>("capture_hotkey")

      if (!savedHotkey) {
        savedHotkey = 'Alt+Shift+S'
        await store.set("capture_hotkey", savedHotkey)
        await store.save()
      }

      setCaptureHotkey(savedHotkey)

      CreateToastWindow()
      createTray()
      await registerCaptureHotkey(savedHotkey)
      registerHideHotkey()

      document.addEventListener('keydown', handleOnKeyDown)

      focusUnlistenPromise = getCurrentWindow().onFocusChanged(({ payload: focused }) => {
        handleWindowBlur(focused)
      })

      try {
        const systemLang = await invoke<string>("get_system_language_cmd")
        useAppStore.getState().setSystemLanguage(systemLang)
      } catch (err) {
        console.error("Failed to detect system language:", err)
      }

      setTimeout(() => showToast({ message: 'Tarvos is ready', type: 'success' }), 1500)
    }

    init()

    return () => {
      document.removeEventListener('keydown', handleOnKeyDown)
      if (focusUnlistenPromise) {
        focusUnlistenPromise.then(unlisten => unlisten())
      }
    }
  }, [setCaptureHotkey])
}
