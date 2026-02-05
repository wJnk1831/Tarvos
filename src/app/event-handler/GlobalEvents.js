import { getCurrentWindow } from "@tauri-apps/api/window";
import { useAppStore } from "../../shared/store/useAppStore";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { ocrService } from "@/core/ocr/ocrService";
import { showToast } from "@/shared/hooks/showToast";

export async function handleOnKeyDown(e) {
  if (e.code === 'Tab') {
    e.preventDefault()
  }

  if (e.code === 'Escape') {
    const window = getCurrentWindow()
    await window.hide()
  }

}

export function handleOnMouseDown(e) {
  const { setIsCapture, setClickStart, setClickEnd } = useAppStore.getState()
  const isOverlayClick = e.target.className.includes('overlay')

  if (!isOverlayClick) return

  setClickStart({ x: e.clientX, y: e.clientY })
  setClickEnd({ x: e.clientX, y: e.clientY })


  setIsCapture(true)

}

export function handleOnMouseMove(e) {
  const { isCapture, setClickStart, setClickEnd } = useAppStore.getState()

  if (isCapture) {
    setClickEnd({ x: e.clientX, y: e.clientY })
  }
}

export async function handleOnMouseUp(e, rect) {
  const { isCapture, setIsCapture, setClickEnd, ocrOptions, setOcrHistory, ocrHistory } = useAppStore.getState()

  if (!isCapture) return

  setClickEnd({ x: e.clientX, y: e.clientY })
  setIsCapture(false)

  const window = getCurrentWebviewWindow()
  await window.hide()

  await new Promise(r => setTimeout(r, 60))

  try {
    const text = await ocrService(rect, ocrOptions)

    showToast({ message: 'Text copied', type: 'success' })
    setOcrHistory([{ id: Date.now(), text }, ...ocrHistory])
  } catch (err) {
    console.error("OCR failed:", err)
    showToast({ message: 'OCR failed', type: 'error' })
  }

}

export async function handleWindowBlur(focused) {
  const { setToggleHistoryModal } = useAppStore.getState()

  const window = getCurrentWebviewWindow()

  if (!focused) {
    setToggleHistoryModal(false)
    await window.hide()
  }
}