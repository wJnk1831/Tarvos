'use client'

import { Suspense } from 'react'
import { Toast } from './components/Toast'

export default function ToastPage() {
  return (
    <Suspense fallback={null}>
      <Toast />
    </Suspense>
  )
}
