import { getCurrentWindow } from '@tauri-apps/api/window'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { useAppStore } from '@/store/useAppStore'
import { ocrService } from '@/core/ocrService'
import { showToast } from '@/core/toastEvents'

export async function handleOnKeyDown(e: KeyboardEvent) {
  if (e.code === 'Tab') {
    e.preventDefault()
  }

  if (e.code === 'Escape') {
    const window = getCurrentWindow()
    await window.hide()
  }
}

export function handleOnMouseDown(e: any) {
  const { setIsCapture, setClickStart, setClickEnd } = useAppStore.getState()
  const isOverlayClick = (e.target as HTMLElement).className?.includes('overlay') ?? false

  if (!isOverlayClick) return

  setClickStart({ x: e.clientX, y: e.clientY })
  setClickEnd({ x: e.clientX, y: e.clientY })
  setIsCapture(true)
}

export function handleOnMouseMove(e: any) {
  const { isCapture, setClickEnd } = useAppStore.getState()

  if (isCapture) {
    setClickEnd({ x: e.clientX, y: e.clientY })
  }
}

export async function handleOnMouseUp(e: any, rect: { left: number; top: number; width: number; height: number }) {
  const { isCapture, setIsCapture, setClickEnd, ocrOptions, setOcrHistory, ocrHistory } = useAppStore.getState()

  if (!isCapture) return

  if (rect.height < 10 || rect.width < 30) {
    showToast({ message: 'No text found in area', type: 'error' })
    setClickEnd({ x: e.clientX, y: e.clientY })
    setIsCapture(false)
    return
  }

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
    console.error('OCR failed:', err)
    const errorMessage = err instanceof Error && err.message === 'EMPTY_OCR_RESULT' ? 'No text found in area' : 'OCR failed'
    showToast({ message: errorMessage, type: 'error' })
  }
}

export async function handleWindowBlur(focused: boolean) {
  const { setToggleHistoryModal } = useAppStore.getState()
  const window = getCurrentWebviewWindow()

  if (!focused) {
    setToggleHistoryModal(false)
    await window.hide()
  }
}
