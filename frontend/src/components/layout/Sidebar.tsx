import { NAV_ITEMS } from "../../constants/navItems";
import BrandIcon from "./BrandIcon";

type SidebarProps = {
  activeId: string;
  onNavigate: (id: string) => void;
};

const Sidebar = ({ activeId, onNavigate }: SidebarProps) => (
  <aside className="fixed top-0 left-0 z-40 hidden h-screen w-16 flex-col overflow-x-hidden border-r border-slate-200 bg-white md:flex lg:w-64">
    <div className="flex h-16 shrink-0 items-center justify-center overflow-hidden border-b border-slate-200 lg:justify-start lg:px-4">
      <BrandIcon size={16} boxClassName="h-8 w-8 rounded-lg" />
      <span className="font-display ml-0 hidden text-base font-extrabold tracking-tight whitespace-nowrap lg:ml-3 lg:inline">
        Kien's Space
      </span>
    </div>

    <nav className="flex-1 overflow-x-hidden overflow-y-auto px-2 py-4 lg:px-3">
      <p className="font-mono-ui mb-2 hidden px-3 text-[11px] tracking-widest text-slate-400 uppercase lg:block">
        Điều hướng
      </p>
      <ul className="space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeId;

          return (
            <li key={item.id}>
              <button
                type="button"
                title={item.label}
                onClick={() => onNavigate(item.id)}
                className={`relative flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors lg:justify-start lg:gap-3 lg:border-l-2 lg:px-3 lg:py-2 ${
                  isActive
                    ? "bg-orange-50 font-semibold text-orange-700 lg:border-orange-600"
                    : "text-slate-600 lg:border-transparent hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="shrink-0"
                />
                <span className="hidden min-w-0 flex-1 truncate text-left lg:inline">
                  {item.label}
                </span>
                <span className="font-mono-ui hidden min-w-0 truncate text-[11px] text-slate-400 xl:inline">
                  {item.path}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>

    <div className="shrink-0 border-t border-slate-200 p-2 lg:p-3">
      <div className="font-mono-ui flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-slate-50 px-2 py-2 text-xs text-slate-500 lg:justify-start lg:px-3">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
        <span className="hidden whitespace-nowrap lg:inline">
          kien@kiens-space:~$
        </span>
      </div>
    </div>
  </aside>
);

export default Sidebar;
