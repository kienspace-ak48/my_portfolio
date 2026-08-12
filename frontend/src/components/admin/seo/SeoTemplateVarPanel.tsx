import { useState } from "react";
import { Check, ChevronDown, Copy, HelpCircle } from "lucide-react";
import {
  SEO_TEMPLATE_VARS,
  SEO_VAR_GROUPS,
  type SeoVarGroup,
} from "../../../data/seoTemplateVars";

type Props = {
  pageKey?: string;
  compact?: boolean;
};

export default function SeoTemplateVarPanel({ pageKey, compact = false }: Props) {
  const [open, setOpen] = useState(!compact);
  const [copied, setCopied] = useState<string | null>(null);

  async function copyToken(token: string) {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(token);
      window.setTimeout(() => setCopied(null), 1200);
    } catch {
      /* ignore */
    }
  }

  const groups = (Object.keys(SEO_VAR_GROUPS) as SeoVarGroup[]).filter(
    (group) => group !== "auto" && SEO_TEMPLATE_VARS.some((v) => v.group === group),
  );

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50/80">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
      >
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-sky-950">
          <HelpCircle size={16} aria-hidden />
          Biến template {pageKey ? `— ${pageKey}` : ""}
        </span>
        <ChevronDown
          size={16}
          className={`text-sky-700 transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="space-y-3 border-t border-sky-200 px-3 pb-3 pt-2">
          <p className="text-xs leading-relaxed text-sky-900/80">
            Gõ <code className="rounded bg-white/80 px-1">{`{{tênBiến}}`}</code>{" "}
            trong title/description/keywords. Click chip để copy.
          </p>

          {groups.map((group) => {
            const meta = SEO_VAR_GROUPS[group];
            const Icon = meta.icon;
            const vars = SEO_TEMPLATE_VARS.filter((v) => v.group === group);

            return (
              <div key={group}>
                <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-sky-900">
                  <Icon size={13} aria-hidden />
                  {meta.label}
                </div>
                <p className="mb-2 text-[11px] text-sky-800/70">{meta.hint}</p>
                <div className="flex flex-wrap gap-1.5">
                  {vars.map((item) => {
                    const relevant =
                      !pageKey ||
                      !item.autoOn ||
                      item.autoOn.includes(pageKey) ||
                      group === "site" ||
                      group === "author";

                    return (
                      <button
                        key={item.key}
                        type="button"
                        title={item.description}
                        disabled={pageKey ? !relevant && !!item.autoOn : false}
                        onClick={() => copyToken(item.token)}
                        className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition ${
                          relevant
                            ? "border-sky-200 bg-white text-sky-950 hover:border-brand hover:text-brand"
                            : "cursor-not-allowed border-sky-100 bg-sky-100/50 text-sky-400"
                        }`}
                      >
                        {copied === item.token ? (
                          <Check size={11} aria-hidden />
                        ) : (
                          <Copy size={11} aria-hidden />
                        )}
                        {item.token}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {pageKey === "project.detail" || pageKey === "blog.post" ? (
            <p className="rounded-lg bg-white/70 px-2.5 py-2 text-[11px] text-sky-900">
              <strong>OG image:</strong> trang động tự lấy thumbnail/cover — không
              cần biến {`{{ogImage}}`} trong template.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
