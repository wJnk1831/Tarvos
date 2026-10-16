import SettingsModal from "./SettingsModal";

export default function Overlay() {
  return (
    <div className="overflow-hidden cursor-crosshair absolute inset-0 z-10 transition-colors">
      <SettingsModal/>
    </div>
  )
}