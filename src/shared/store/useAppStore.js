import { create } from "zustand"

export const useAppStore = create((set) => ({
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