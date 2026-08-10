import { ArrowDown, Mail } from "lucide-react";
import { Link } from "react-router-dom";

function HomeCta() {
  return (
    <section className="rounded-3xl border border-border bg-surface px-6 py-10 text-center sm:px-10 sm:py-12">
      <ArrowDown
        size={20}
        className="mx-auto mb-4 text-muted"
        aria-hidden
      />
      <h2 className="text-xl font-bold text-ink sm:text-2xl">
        Sẵn sàng cho cơ hội mới
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
        Liên hệ để trao đổi về vị trí Fullstack Developer — web app, admin
        dashboard và triển khai production.
      </p>
      <a
        href="mailto:kien.dev@gmail.com"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
      >
        <Mail size={16} aria-hidden />
        Liên hệ ngay
      </a>
      <Link
        to="/resume"
        className="mt-3 inline-flex text-sm font-semibold text-brand hover:text-brand-hover"
      >
        Xem Resume dành cho nhà tuyển dụng →
      </Link>
    </section>
  );
}

export default HomeCta;
