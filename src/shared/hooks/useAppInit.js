import { useEffect } from "react";
import { registerCaptureHotkey, registerHideHotkey } from "../utils/hotkeys";
import { createTray } from "@/tray/createTray";
import { EventDispatcher } from "@/app/event-handler/EventDispatcher";
import { CreateToastWindow, showToast } from "./showToast";

export function useAppInit() {
  useEffect(() => {
    CreateToastWindow()
    createTray()
    registerCaptureHotkey()
    registerHideHotkey()
    EventDispatcher()
    setTimeout(() => showToast({ message: 'Tarvos is ready', type: 'success' }), 1500)
  }, [])
}