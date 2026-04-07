export interface OcrResult {
  id: string
  text: string
  timestamp: number
  imagePath?: string
}

export interface SelectionArea {
  x: number
  y: number
  width: number
  height: number
}