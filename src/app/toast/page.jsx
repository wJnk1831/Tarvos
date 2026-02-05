'use client'

import { Suspense } from 'react'
import ToastInner from './ToastInner'

export default function ToastPage() {
  return (
    <Suspense fallback={null}>
      <ToastInner />
    </Suspense>
  )
}
