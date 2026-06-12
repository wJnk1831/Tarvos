export interface LanguageOption {
  value: string
  label: string
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { value: 'eng', label: 'English' },
  { value: 'por', label: 'Português' },
  { value: 'fra', label: 'Français' },
  { value: 'spa', label: 'Español' },
  { value: 'ukr', label: 'Українська' },
]

export const localeToTesseractMap: Record<string, string> = {
  'pt': 'por', 'pt-BR': 'por', 'pt-PT': 'por',
  'en': 'eng', 'en-US': 'eng', 'en-GB': 'eng',
  'fr': 'fra', 'fr-FR': 'fra', 'fr-CA': 'fra',
  'es': 'spa', 'es-ES': 'spa', 'es-MX': 'spa',
  'uk': 'ukr', 'uk-UA': 'ukr',
}

export function detectSystemLanguage(): string {
  const browserLang = typeof navigator !== 'undefined' ? navigator.language : undefined

  const detectedLocale = browserLang || 'en'
  const tesseractCode = localeToTesseractMap[detectedLocale] || 'eng'

  const isValid = SUPPORTED_LANGUAGES.some(lang => lang.value === tesseractCode)
  return isValid ? tesseractCode : 'eng'
}

export function isValidLanguage(code: string): boolean { return SUPPORTED_LANGUAGES.some(lang => lang.value === code) }