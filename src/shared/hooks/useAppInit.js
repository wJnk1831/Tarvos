import { useEffect } from "react";
import { registerCaptureHotkey, registerHideHotkey } from "../utils/hotkeys";
import { createTray } from "@/tray/createTray";
import { EventDispatcher } from "@/app/event-handler/EventDispatcher";

export function useAppInit() {
  useEffect(() => {
    createTray()
    registerCaptureHotkey()
    registerHideHotkey()
    EventDispatcher()
  }, [])
}