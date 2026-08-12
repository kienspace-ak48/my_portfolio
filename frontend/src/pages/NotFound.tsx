import { ArrowLeft, Home, LayoutDashboard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const GIF_404 =
  "https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif";

type Props = {
  embedded?: boolean;
};

function NotFound({ embedded = false }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith("/admin");

  const homeTo = isAdmin ? "/admin" : "/";
  const homeLabel = isAdmin ? "Về Dashboard" : "Về trang chủ";
  const HomeIcon = isAdmin ? LayoutDashboard : Home;

  const shellClass = embedded
    ? "flex h-[calc(100vh-11rem)] max-h-[calc(100vh-11rem)] flex-col overflow-hidden px-4 py-4"
    : "flex h-screen max-h-screen flex-col overflow-hidden bg-white px-4 py-4 sm:py-5";

  const imgMaxH = embedded
    ? "max-h-[min(38vh,320px)]"
    : "max-h-[min(52vh,480px)] sm:max-h-[min(55vh,520px)]";

  return (
    <section className={shellClass} aria-labelledby="not-found-title">
      <div className="mx-auto flex h-full w-full max-w-4xl min-h-0 flex-col items-center justify-center">
        {/* Khối hero + mô tả dính liền */}
        <div className="flex w-full flex-col items-center">
          <div className="relative w-full max-w-3xl pt-[clamp(1.25rem,4vw,2.5rem)]">
            <p
              className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 select-none font-mono-ui text-[clamp(3rem,11vw,5.5rem)] font-black leading-none tracking-tight text-ink"
              style={{
                textShadow:
                  "0 0 20px rgba(255,255,255,1), 0 0 8px rgba(255,255,255,0.95), 0 2px 10px rgba(16,19,34,0.1)",
              }}
              aria-hidden
            >
              404
            </p>
            <img
              src={GIF_404}
              alt=""
              className={`mx-auto w-full ${imgMaxH} object-contain object-center`}
              loading="eager"
              decoding="async"
            />
          </div>

          <div className="mt-1 w-full max-w-lg shrink-0 text-center sm:mt-2">
            <h1
              id="not-found-title"
              className="text-base font-bold tracking-tight text-ink sm:text-lg"
            >
              {isAdmin ? "Không tìm thấy trang admin" : "Có vẻ bạn đang lạc đường"}
            </h1>
            <p className="mt-1 text-xs leading-snug text-muted sm:text-sm">
              {isAdmin
                ? "Đường dẫn admin không tồn tại."
                : "Trang không tồn tại hoặc đã được di chuyển."}
              <span className="mx-1.5 text-subtle">·</span>
              <span className="font-mono-ui text-[10px] text-subtle sm:text-[11px]">
                {location.pathname}
              </span>
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <Link
                to={homeTo}
                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white sm:text-sm ${
                  isAdmin
                    ? "bg-[#B45309] hover:bg-[#92400e]"
                    : "bg-brand hover:bg-brand-hover"
                }`}
              >
                <HomeIcon size={15} aria-hidden />
                {homeLabel}
              </Link>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-xs font-medium text-body hover:bg-hover sm:text-sm"
              >
                <ArrowLeft size={15} aria-hidden />
                Quay lại
              </button>
            </div>

            {!isAdmin ? (
              <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
                <span className="text-[10px] text-subtle">Hoặc</span>
                {[
                  { to: "/projects", label: "Dự án" },
                  { to: "/blog", label: "Blog" },
                  { to: "/tools", label: "Tools" },
                  { to: "/resume", label: "Resume" },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-body hover:border-brand-border hover:text-brand"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
