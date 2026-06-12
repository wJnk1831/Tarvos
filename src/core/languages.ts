export interface LanguageOption {
  value: string
  label: string
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { value: 'eng', label: 'English' },
  { value: 'por', label: 'Português' },
]

export const localeToTesseractMap: Record<string, string> = {
  'pt': 'por',
  'en': 'eng',
}

export function detectSystemLanguage(): string {
  const browserLang = typeof navigator !== 'undefined' ? navigator.language : undefined

  const detectedLocale = browserLang || 'en'
  const tesseractCode = localeToTesseractMap[detectedLocale] || 'eng'

  const isValid = SUPPORTED_LANGUAGES.some(lang => lang.value === tesseractCode)
  return isValid ? tesseractCode : 'eng'
}

export function isValidLanguage(code: string): boolean { return SUPPORTED_LANGUAGES.some(lang => lang.value === code) }