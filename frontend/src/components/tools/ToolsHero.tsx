import { ShieldCheck, Wrench } from "lucide-react";

type ToolsHeroProps = {
  total: number;
  clientSideCount: number;
};

function ToolsHero({ total, clientSideCount }: ToolsHeroProps) {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-border bg-surface">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand-soft)_0%,transparent_55%)]"
        aria-hidden
      />
      <div className="relative px-6 py-8 sm:px-10 sm:py-10">
        <p className="font-mono-ui text-xs uppercase tracking-[0.14em] text-subtle">
          Free tools
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Công cụ miễn phí
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          Bộ công cụ nhỏ gọn cho developer — mã hóa Base64, tra cứu IP công
          khai và tạo mật khẩu mạnh. Chọn công cụ để bắt đầu.
        </p>

        <dl className="mt-6 grid max-w-xs grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-app px-3 py-3">
            <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-subtle">
              <Wrench size={13} aria-hidden />
              Công cụ
            </dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-ink">
              {total}
            </dd>
          </div>
          <div className="rounded-xl bg-app px-3 py-3">
            <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-subtle">
              <ShieldCheck size={13} aria-hidden />
              Client-side
            </dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-ink">
              {clientSideCount}
            </dd>
          </div>
        </dl>
      </div>
    </header>
  );
}

export default ToolsHero;
