import { Search } from "lucide-react";
import SearchInput from "./SearchInput";

type HeaderProps = {
  onOpenSearch: () => void;
};

const Header = ({ onOpenSearch }: HeaderProps) => (
  <header className="fixed top-0 right-0 left-0 z-40 h-16 border-b border-slate-200 bg-white md:pl-16 lg:pl-64">
    <div className="flex h-full items-center gap-3 px-4 md:pl-6 lg:px-6">
      <a href="#" className="flex shrink-0 items-center gap-2.5">
        {/* <BrandIcon /> */}
        <span className="font-display sm:hidden lg:hidden text-lg font-extrabold tracking-tight sm:inline">
          Kien's Space
        </span>
      </a>

      <div className="mx-auto hidden max-w-xl flex-1 md:block">
        <SearchInput />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onOpenSearch}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
          aria-label="Tìm kiếm"
        >
          <Search size={20} />
        </button>
        <a
          href="#"
          className="hidden h-9 items-center rounded-lg px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:inline-flex"
        >
          Đăng nhập
        </a>
        <a
          href="#"
          className="inline-flex h-9 items-center rounded-lg bg-orange-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
        >
          Đăng ký
        </a>
      </div>
    </div>
  </header>
);

export default Header;
