import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../api/auth.api";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Boxes, CircleDot, Images, Users, Settings,
  Search, Bell, ChevronDown, ChevronLeft, Menu, X, LogOut, HelpCircle,
  CircleUserRound, FileUser,
} from "lucide-react";

/* ---------- token system → xem frontend/src/index.css (:root + @theme) ---------- */

type SubItemConfig = {
  to: string;
  label: string;
  end?: boolean;
};

type NavItemConfig = {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  end?: boolean;
  children?: SubItemConfig[];
};

const NAV: { section: string; items: NavItemConfig[] }[] = [
  {
    section: "workspace",
    items: [
      { to: "/admin", label: "Tổng quan", icon: LayoutDashboard, end: true },
      {
        to: "/admin/projects",
        label: "Projects",
        icon: Boxes,
        children: [
          { to: "/admin/projects", label: "Danh sách", end: true },
          { to: "/admin/projects/new", label: "Thêm mới" },
        ],
      },
      {
        to: "/admin/stories",
        label: "Stories",
        icon: CircleDot,
        end: true,
      },
      {
        to: "/admin/gallery",
        label: "Gallery",
        icon: Images,
        end: true,
      },
    ],
  },
  {
    section: "quản trị",
    items: [
      { to: "/admin/users", label: "Người dùng", icon: Users, end: true },
      { to: "/admin/resume", label: "Resume", icon: FileUser, end: true },
      { to: "/admin/seo", label: "SEO", icon: Settings, end: true },
    ],
  },
];

function useIsChildActive(item: NavItemConfig, pathname: string) {
  if (!item.children) return false;
  return item.children.some((c) =>
    c.end ? pathname === c.to : pathname.startsWith(c.to)
  );
}

function SidebarNavLink({
  item,
  collapsed,
  isOpen,
  onToggle,
}: {
  item: NavItemConfig;
  collapsed: boolean;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = item.icon;
  const { pathname } = useLocation();
  const hasChildren = !!item.children?.length;
  const childActive = useIsChildActive(item, pathname);

  // ---------- Item CÓ children ----------
  if (hasChildren) {
    return (
      <div className="relative group">
        <button
          type="button"
          onClick={onToggle}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
          style={{
            color: childActive ? "#B45309" : "#475069",
            background: childActive && !isOpen ? "#FFF7E8" : "transparent",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          onMouseEnter={(e) => {
            if (!childActive || isOpen) e.currentTarget.style.background = "#F3F4F6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = childActive && !isOpen ? "#FFF7E8" : "transparent";
          }}
        >
          {childActive && (
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-full"
              style={{ background: "#B45309" }}
            />
          )}
          <Icon size={17} strokeWidth={1.8} className="shrink-0" />
          {!collapsed && (
            <>
              <span className="truncate font-medium flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: "#EEF0F3", color: "#667085" }}
                >
                  {item.badge}
                </span>
              )}
              <ChevronDown
                size={14}
                color="#98A1B3"
                style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
              />
            </>
          )}
          {collapsed && (
            <span
              className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity z-50"
              style={{ background: "var(--color-ink)", color: "#fff" }}
            >
              {item.label}
            </span>
          )}
        </button>

        {/* Sidebar mở rộng: submenu xổ xuống */}
        {!collapsed && (
          <div
            className="overflow-hidden transition-all duration-200 ease-in-out"
            style={{ maxHeight: isOpen ? item.children!.length * 36 + 8 : 0 }}
          >
            <div className="pl-[30px] pt-1 pb-1 space-y-0.5">
              {item.children!.map((sub) => (
                <NavLink
                  key={sub.to}
                  to={sub.to}
                  end={sub.end}
                  className="relative flex items-center rounded-md px-3 py-1.5 text-[13px] transition-colors"
                  style={({ isActive }) => ({
                    color: isActive ? "#B45309" : "#667085",
                    background: isActive ? "#FFF7E8" : "transparent",
                    fontWeight: isActive ? 600 : 500,
                  })}
                  onMouseEnter={(e) => {
                    if (e.currentTarget.getAttribute("aria-current") !== "page")
                      e.currentTarget.style.background = "#F3F4F6";
                  }}
                  onMouseLeave={(e) => {
                    if (e.currentTarget.getAttribute("aria-current") !== "page")
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span
                    className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-2 h-px"
                    style={{ background: "#D8DCE3" }}
                  />
                  {sub.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Sidebar thu gọn: flyout menu khi hover */}
        {collapsed && (
          <div
            className="pointer-events-none absolute left-full top-0 ml-2 w-52 rounded-lg border shadow-lg py-1.5 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50"
            style={{ background: "#FFFFFF", borderColor: "#E7E9EE" }}
          >
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#98A1B3" }}>
              {item.label}
            </div>
            {item.children!.map((sub) => (
              <NavLink
                key={sub.to}
                to={sub.to}
                end={sub.end}
                className="block px-3 py-2 text-sm"
                style={({ isActive }) => ({
                  color: isActive ? "#B45309" : "#475069",
                  background: isActive ? "#FFF7E8" : "transparent",
                })}
              >
                {sub.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---------- Item KHÔNG có children (giữ nguyên như cũ) ----------
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className="group relative w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
      style={({ isActive }) => ({
        color: isActive ? "#B45309" : "#475069",
        background: isActive ? "#FFF7E8" : "transparent",
        justifyContent: collapsed ? "center" : "flex-start",
      })}
      onMouseEnter={(e) => {
        if (!e.currentTarget.classList.contains("active")) e.currentTarget.style.background = "#F3F4F6";
      }}
      onMouseLeave={(e) => {
        const isActive = e.currentTarget.getAttribute("aria-current") === "page";
        if (!isActive) e.currentTarget.style.background = "transparent";
      }}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-full"
              style={{ background: "#B45309" }}
            />
          )}
          <Icon size={17} strokeWidth={1.8} className="shrink-0" />
          {!collapsed && (
            <>
              <span className="truncate font-medium">{item.label}</span>
              {item.badge && (
                <span
                  className="ml-auto text-[11px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: isActive ? "#B45309" : "#EEF0F3", color: isActive ? "#fff" : "#667085" }}
                >
                  {item.badge}
                </span>
              )}
            </>
          )}
          {collapsed && (
            <span
              className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity z-50"
              style={{ background: "var(--color-ink)", color: "#fff" }}
            >
              {item.label}
              {item.badge ? ` · ${item.badge}` : ""}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Theo dõi section nào đang mở (key = item.to)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    NAV.forEach((group) =>
      group.items.forEach((item) => {
        if (item.children && useIsChildActive(item, pathname)) initial[item.to] = true;
      })
    );
    return initial;
  });

  // Tự mở section cha khi route hiện tại thuộc về nó
  useEffect(() => {
    NAV.forEach((group) =>
      group.items.forEach((item) => {
        if (item.children && useIsChildActive(item, pathname)) {
          setOpenSections((prev) => (prev[item.to] ? prev : { ...prev, [item.to]: true }));
        }
      })
    );
  }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const sidebarWidth = collapsed ? 76 : 248;

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-app font-sans">

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className="fixed md:relative inset-y-0 left-0 z-50 flex flex-col shrink-0 border-r transition-all duration-300 ease-in-out"
        style={{
          width: sidebarWidth,
          borderColor: "#E7E9EE",
          background: "#FFFFFF",
          transform: mobileOpen ? "translateX(0)" : undefined,
        }}
      >
        <div
          className="h-16 flex items-center border-b shrink-0"
          style={{ borderColor: "#E7E9EE", paddingLeft: collapsed ? 0 : 20, justifyContent: collapsed ? "center" : "flex-start" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink font-mono-ui text-sm font-bold text-accent-gold"
            >
              {"</>"}
            </div>
            {!collapsed && (
              <span className="text-[15px] font-semibold text-ink">Kien's Space</span>
            )}
          </div>
          <button className="md:hidden ml-auto mr-3 p-1" onClick={() => setMobileOpen(false)}>
            <X size={18} color="#667085" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {NAV.map((group) => (
            <div key={group.section}>
              {!collapsed && (
                <div className="px-3 text-[10.5px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#98A1B3" }}>
                  {group.section}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <div key={item.to} onClick={() => !item.children && setMobileOpen(false)}>
                    <SidebarNavLink
                      item={item}
                      collapsed={collapsed}
                      isOpen={!!openSections[item.to]}
                      onToggle={() => toggleSection(item.to)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t p-3" style={{ borderColor: "#E7E9EE" }}>
          <button
            className="group relative w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm"
            style={{ color: "#475069", justifyContent: collapsed ? "center" : "flex-start" }}
          >
            <HelpCircle size={17} strokeWidth={1.8} />
            {!collapsed && <span className="font-medium">Trợ giúp</span>}
          </button>
        </div>

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden md:flex absolute top-16 -right-3 w-6 h-6 rounded-full items-center justify-center border shadow-sm"
          style={{ background: "#FFFFFF", borderColor: "#E7E9EE" }}
        >
          <ChevronLeft
            size={13}
            color="#667085"
            style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}
          />
        </button>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="h-16 flex items-center gap-3 px-4 md:px-6 border-b shrink-0"
          style={{ borderColor: "#E7E9EE", background: "#FFFFFF" }}
        >
          <button className="md:hidden p-1.5 -ml-1" onClick={() => setMobileOpen(true)}>
            <Menu size={20} color="#475069" />
          </button>

          <div className="flex-1" />

          <div className="hidden w-64 items-center gap-2 rounded-lg border border-border bg-app px-3 py-2 lg:flex">
            <Search size={15} color="#98A1B3" />
            <input
              placeholder="Tìm kiếm..."
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-subtle"
            />
            <kbd className="rounded border border-border px-1.5 py-0.5 font-mono-ui text-[10px] text-subtle">
              ⌘K
            </kbd>
          </div>

          <button className="relative p-2 rounded-lg" style={{ background: "#F8F9FB" }}>
            <Bell size={16} color="#475069" />
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full border"
              style={{ background: "#B45309", borderColor: "#FFFFFF" }}
            />
          </button>

          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg"
              style={{ background: userMenuOpen ? "#F3F4F6" : "transparent" }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-semibold text-accent-gold">
                VK
              </div>
              <span className="hidden text-sm font-medium text-ink sm:block">Kiên</span>
              <ChevronDown size={14} color="#98A1B3" />
            </button>

            {userMenuOpen && (
              <div
                className="absolute right-0 top-12 w-48 rounded-lg border shadow-lg py-1.5 z-50"
                style={{ background: "#FFFFFF", borderColor: "#E7E9EE" }}
              >
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm" style={{ color: "#475069" }}>
                  <CircleUserRound size={15} /> Hồ sơ
                </button>
                <button
                  onClick={() => navigate("/admin/seo")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm"
                  style={{ color: "#475069" }}
                >
                  <Settings size={15} /> SEO
                </button>
                <div className="h-px my-1" style={{ background: "#E7E9EE" }} />
                <button
                  onClick={async () => {
                    await logout();
                    navigate("/admin/login");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm"
                  style={{ color: "#DC2626" }}
                >
                  <LogOut size={15} /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Nội dung từng trang admin render tại đây qua Outlet */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}