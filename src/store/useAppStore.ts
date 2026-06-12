import { isValidLanguage } from "@/core/languages"
import { HistoryItem, OcrOptions } from "@/types"
import { create } from "zustand"

interface Point {
  x: number
  y: number
}

interface AppState {
  isCapture: boolean
  clickStart: Point
  clickEnd: Point
  systemLanguage: string
  selectedLanguage: string
  ocrOptions: OcrOptions
  ocrHistory: HistoryItem[]
  isWindowFocused: boolean
  toggleHistoryModal: boolean
  toolbarMenuOpen: boolean
  captureHotkey: string
  isChangeHotKeyModalOpen: boolean


  setIsCapture: (value: boolean) => void
  setClickStart: (value: Point) => void
  setClickEnd: (value: Point) => void
  setSystemLanguage: (value: string) => void
  setSelectedLanguage: (value: string) => void
  setOcrOptions: (value: OcrOptions) => void
  setOcrHistory: (value: HistoryItem[]) => void
  setToggleHistoryModal: (value: boolean) => void
  setToolbarMenuOpen: (value: boolean) => void
  setCaptureHotkey: (value: string) => void
  setIsChangeHotKeyModalOpen: (value: boolean) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  isCapture: false,
  clickStart: { x: 0, y: 0 },
  clickEnd: { x: 0, y: 0 },
  systemLanguage: 'eng',
  selectedLanguage: 'eng',
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
  toolbarMenuOpen: false,
  captureHotkey: 'Alt+Shift+S',
  isChangeHotKeyModalOpen: false,

  setIsCapture: (value) => set({ isCapture: value }),
  setClickStart: (value) => set({ clickStart: value }),
  setClickEnd: (value) => set({ clickEnd: value }),
  setSystemLanguage: (value) => {
    const validLanguage = isValidLanguage(value) ? value : 'eng'
    set({
      systemLanguage: value,
      selectedLanguage: get().selectedLanguage === 'eng' ? validLanguage : get().selectedLanguage,
      ocrOptions: {
        ...get().ocrOptions,
        languages: [validLanguage]
      }
    })
  },
  setSelectedLanguage: (value) => {
    const validLanguage = isValidLanguage(value) ? value : 'eng'
    set({
      selectedLanguage: validLanguage,
      ocrOptions: {
        ...get().ocrOptions,
        languages: [validLanguage]
      }
    })
  },
  setOcrOptions: (value) => set({ ocrOptions: value }),
  setOcrHistory: (value) => set({ ocrHistory: value }),
  setToggleHistoryModal: (value) => set({ toggleHistoryModal: value }),
  setToolbarMenuOpen: (value) => set({ toolbarMenuOpen: value }),
  setCaptureHotkey: (value) => set({ captureHotkey: value }),
  setIsChangeHotKeyModalOpen: (value) => set({ isChangeHotKeyModalOpen: value }),
}))