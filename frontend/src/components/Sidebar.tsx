import { useState } from "react";
import { Home, Map, Megaphone, Newspaper } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import BrandIcon from "./layout/BrandIcon";
import { Link } from "react-router-dom";

type SidebarMenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const SIDEBAR_ITEMS: SidebarMenuItem[] = [
  { id: "/", label: "Trang chủ", icon: Home },
  { id: "/about", label: "Lộ trình", icon: Map },
  { id: "projects", label: "Dự án", icon: Newspaper },
  { id: "newsletter", label: "Bản tin", icon: Megaphone },
];

function Sidebar() {
  const [activeId, setActiveId] = useState(SIDEBAR_ITEMS[0].id);

  return (
    <aside className="fixed top-0 left-0 z-40 hidden h-screen w-30 flex-col overflow-x-hidden border-r border-slate-200 bg-white md:flex">
      <div className="flex h-16 shrink-0 items-center justify-center overflow-hidden border-b border-slate-200">
        <BrandIcon size={16} boxClassName="h-8 w-8 rounded-lg" />
      </div>

      <nav className="flex flex-1 flex-col items-center gap-6 px-2 py-6">
        <ul className="flex w-full flex-col items-center gap-6">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeId;

            return (
              <li key={item.id} className="w-full">
                <Link to={item.id}>
                <button
                  type="button"
                  title={item.label}
                  onClick={() => setActiveId(item.id)}
                  className={`flex w-full flex-col items-center gap-1.5 rounded-xl border-l-2 px-3 py-3 transition-colors ${
                    isActive
                      ? "border-orange-600 bg-orange-50 text-orange-700"
                      : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.75}
                    className="shrink-0"
                  />
                  <span
                    className={`text-[11px] leading-tight ${
                      isActive ? "font-bold" : "font-normal"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-slate-200 p-2">
        <div className="font-mono-ui flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-slate-50 px-2 py-2 text-[10px] text-slate-500">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
