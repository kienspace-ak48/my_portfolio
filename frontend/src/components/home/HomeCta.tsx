import { ArrowDown, FileText, Mail } from "lucide-react";
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
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="mailto:kien.dev@gmail.com"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink/90 sm:w-auto"
        >
          <Mail size={16} aria-hidden />
          Liên hệ ngay
        </a>
        <Link
          to="/resume"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand-border bg-brand-soft px-6 py-3 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white sm:w-auto"
        >
          <FileText size={16} aria-hidden />
          Xem Resume
        </Link>
      </div>
    </section>
  );
}

export default HomeCta;
