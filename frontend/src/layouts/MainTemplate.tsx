import { useState } from "react";
import { NAV_ITEMS } from "../constants/navItems";
import BottomNav from "../components/layout/BottomNav";
import Header from "../components/layout/Header";
import MainContent from "../components/layout/MainContent";
import MobileSearchOverlay from "../components/layout/MobileSearchOverlay";
import Sidebar from "../components/layout/Sidebar";

const MainTemplate = () => {
  const [activeId, setActiveId] = useState("home");
  const [searchOpen, setSearchOpen] = useState(false);

  const activeItem = NAV_ITEMS.find((item) => item.id === activeId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header onOpenSearch={() => setSearchOpen(true)} />

      {searchOpen && (
        <MobileSearchOverlay onClose={() => setSearchOpen(false)} />
      )}

      <Sidebar activeId={activeId} onNavigate={setActiveId} />
      <BottomNav />
      <MainContent activeItem={activeItem} />
    </div>
  );
};

export default MainTemplate;
