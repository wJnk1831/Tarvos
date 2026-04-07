export interface OcrOutputFormat {
  preserve_line_breaks: boolean
  trim_whitespace: boolean
  remove_extra_spaces: boolean
}

export interface OcrConfig {
  languages: string[]
  output_format: OcrOutputFormat
}

export interface SelectionRect {
  left: number
  top: number
  width: number
  height: number
}

export interface OcrOptions {
  languages: string[]
  preserveLineBreaks: boolean
  trimWhitespace: boolean
  removeExtraSpaces: boolean
  copyToClipboard?: boolean
  saveToHistory?: boolean
}