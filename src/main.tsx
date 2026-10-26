import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createTray } from './lib/tray.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

createTray().catch(error => {
  console.error('Failed to create tray:', error)

  const box = document.createElement('pre')
  box.textContent = `Tray error: ${String(error)}`
  box.style.cssText =
    'position:fixed;top:0;left:0;z-index:99999;margin:0;padding:8px;background:#000;color:#f66;font-size:12px;white-space:pre-wrap'
  document.body.appendChild(box)
})