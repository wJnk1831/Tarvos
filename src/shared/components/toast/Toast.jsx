'use client'

const TYPE_STYLES = {
  main: 'bg-main',
  success: 'bg-success',
  error: 'bg-error',
  info: 'bg-info',
}

export function Toast({ message = 'Done', type = 'main' }) {
  const barColor = TYPE_STYLES[type] ?? TYPE_STYLES.main

  return (
    <div className="w-full h-[80px] glass-card p-4 flex gap-4 items-center transition-all duration-300">
      <div className="flex gap-3 items-center flex-1 min-w-0 h-full">
        <div className={`status-bar shrink-0 h-full my-auto animate-pulse ${barColor}`} />
        <p className="text-sm tracking-wide text-white truncate">{message}</p>
      </div>
    </div>
  )
}
