import { Link, useLocation } from "react-router-dom";
import BrandIcon from "./layout/BrandIcon";
import { CLIENT_NAV } from "../constants/clientNav";

function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="fixed top-0 left-0 z-40 hidden h-screen w-30 flex-col overflow-x-hidden border-r border-slate-200 bg-white md:flex">
      <div className="flex h-16 shrink-0 items-center justify-center overflow-hidden border-b border-slate-200">
        <BrandIcon size={16} boxClassName="h-8 w-8 rounded-lg" />
      </div>

      <nav className="flex flex-1 flex-col items-center gap-6 px-2 py-6">
        <ul className="flex w-full flex-col items-center gap-6">
          {CLIENT_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = item.end
              ? pathname === item.to
              : pathname === item.to || pathname.startsWith(`${item.to}/`);

            return (
              <li key={item.to} className="w-full">
                <Link to={item.to}>
                  <button
                    type="button"
                    title={item.label}
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

      <div className="sidebar-terminal shrink-0 border-t border-slate-200 p-2 lg:p-3">
        <div className="font-mono-ui flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-slate-50 px-2 py-2 text-xs text-slate-500 lg:justify-start lg:px-3">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
          <span className="hidden whitespace-nowrap lg:inline">@kien:~$</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
