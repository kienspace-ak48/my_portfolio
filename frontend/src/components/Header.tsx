import React from "react";
import SearchInput from "./layout/SearchInput";
import BrandIcon from "./layout/BrandIcon";

function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-40 h-16 border-b border-slate-200 bg-white md:pl-30 ">
      <div className="flex h-full items-center gap-3 px-4 md:pl-6 lg:px-6">
        <a
          className="font-display sm:hidden  text-lg font-extrabold tracking-tight sm:inline"
          href="/"
        >
          <div className="flex items-center gap-x-3">
            <span className="md:hidden">
              <BrandIcon size={16} boxClassName="h-8 w-8 rounded-lg " />
            </span>
            Kien's Space
          </div>
        </a>
        <div className="mx-auto hidden max-w-xl flex-1 md:block">
          <SearchInput />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button>
            <a
              href="#"
              className="hidden h-9 items-center rounded-lg px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:inline-flex "
            >
              Đăng nhập
            </a>
          </button>
          <button>
            <a
              href="#"
              className="inline-flex h-9 items-center rounded-lg bg-orange-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
            >
              Đăng ký
            </a>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
