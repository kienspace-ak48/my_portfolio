import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { LogIn, UserPlus, X } from "lucide-react";
import { CLIENT_NAV } from "../../constants/clientNav";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MobileNavDrawer({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        aria-label="Đóng menu"
        onClick={onClose}
      />

      <div className="absolute top-0 right-0 flex h-full w-[min(100%,20rem)] flex-col bg-white shadow-xl">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
          <span className="text-sm font-semibold text-slate-900">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Điều hướng
          </p>
          <ul className="space-y-1">
            {CLIENT_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-orange-50 text-orange-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`
                    }
                  >
                    <Icon size={20} strokeWidth={1.75} />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <p className="mb-2 mt-6 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Tài khoản
          </p>
          <ul className="space-y-1">
            <li>
              <Link
                to="/admin/login"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <LogIn size={20} strokeWidth={1.75} />
                Đăng nhập
              </Link>
            </li>
            <li>
              <Link
                to="/admin/login"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl bg-orange-600 px-3 py-3 text-sm font-semibold text-white hover:bg-orange-700"
              >
                <UserPlus size={20} strokeWidth={1.75} />
                Đăng ký
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
