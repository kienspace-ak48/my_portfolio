import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../api/auth.api";
import ScrollToTop from "../components/ScrollToTop";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Boxes, CircleDot, Images, Users, Settings,
  Search, Bell, ChevronDown, ChevronLeft, Menu, X, LogOut, HelpCircle,
  CircleUserRound, FileUser, Newspaper, DatabaseBackup,
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
        to: "/admin/blog",
        label: "Blog",
        icon: Newspaper,
        children: [
          { to: "/admin/blog", label: "Danh sách", end: true },
          { to: "/admin/blog/new", label: "Thêm mới" },
          { to: "/admin/taxonomy", label: "Tags & Danh mục" },
        ],
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
      { to: "/admin/backup", label: "Backup DB", icon: DatabaseBackup, end: true },
      { to: "/admin/seo", label: "SEO", icon: Settings, end: true },
    ],
  },
];

function navItemClass(collapsed: boolean) {
  return collapsed
    ? "w-full flex items-center justify-center rounded-lg px-0 py-2.5 text-sm transition-colors"
    : "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors";
}

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
  onNavigate,
  collapsedFlyout,
  onCollapsedFlyout,
}: {
  item: NavItemConfig;
  collapsed: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  collapsedFlyout: string | null;
  onCollapsedFlyout: (key: string | null) => void;
}) {
  const Icon = item.icon;
  const { pathname } = useLocation();
  const hasChildren = !!item.children?.length;
  const childActive = useIsChildActive(item, pathname);
  const flyoutOpen = collapsed && collapsedFlyout === item.to;

  function handleParentClick() {
    if (collapsed) {
      onCollapsedFlyout(flyoutOpen ? null : item.to);
      return;
    }
    onToggle();
  }

  // ---------- Item CÓ children ----------
  if (hasChildren) {
    return (
      <div className="relative">
        <button
          type="button"
          title={collapsed ? item.label : undefined}
          onClick={handleParentClick}
          className={navItemClass(collapsed)}
          style={{
            color: childActive ? "#B45309" : "#475069",
            background: childActive && !isOpen && !flyoutOpen ? "#FFF7E8" : "transparent",
          }}
          onMouseEnter={(e) => {
            if (!childActive || isOpen || flyoutOpen) e.currentTarget.style.background = "#F3F4F6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = childActive && !isOpen && !flyoutOpen ? "#FFF7E8" : "transparent";
          }}
        >
          {childActive && (
            <span
              className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full"
              style={{ background: "#B45309" }}
            />
          )}
          <Icon size={17} strokeWidth={1.8} className="shrink-0" />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1 truncate text-left font-medium">{item.label}</span>
              {item.badge ? (
                <span
                  className="rounded-full px-1.5 py-0.5 text-[11px] font-semibold"
                  style={{ background: "#EEF0F3", color: "#667085" }}
                >
                  {item.badge}
                </span>
              ) : null}
              <ChevronDown
                size={14}
                color="#98A1B3"
                style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
              />
            </>
          )}
        </button>

        {/* Sidebar mở rộng: submenu xổ xuống */}
        {!collapsed && (
          <div
            className="overflow-hidden transition-all duration-200 ease-in-out"
            style={{ maxHeight: isOpen ? item.children!.length * 36 + 8 : 0 }}
          >
            <div className="space-y-0.5 pb-1 pl-[30px] pt-1">
              {item.children!.map((sub) => (
                <NavLink
                  key={sub.to}
                  to={sub.to}
                  end={sub.end}
                  onClick={onNavigate}
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
                    className="absolute top-1/2 left-[-16px] h-px w-2 -translate-y-1/2"
                    style={{ background: "#D8DCE3" }}
                  />
                  {sub.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Sidebar thu gọn: flyout khi bấm icon */}
        {flyoutOpen && (
          <div
            className="absolute top-0 left-full z-[60] ml-2 w-52 rounded-lg border py-1.5 shadow-lg"
            style={{ background: "#FFFFFF", borderColor: "#E7E9EE" }}
          >
            <div
              className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: "#98A1B3" }}
            >
              {item.label}
            </div>
            {item.children!.map((sub) => (
              <NavLink
                key={sub.to}
                to={sub.to}
                end={sub.end}
                onClick={() => {
                  onNavigate();
                  onCollapsedFlyout(null);
                }}
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

  // ---------- Item KHÔNG có children ----------
  return (
    <NavLink
      to={item.to}
      end={item.end}
      title={collapsed ? item.label : undefined}
      onClick={onNavigate}
      className={`${navItemClass(collapsed)} group relative transition-colors`}
      style={({ isActive }) => ({
        color: isActive ? "#B45309" : "#475069",
        background: isActive ? "#FFF7E8" : "transparent",
      })}
      onMouseEnter={(e) => {
        if (e.currentTarget.getAttribute("aria-current") !== "page")
          e.currentTarget.style.background = "#F3F4F6";
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
              className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full"
              style={{ background: "#B45309" }}
            />
          )}
          <Icon size={17} strokeWidth={1.8} className="shrink-0" />
          {!collapsed && (
            <>
              <span className="min-w-0 truncate font-medium">{item.label}</span>
              {item.badge ? (
                <span
                  className="ml-auto rounded-full px-1.5 py-0.5 text-[11px] font-semibold"
                  style={{
                    background: isActive ? "#B45309" : "#EEF0F3",
                    color: isActive ? "#fff" : "#667085",
                  }}
                >
                  {item.badge}
                </span>
              ) : null}
            </>
          )}
        </>
      )}
    </NavLink>
  );
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsedFlyout, setCollapsedFlyout] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDesktop = useIsDesktop();
  const sidebarCollapsed = collapsed && isDesktop;

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    NAV.forEach((group) =>
      group.items.forEach((item) => {
        if (item.children && useIsChildActive(item, pathname)) initial[item.to] = true;
      })
    );
    return initial;
  });

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
    setMobileOpen(false);
    setCollapsedFlyout(null);
  }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (
        collapsedFlyout &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setCollapsedFlyout(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [collapsedFlyout]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  function closeMobileNav() {
    setMobileOpen(false);
    setCollapsedFlyout(null);
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-app font-sans">
      <ScrollToTop target={mainRef} />

      <button
        type="button"
        aria-label="Đóng menu"
        aria-hidden={!mobileOpen}
        tabIndex={mobileOpen ? 0 : -1}
        onClick={closeMobileNav}
        className={[
          "fixed inset-0 z-40 bg-black/30 md:hidden",
          "transition-opacity duration-500 ease-out",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      {/* Sidebar shell — wrapper overflow-visible để nút toggle không bị cắt */}
      <div
        className={[
          "relative fixed inset-y-0 left-0 z-50 shrink-0 md:relative",
          "transition-[transform,width] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform",
          "w-[248px]",
          collapsed ? "md:w-[76px]" : "md:w-[248px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <aside
          ref={sidebarRef}
          className={[
            "flex h-full w-full flex-col border-r",
            collapsedFlyout ? "overflow-visible" : "overflow-hidden",
          ].join(" ")}
          style={{ borderColor: "#E7E9EE", background: "#FFFFFF" }}
        >
        <div
          className={[
            "flex h-16 shrink-0 items-center border-b px-3 md:px-5",
            sidebarCollapsed ? "md:justify-center md:px-3" : "justify-start",
          ].join(" ")}
          style={{ borderColor: "#E7E9EE" }}
        >
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink font-mono-ui text-sm font-bold text-accent-gold">
              {"</>"}
            </div>
            {!sidebarCollapsed && (
              <span className="truncate text-[15px] font-semibold text-ink">Kien&apos;s Space</span>
            )}
          </div>
          <button
            type="button"
            className="ml-auto p-1 md:hidden"
            aria-label="Đóng menu"
            onClick={closeMobileNav}
          >
            <X size={18} color="#667085" />
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-x-hidden overflow-y-auto px-2 py-4 md:px-3">
          {NAV.map((group) => (
            <div key={group.section}>
              {!sidebarCollapsed && (
                <div
                  className="mb-1.5 px-3 text-[10.5px] font-semibold uppercase tracking-wider"
                  style={{ color: "#98A1B3" }}
                >
                  {group.section}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <SidebarNavLink
                    key={item.to}
                    item={item}
                    collapsed={sidebarCollapsed}
                    isOpen={!!openSections[item.to]}
                    onToggle={() => toggleSection(item.to)}
                    onNavigate={closeMobileNav}
                    collapsedFlyout={collapsedFlyout}
                    onCollapsedFlyout={setCollapsedFlyout}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t p-2 md:p-3" style={{ borderColor: "#E7E9EE" }}>
          <button
            type="button"
            title={sidebarCollapsed ? "Trợ giúp" : undefined}
            className={navItemClass(sidebarCollapsed)}
            style={{ color: "#475069" }}
          >
            <HelpCircle size={17} strokeWidth={1.8} className="shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">Trợ giúp</span>}
          </button>
        </div>
        </aside>

        <button
          type="button"
          aria-label={sidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          onClick={() => {
            setCollapsed((c) => !c);
            setCollapsedFlyout(null);
          }}
          className="absolute top-[4.25rem] -right-3 z-[60] hidden h-6 w-6 items-center justify-center rounded-full border shadow-md md:flex"
          style={{ background: "#FFFFFF", borderColor: "#E7E9EE" }}
        >
          <ChevronLeft
            size={13}
            color="#667085"
            style={{ transform: sidebarCollapsed ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}
          />
        </button>
      </div>

      {/* Main column — full width on mobile (sidebar is fixed overlay) */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="relative z-20 flex h-16 shrink-0 items-center gap-3 border-b px-4 md:px-6"
          style={{ borderColor: "#E7E9EE", background: "#FFFFFF" }}
        >
          <button
            type="button"
            className="-ml-1 p-1.5 md:hidden"
            aria-label="Mở menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
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

          <button type="button" className="relative rounded-lg p-2" style={{ background: "#F8F9FB" }}>
            <Bell size={16} color="#475069" />
            <span
              className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full border"
              style={{ background: "#B45309", borderColor: "#FFFFFF" }}
            />
          </button>

          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-lg py-1 pr-1 pl-2"
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
                className="absolute top-12 right-0 z-50 w-48 rounded-lg border py-1.5 shadow-lg"
                style={{ background: "#FFFFFF", borderColor: "#E7E9EE" }}
              >
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm"
                  style={{ color: "#475069" }}
                >
                  <CircleUserRound size={15} /> Hồ sơ
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/seo")}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm"
                  style={{ color: "#475069" }}
                >
                  <Settings size={15} /> SEO
                </button>
                <div className="my-1 h-px" style={{ background: "#E7E9EE" }} />
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    navigate("/admin/login");
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm"
                  style={{ color: "#DC2626" }}
                >
                  <LogOut size={15} /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </header>

        <main ref={mainRef} className="relative z-0 flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
