import { invoke } from '@tauri-apps/api/core'
import { OCR_LANGUAGES, type OcrLanguage, type OcrOptions } from '../types'

export type Region = { left: number; top: number; width: number; height: number }

export const DEFAULT_OCR_OPTIONS: OcrOptions = {
  language: 'eng',
  psm: 6,
  format: {
    preserveLineBreaks: false,
    trimWhitespace: true,
    removeExtraSpaces: false,
  },
}

export function detectSystemLanguage(): OcrLanguage {
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language]

  for (const locale of candidates) {
    const code = locale.toLowerCase().split('-')[0]
    const match = OCR_LANGUAGES.find(l => l.locale === code)
    if (match) return match.code
  }

  return DEFAULT_OCR_OPTIONS.language
}

export function recognizeRegion(
  region: Region,
  options: OcrOptions = DEFAULT_OCR_OPTIONS
): Promise<string> {
  return invoke<string>('ocr_region', {
    ...region,
    languages: [options.language],
    psm: options.psm,
    format: options.format,
  })
}