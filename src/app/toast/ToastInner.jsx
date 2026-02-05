'use client'

import { useSearchParams } from 'next/navigation'
import { Toast } from '@/shared/components/toast/Toast'

export default function ToastInner() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') ?? 'Done'
  const type = searchParams.get('type') ?? 'main'

  return <Toast message={message} type={type} />
}
