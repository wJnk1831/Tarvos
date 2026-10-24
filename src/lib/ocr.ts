import { invoke } from '@tauri-apps/api/core'

export type Region = { left: number; top: number; width: number; height: number }

export type OcrOptions = {
  languages?: string[]
  psm?: number
  format?: {
    preserveLineBreaks?: boolean
    trimWhitespace?: boolean
    removeExtraSpaces?: boolean
  }
}

export async function recognizeRegion(region: Region, options: OcrOptions = {}): Promise<string> {
  const { languages = ['eng'], psm = 6, format } = options
  return invoke<string>('ocr_region', { ...region, languages, psm, format })
}