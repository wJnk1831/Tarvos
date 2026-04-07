import { HistoryItem, OcrOptions } from "@/types/OcrTypes"
import { create } from "zustand"

interface Point {
  x: number
  y: number
}

interface AppState {
  isCapture: boolean
  clickStart: Point
  clickEnd: Point
  ocrOptions: OcrOptions
  ocrHistory: HistoryItem[]
  isWindowFocused: boolean
  toggleHistoryModal: boolean

  setIsCapture: (value: boolean) => void
  setClickStart: (value: Point) => void
  setClickEnd: (value: Point) => void
  setOcrOptions: (value: OcrOptions) => void
  setOcrHistory: (value: HistoryItem[]) => void
  setToggleHistoryModal: (value: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  isCapture: false,
  clickStart: { x: 0, y: 0 },
  clickEnd: { x: 0, y: 0 },
  ocrOptions: {
    languages: ['eng'],
    preserveLineBreaks: true,
    trimWhitespace: false,
    removeExtraSpaces: false,
    copyToClipboard: true,
    saveToHistory: true,
  },
  ocrHistory: [],
  isWindowFocused: true,
  toggleHistoryModal: false,

  setIsCapture: (value) => set({ isCapture: value }),
  setClickStart: (value) => set({ clickStart: value }),
  setClickEnd: (value) => set({ clickEnd: value }),
  setOcrOptions: (value) => set({ ocrOptions: value }),
  setOcrHistory: (value) => set({ ocrHistory: value }),
  setToggleHistoryModal: (value) => set({ toggleHistoryModal: value }),
}))