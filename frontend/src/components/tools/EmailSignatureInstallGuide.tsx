import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { SIGNATURE_INSTALL_GUIDES } from "../../utils/emailSignature";

export default function EmailSignatureInstallGuide() {
  const [openId, setOpenId] = useState("gmail");

  return (
    <section className="rounded-2xl border border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <HelpCircle size={16} />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-ink">Hướng dẫn cài đặt</h2>
          <p className="text-xs text-muted">Gmail, Outlook, Apple Mail…</p>
        </div>
      </div>

      <div className="divide-y divide-border">
        {SIGNATURE_INSTALL_GUIDES.map((guide) => {
          const open = openId === guide.id;
          return (
            <div key={guide.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? "" : guide.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-ink transition hover:bg-hover"
              >
                {guide.title}
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-muted transition ${open ? "rotate-180" : ""}`}
                />
              </button>
              {open && (
                <ol className="space-y-2 border-t border-border bg-app/50 px-4 py-3 text-xs leading-relaxed text-muted">
                  {guide.steps.map((step, i) => (
                    <li key={step} className="flex gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[10px] font-bold text-brand">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
