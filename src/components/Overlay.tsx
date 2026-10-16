import History from "./History";
import SettingsModal from "./SettingsModal";

export default function Overlay() {
  return (
    <div className="overflow-hidden cursor-crosshair absolute inset-0 z-10 transition-colors select-none">

      {/*Black background */}
      <div className="overlay absolute inset-0 bg-black/30" />

      <SettingsModal />

      <History />
    </div>
  )
}