import { useState } from "react";
import {
  Search,
  X,
  Home,
  Compass,
  Folder,
  Heart,
  Settings,
  Code2,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "home", label: "Trang chủ", path: "-/trang-chu", icon: Home },
  { id: "explore", label: "Khám phá", path: "-/kham-pha", icon: Compass },
  { id: "projects", label: "Dự án", path: "-/du-an", icon: Folder },
  { id: "about", label: "Giới thiệu", path: "-/gioi-thieu", icon: Heart },
  { id: "setting", label: "Cài đặt", path: "-/cai-dat", icon: Settings },
];

const MainTemplate = () => {
  const [active, setActive] = useState("home");
  const [searchOpen, setSearchOpen] = useState(false);
  const activeItem = NAV_ITEMS.find((item) => item.id === active);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
        .font-display { font-family: 'Sora', sans-serif; }
        .font-mono-ui { font-family: 'JetBrains Mono', monospace; }
        .nav-tooltip {
          position: absolute;
          left: calc(100% + 10px);
          top: 50%;
          transform: translateY(-50%);
          background: #1e293b;
          color: white;
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s;
          z-index: 50;
        }
        .nav-tooltip::before {
          content: '';
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-right-color: #1e293b;
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .sidebar-icon-btn:hover .nav-tooltip { opacity: 1; }
        }
      `}</style>

      {/* ==================Header================== */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-slate-200">
        <div className="h-full flex items-center gap-3 px-4 lg:px-6">

          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 shrink-0">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-600 text-white">
              <Code2 size={18} strokeWidth={2.5} />
            </span>
            <span className="font-display font-extrabold text-lg tracking-tight hidden sm:inline">
              Kien's Space
            </span>
          </a>

          {/* Search bar — desktop */}
          <div className="flex-1 max-w-xl mx-auto hidden md:block">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm source code, đồ án..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-100 border border-transparent text-sm placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Tìm kiếm"
            >
              <Search size={20} />
            </button>
            <a href="#" className="hidden sm:inline-flex items-center h-9 px-4 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors">
              Đăng nhập
            </a>
            <a href="#" className="inline-flex items-center h-9 px-4 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
              Đăng ký
            </a>
          </div>
        </div>
      </header>

      {/* ==================Search Overlay (mobile)================== */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 md:hidden"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="absolute top-0 left-0 right-0 bg-white p-3 flex items-center gap-2 border-b border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Tìm kiếm source code, đồ án..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-100 border border-transparent text-sm placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={() => setSearchOpen(false)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Đóng"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* ==================Sidebar================== */}
      {/* Ẩn hoàn toàn trên mobile (<md), icon-only trên tablet (md~lg), full trên desktop (lg+) */}
      <aside className="fixed top-0 left-0 z-40 h-screen bg-white border-r border-slate-200 flex-col hidden md:flex w-16 lg:w-64 transition-all duration-200">

        {/* Sidebar header */}
        <div className="h-16 flex items-center border-b border-slate-200 px-4 overflow-hidden shrink-0">
          {/* Icon — luôn hiện */}
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-600 text-white shrink-0">
            <Code2 size={16} strokeWidth={2.5} />
          </span>
          {/* Label — chỉ hiện trên desktop */}
          <span className="font-display font-extrabold text-base tracking-tight ml-3 hidden lg:inline whitespace-nowrap">
            DevMarket
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 lg:px-3">
          {/* Section label — chỉ desktop */}
          <p className="font-mono-ui text-[11px] uppercase tracking-widest text-slate-400 px-3 mb-2 hidden lg:block">
            Điều hướng
          </p>
          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === active;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActive(item.id)}
                    className={`sidebar-icon-btn relative w-full flex items-center gap-3 rounded-lg text-sm transition-colors
                      px-0 justify-center lg:px-3 lg:justify-start
                      h-10 lg:h-auto lg:py-2
                      border-l-0 lg:border-l-2
                      ${isActive
                        ? "bg-orange-50 text-orange-700 lg:border-orange-600 font-semibold"
                        : "text-slate-600 lg:border-transparent hover:bg-slate-100 hover:text-slate-900"
                      }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />

                    {/* Label — chỉ desktop */}
                    <span className="flex-1 text-left hidden lg:inline">{item.label}</span>

                    {/* Path — chỉ desktop xl */}
                    <span className="font-mono-ui text-[11px] text-slate-400 hidden xl:inline">
                      {item.path}
                    </span>

                    {/* Tooltip — chỉ tablet (md~lg) */}
                    <span className="nav-tooltip lg:hidden">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="p-2 lg:p-3 border-t border-slate-200">
          <div className="flex items-center justify-center lg:justify-start gap-2 px-2 lg:px-3 py-2 rounded-lg bg-slate-50 font-mono-ui text-xs text-slate-500 overflow-hidden">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="hidden lg:inline whitespace-nowrap">kien@devmarket:~$</span>
          </div>
        </div>
      </aside>

      {/* ==================Bottom Nav (mobile only, < md)================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-white border-t border-slate-200 flex items-center md:hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 h-full transition-colors ${
                isActive ? "text-orange-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
              <span className="text-[10px] font-medium leading-none">
                {item.label.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ==================Main content================== */}
      <main className="pt-16 min-h-screen pb-20 md:pb-0 md:pl-16 lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          <div className="flex items-center gap-1.5 font-mono-ui text-xs text-slate-400 mb-4">
            <span>devmarket</span>
            <ChevronRight size={12} />
            <span className="text-slate-600">{activeItem?.path}</span>
          </div>

          <h1 className="font-display text-2xl font-extrabold text-slate-900 mb-6">
            {activeItem?.label}
          </h1>

          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
              <Code2 size={20} className="text-slate-400" />
            </div>
            <p className="font-medium text-slate-600">Nội dung của trang sẽ hiển thị ở đây</p>
            <p className="font-mono-ui text-xs text-slate-400 mt-1">{activeItem?.path}/index</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainTemplate;