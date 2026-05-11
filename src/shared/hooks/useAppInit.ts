import { useEffect } from "react";
import { registerCaptureHotkey, registerHideHotkey } from "../utils/hotkeys";
import { createTray } from "@/tray/createTray";
import { EventDispatcher } from "@/app/event-handler/EventDispatcher";
import { CreateToastWindow, showToast } from "./showToast";
import { invoke } from "@tauri-apps/api/core";
import { useAppStore } from "@/shared/store/useAppStore";

export function useAppInit() {
  useEffect(() => {
    const init = async () => {
      CreateToastWindow()
      createTray()
      registerCaptureHotkey()
      registerHideHotkey()
      EventDispatcher()

      try {
        const systemLang = await invoke<string>("get_system_language_cmd");
        useAppStore.getState().setSystemLanguage(systemLang);
      } catch (err) {
        console.error("Failed to detect system language:", err);
      }

      setTimeout(() => showToast({ message: 'Tarvos is ready', type: 'success' }), 1500)
    }

    init()
  }, [])
}