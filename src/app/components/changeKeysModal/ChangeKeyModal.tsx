'use client'

import { MouseEvent, useEffect, useMemo, useRef, useState } from "react"

import { LazyStore } from "@tauri-apps/plugin-store"

import { useAppStore } from "@/store/useAppStore"

import { registerCaptureHotkey, unregisterCaptureHotkey } from "@/core/hotkeys"

const store = new LazyStore("settings.json")

const MODIFIER_KEYS = ['Ctrl', 'Alt', 'Shift']

function normalizeKey(event: KeyboardEvent) {
  const { code } = event

  const aliases: Record<string, string> = {
    ControlLeft: 'Ctrl',
    ControlRight: 'Ctrl',

    ShiftLeft: 'Shift',
    ShiftRight: 'Shift',

    AltLeft: 'Alt',
    AltRight: 'Alt',
  }

  if (aliases[code]) {
    return aliases[code]
  }

  if (code.startsWith('Key')) {
    return code.replace('Key', '').toUpperCase()
  }

  if (code.startsWith('Digit')) {
    return code.replace('Digit', '')
  }

  return ''
}

function isModifier(key: string) {
  return MODIFIER_KEYS.includes(key)
}

function validateCombination(keys: string[]) {
  const modifiers = keys.filter(isModifier)
  const normalKeys = keys.filter(k => !isModifier(k))

  if (modifiers.length < 1) return false

  if (modifiers.length > 2) return false

  if (normalKeys.length !== 1) return false

  return true
}

function sortKeys(keys: string[]) {
  const priority = ['Ctrl', 'Alt', 'Shift']

  return [...keys].sort((a, b) => {
    const ia = priority.indexOf(a)
    const ib = priority.indexOf(b)

    if (ia === -1 && ib === -1) return 0

    if (ia === -1) return 1
    if (ib === -1) return -1

    return ia - ib
  })
}

export default function ChangeKeysModal() {
  const { captureHotkey, setCaptureHotkey, setIsChangeHotKeyModalOpen } = useAppStore()
  const [isRecording, setIsRecording] = useState(false)
  const [tempHotkeys, setTempHotkeys] = useState<string[]>([])
  const modalRef = useRef(null)

  const pressedKeysRef = useRef<Set<string>>(new Set())

  const finalHotkeyRef = useRef<string[]>([])

  const [finalHotkey, setFinalHotkey] = useState<string[]>([])

  const formattedCurrent = useMemo(() => {
    if (isRecording && tempHotkeys.length === 0) {
      return []
    }
    if (tempHotkeys.length > 0) {
      return tempHotkeys
    }
    return captureHotkey.split('+')
  }, [tempHotkeys, captureHotkey, isRecording])

  function startRecording() {
    pressedKeysRef.current.clear()

    finalHotkeyRef.current = []

    setTempHotkeys([])

    setFinalHotkey([])

    setIsRecording(true)
  }

  function cancelRecording() {
    pressedKeysRef.current.clear()

    finalHotkeyRef.current = []

    setTempHotkeys([])

    setFinalHotkey([])

    setIsRecording(false)
    setIsChangeHotKeyModalOpen(false)
  }

  async function confirmHotkey() {
    if (finalHotkey.length === 0) {
      return
    }

    const newHotkey = finalHotkey.join('+')

    try {

      await unregisterCaptureHotkey(captureHotkey)

      await registerCaptureHotkey(newHotkey)

      await store.set('capture_hotkey', newHotkey)

      await store.save()

      setCaptureHotkey(newHotkey)

      setIsRecording(false)

      cancelRecording()

    } catch (err) {
      console.error(err)
    }
  }

  function handleClickOutsideModal(e: MouseEvent) {
    if (!modalRef.current) return

    if (modalRef.current !== e.target) return

    cancelRecording()
  }

  useEffect(() => {
    if (!isRecording) return

    function handleKeyDown(event: KeyboardEvent) {

      if (event.repeat) return

      const normalized = normalizeKey(event)

      if (!normalized) return

      const pressed = pressedKeysRef.current

      if (pressed.size >= 3 && !pressed.has(normalized)) return

      pressed.add(normalized)

      const current = sortKeys([...pressed])

      setTempHotkeys(current)

      if (validateCombination(current)) {
        finalHotkeyRef.current = current
        setFinalHotkey(current)
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      const normalized = normalizeKey(event)

      if (!normalized) return

      pressedKeysRef.current.delete(normalized)

      const current = sortKeys([...pressedKeysRef.current])

      setTempHotkeys(current)

      if (pressedKeysRef.current.size === 0) {
        if (finalHotkeyRef.current.length > 0) {
          setIsRecording(false)
          setTempHotkeys(finalHotkeyRef.current)
        } else {
          setTempHotkeys([])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)

    window.addEventListener('keyup', handleKeyUp, true)

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)

      window.removeEventListener('keyup', handleKeyUp, true)
    }

  }, [isRecording])

  return (
    <div ref={modalRef} onClick={(e) => handleClickOutsideModal(e)} className="fixed cursor-default inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-6">

      <div className="glass-card w-full max-w-xl rounded-4xl border border-white/10 p-8">

        <div className="flex flex-col gap-8">

          <div className="flex flex-col gap-2">

            <h2 className="font-slab text-2xl text-white">
              Customize Hotkeys
            </h2>

          </div>

          <div
            tabIndex={0}
            onClick={startRecording}
            className="
              group
              flex
              min-h-30
              w-full
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-3xl
              border
              border-dashed
              border-white/10
              bg-white/3
              px-6
              py-8
              outline-none
            ">

            <span className="text-xs uppercase tracking-[0.25em] text-neutral-500">
              {isRecording ? 'Recording...' : 'Current Shortcut'}
            </span>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">

              {formattedCurrent.length === 0 && (
                <span className="text-sm text-neutral-600">
                  Press shortcut...
                </span>
              )}

              {formattedCurrent.map((key, index) => (
                <div key={`${key}-${index}`} className="flex items-center gap-2"  >

                  <kbd className="
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    px-4
                    py-2
                    text-sm
                    text-white
                  ">
                    {key}
                  </kbd>

                  {index < formattedCurrent.length - 1 && (<span className="text-neutral-500">  +  </span>)}

                </div>
              ))}

            </div>

            <span className="mt-5 text-xs text-neutral-500">
              {isRecording ? 'Hold keys simultaneously' : 'Click to record'}
            </span>

          </div>

          <div className="flex items-center justify-end gap-3 text-sm">
            <button onClick={cancelRecording} className="btn-glass-secondary" >
              Cancel
            </button>

            <button onClick={confirmHotkey} disabled={finalHotkey.length === 0} className="btn-glass-primary" >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
