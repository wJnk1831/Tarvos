export interface HistoryItem {
  id: number
  text: string
}

export const OCR_LANGUAGES = [
  { code: 'eng', locale: 'en', label: 'English' },
  { code: 'por', locale: 'pt', label: 'Português' },
  { code: 'spa', locale: 'es', label: 'Español' },
  { code: 'fra', locale: 'fr', label: 'Français' },
  { code: 'ukr', locale: 'uk', label: 'Українська' },
] as const

export type OcrLanguage = (typeof OCR_LANGUAGES)[number]['code']

export const OCR_LAYOUTS = [
  { psm: 6, label: 'Text block' },
  { psm: 7, label: 'Single line' },
  { psm: 3, label: 'Auto (columns, mixed)' },
] as const

export type OcrPsm = (typeof OCR_LAYOUTS)[number]['psm']

export interface OcrFormat {
  preserveLineBreaks: boolean
  trimWhitespace: boolean
  removeExtraSpaces: boolean
}

export interface OcrOptions {
  language: OcrLanguage
  psm: OcrPsm
  format: OcrFormat
}
