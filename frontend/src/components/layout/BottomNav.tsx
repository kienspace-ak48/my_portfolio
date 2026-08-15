import { NavLink, useLocation } from "react-router-dom";
import { BOTTOM_NAV } from "../../constants/clientNav";

function isNavActive(pathname: string, to: string, end?: boolean) {
  if (end) return pathname === to;
  return pathname === to || pathname.startsWith(`${to}/`);
}

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-40 border-t border-slate-200 bg-white/95 shadow-[0_-4px_24px_rgba(15,23,42,0.08)] backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Điều hướng chính"
    >
      <div className="flex h-16 items-stretch">
        {BOTTOM_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = isNavActive(pathname, item.to, item.end);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? "text-orange-600" : "text-slate-400 active:text-slate-600"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.75} />
              <span
                className={`text-[10px] leading-none ${
                  isActive ? "font-semibold" : "font-medium"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="mt-0.5 h-0.5 w-8 rounded-full bg-orange-600" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
