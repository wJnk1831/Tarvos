export type ToastType = 'main' | 'success' | 'error' | 'info'

export interface ToastMessage {
  id: number
  text: string
  type: ToastType
}

export interface ToastOptions {
  message?: string
  type?: ToastType
}