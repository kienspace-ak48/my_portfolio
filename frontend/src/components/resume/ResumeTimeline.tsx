import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ResumeExperience } from "../../data/resumeContent";

function ResumeTimeline({ items }: { items: ResumeExperience[] }) {
  return (
    <ol className="relative space-y-0">
      <div
        className="absolute top-2 bottom-2 left-[7px] w-px bg-border"
        aria-hidden
      />
      {items.map((job, index) => (
        <li key={job.id} className="relative pl-8 pb-8 last:pb-0">
          <span
            className="absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border-2 border-surface bg-brand ring-2 ring-brand/20"
            aria-hidden
          />
          {index < items.length - 1 ? null : null}

          <div className="rounded-xl border border-border bg-surface p-4 transition hover:border-border-strong sm:p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <div>
                <h3 className="font-semibold text-ink">{job.company}</h3>
                <p className="text-sm text-muted">
                  {job.role}
                  <span className="mx-1.5 text-subtle">·</span>
                  <span className="font-mono-ui text-xs">{job.period}</span>
                </p>
              </div>
              {job.projectHref ? (
                <Link
                  to={job.projectHref}
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand hover:text-brand-hover"
                >
                  Demo
                  <ArrowUpRight size={13} aria-hidden />
                </Link>
              ) : null}
            </div>

            <p className="mt-3 text-sm leading-relaxed text-body">
              {job.context}
            </p>

            <ul className="mt-3 space-y-1.5">
              {job.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="relative pl-4 text-sm leading-relaxed text-body before:absolute before:left-0 before:top-[0.55em] before:h-1 before:w-1 before:rounded-full before:bg-subtle"
                >
                  {bullet}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-app px-2 py-0.5 font-mono-ui text-[11px] text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default ResumeTimeline;
