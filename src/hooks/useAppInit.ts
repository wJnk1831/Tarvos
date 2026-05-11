import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { registerCaptureHotkey, registerHideHotkey } from "@/core/hotkeys";
import { createTray } from "@/core/tray";
import { handleOnKeyDown, handleWindowBlur } from "@/hooks/useCapture";
import { CreateToastWindow, showToast } from "@/core/toastEvents";
import { invoke } from "@tauri-apps/api/core";
import { useAppStore } from "@/store/useAppStore";

export function useAppInit() {
  useEffect(() => {
    let focusUnlistenPromise: Promise<() => void> | undefined

    const init = async () => {
      CreateToastWindow()
      createTray()
      registerCaptureHotkey()
      registerHideHotkey()

      // Global keyboard listener
      document.addEventListener('keydown', handleOnKeyDown)

      // Window focus listener
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
  }, [])
}
