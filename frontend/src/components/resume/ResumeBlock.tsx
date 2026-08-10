import type { ReactNode } from "react";

type ResumeBlockProps = {
  id: string;
  index: number;
  title: string;
  lead?: string;
  children: ReactNode;
};

function ResumeBlock({ id, index, title, lead, children }: ResumeBlockProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-24 border-b border-border pb-10 last:border-b-0 last:pb-0"
    >
      <header className="mb-5 flex items-start gap-4">
        <span className="font-mono-ui mt-1 shrink-0 text-xs font-semibold tabular-nums text-brand">
          {String(index).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <h2
            id={`${id}-heading`}
            className="text-lg font-bold tracking-tight text-ink sm:text-xl"
          >
            {title}
          </h2>
          {lead ? (
            <p className="mt-1 text-sm leading-relaxed text-muted">{lead}</p>
          ) : null}
        </div>
      </header>
      {children}
    </section>
  );
}

export default ResumeBlock;
