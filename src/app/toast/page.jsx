'use client'

import { Suspense } from 'react'
import { Toast } from '@/shared/components/toast/Toast'

export default function ToastPage() {
  return (
    <Suspense fallback={null}>
      <Toast />
    </Suspense>
  )
}
