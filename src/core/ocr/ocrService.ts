import { OcrConfig, OcrOptions, SelectionRect } from "@/types/OcrTypes"
import { invoke } from "@tauri-apps/api/core"
import { writeText } from '@tauri-apps/plugin-clipboard-manager'

const DEFAULT_CONFIG: OcrOptions = {
  languages: ['eng'],
  preserveLineBreaks: true,
  trimWhitespace: false,
  removeExtraSpaces: false,
}

export async function ocrService(rect: SelectionRect, options: Partial<OcrOptions> = {}): Promise<string> {
  const config: OcrConfig = {
    languages: options.languages || DEFAULT_CONFIG.languages,
    output_format: {
      preserve_line_breaks: options.preserveLineBreaks ?? DEFAULT_CONFIG.preserveLineBreaks,
      trim_whitespace: options.trimWhitespace ?? DEFAULT_CONFIG.trimWhitespace,
      remove_extra_spaces: options.removeExtraSpaces ?? DEFAULT_CONFIG.removeExtraSpaces,
    }
  }

  try {
    const text = await invoke<string>("capture_and_ocr", {
      x: Math.round(rect.left),
      y: Math.round(rect.top),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      config
    })

    if (!text || text.trim().length === 0) {
      throw new Error("EMPTY_OCR_RESULT")
    }

    if (options.copyToClipboard !== false) {
      await writeText(text)
    }

    return text
  } catch (error) {
    console.error("OCR Error:", error)
    throw error
  }
}