import { invoke } from "@tauri-apps/api/core"
import { writeText } from '@tauri-apps/plugin-clipboard-manager'

const DEFAULT_CONFIG = {
  languages: ['eng'],
  outputFormat: {
    preserveLineBreaks: true,
    trimWhitespace: false,
    removeExtraSpaces: false,
  }
}

/**
 * @param {Object} 
 * @param {Object} 
 * @returns {Promise<string>} 
 */

export async function ocrService(rect, options = {}) {
  const config = {
    languages: options.languages || DEFAULT_CONFIG.languages,
    output_format: {
      preserve_line_breaks: options.preserveLineBreaks ?? DEFAULT_CONFIG.outputFormat.preserveLineBreaks,
      trim_whitespace: options.trimWhitespace ?? DEFAULT_CONFIG.outputFormat.trimWhitespace,
      remove_extra_spaces: options.removeExtraSpaces ?? DEFAULT_CONFIG.outputFormat.removeExtraSpaces,
    }
  }

  try {
    const text = await invoke("capture_and_ocr", {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      config
    })

    if (!text || text.trim().length === 0) {
      throw new Error("EMPTY_OCR_RESULT");
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