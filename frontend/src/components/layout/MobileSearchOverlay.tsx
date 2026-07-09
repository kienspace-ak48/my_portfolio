import { X } from "lucide-react";
import SearchInput from "./SearchInput";

type MobileSearchOverlayProps = {
  onClose: () => void;
};

const MobileSearchOverlay = ({ onClose }: MobileSearchOverlayProps) => (
  <div
    className="fixed inset-0 z-50 bg-slate-900/50 md:hidden"
    onClick={onClose}
  >
    <div
      className="absolute top-0 right-0 left-0 flex items-center gap-2 border-b border-slate-200 bg-white p-3"
      onClick={(e) => e.stopPropagation()}
    >
      <SearchInput autoFocus className="flex-1" />
      <button
        onClick={onClose}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        aria-label="Đóng"
      >
        <X size={20} />
      </button>
    </div>
  </div>
);

export default MobileSearchOverlay;
