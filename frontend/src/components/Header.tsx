import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import SearchInput from "./layout/SearchInput";
import BrandIcon from "./layout/BrandIcon";
import MobileNavDrawer from "./layout/MobileNavDrawer";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-40 h-16 border-b border-slate-200 bg-white md:pl-30">
        <div className="flex h-full items-center gap-3 px-4 md:pl-6 lg:px-6">
          {/* Mobile: brand */}
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2.5 md:gap-3"
          >
            <BrandIcon size={16} boxClassName="h-8 w-8 shrink-0 rounded-lg md:hidden" />
            <span className="truncate text-lg font-extrabold tracking-tight text-slate-900">
              Kien&apos;s Space
            </span>
          </Link>

          {/* Desktop: search */}
          <div className="mx-auto hidden max-w-xl flex-1 md:block">
            <SearchInput />
          </div>

          {/* Desktop: auth */}
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <Link
              to="/admin/login"
              className="inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Đăng nhập
            </Link>
            <Link
              to="/admin/login"
              className="inline-flex h-9 items-center rounded-lg bg-orange-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
            >
              Đăng ký
            </Link>
          </div>

          {/* Mobile: hamburger menu (nav + auth) */}
          <button
            type="button"
            className="ml-auto inline-flex rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Mở menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} strokeWidth={2} />
          </button>
        </div>
      </header>

      <MobileNavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

export default Header;
