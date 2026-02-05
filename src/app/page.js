'use client'

import { useAppInit } from "@/shared/hooks/useAppInit"
import Overlay from "./overlay/Overlay"


export default function Home() {
  useAppInit()
  
  return (
    <div className={"flex flex-col gap-4"}>
      <Overlay />
    </div>
  )
}
