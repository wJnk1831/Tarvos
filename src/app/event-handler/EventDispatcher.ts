'use client'
import { handleOnKeyDown, handleWindowBlur } from "./GlobalEvents"
import { getCurrentWindow } from "@tauri-apps/api/window"

export function EventDispatcher() {

  const window = getCurrentWindow()

  document.addEventListener("keydown", handleOnKeyDown)
  const unlisten = window.onFocusChanged(async ({ payload: focused }) => handleWindowBlur(focused))

  return () => {
    document.removeEventListener("keydown", handleOnKeyDown)
    unlisten.then(fn => fn())
  }
}