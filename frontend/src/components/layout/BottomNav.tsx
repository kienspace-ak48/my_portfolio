import { NAV_ITEMS } from "../../constants/navItems";

type BottomNavProps = {
  activeId: string;
  onNavigate: (id: string) => void;
};

const BottomNav = ({ activeId, onNavigate }: BottomNavProps) => (
  <nav className="fixed right-0 bottom-0 left-0 z-40 flex h-16 items-center border-t border-slate-200 bg-white md:hidden">
    {NAV_ITEMS.map((item) => {
      const Icon = item.icon;
      const isActive = item.id === activeId;

      return (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex h-full flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
            isActive ? "text-orange-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
          <span className="text-[10px] leading-none font-medium">
            {item.label.split(" ")[0]}
          </span>
        </button>
      );
    })}
  </nav>
);

export default BottomNav;
