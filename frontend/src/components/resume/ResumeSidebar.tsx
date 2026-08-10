import { Code2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import {
  RESUME_CONTACT,
  RESUME_PROFILE,
  RESUME_QUICK_FACTS,
  RESUME_SECTIONS,
  RESUME_SNAPSHOT,
} from "../../data/resumeContent";

function ResumeSidebar() {
  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_1px_0_rgba(16,19,34,0.04)]">
        <div className="border-b border-border bg-[#101322] px-5 py-6 text-white">
          <img
            src={RESUME_PROFILE.avatarUrl}
            alt=""
            className="mb-4 h-16 w-16 rounded-xl object-cover ring-2 ring-white/20"
          />
          <p className="text-lg font-bold leading-tight">{RESUME_PROFILE.name}</p>
          <p className="mt-1 text-sm text-white/70">{RESUME_PROFILE.title}</p>
          <p className="mt-0.5 font-mono-ui text-xs text-brand-soft/90">
            {RESUME_PROFILE.focus}
          </p>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-2">
            {RESUME_SNAPSHOT.map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-app px-3 py-2.5 text-center"
              >
                <p className="text-lg font-bold tabular-nums text-ink">
                  {item.value}
                </p>
                <p className="text-[10px] leading-tight text-muted">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <dl className="space-y-2.5 border-t border-border pt-4">
            {RESUME_QUICK_FACTS.map((fact) => (
              <div key={fact.label}>
                <dt className="text-[11px] font-medium uppercase tracking-wide text-subtle">
                  {fact.label}
                </dt>
                <dd className="mt-0.5 text-sm text-body">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="space-y-2 border-t border-border pt-4">
            <a
              href={`mailto:${RESUME_CONTACT.email}?subject=Trao đổi vị trí - ${RESUME_PROFILE.name}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink/90"
            >
              <Mail size={15} aria-hidden />
              Gửi email
            </a>
            <a
              href={RESUME_CONTACT.github}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-hover"
            >
              <Code2 size={15} aria-hidden />
              {RESUME_CONTACT.githubLabel}
            </a>
            <Link
              to="/projects"
              className="block text-center text-xs font-medium text-brand hover:text-brand-hover"
            >
              Xem code & demo →
            </Link>
          </div>
        </div>
      </div>

      <nav
        className="mt-4 hidden rounded-2xl border border-border bg-surface p-3 lg:block"
        aria-label="Mục lục resume"
      >
        <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-subtle">
          Mục lục
        </p>
        <ul className="space-y-0.5">
          {RESUME_SECTIONS.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted transition hover:bg-hover hover:text-ink"
              >
                <span className="font-mono-ui text-[10px] text-subtle">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <p className="mt-3 hidden text-center text-[11px] text-subtle lg:block">
        {RESUME_CONTACT.location} · {RESUME_CONTACT.responseTime}
      </p>
    </aside>
  );
}

export default ResumeSidebar;
