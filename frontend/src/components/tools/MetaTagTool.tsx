import { useState } from "react";
import { Globe, Wand2 } from "lucide-react";
import type { CrawlMetaResult } from "../../utils/metaTagCrawl";
import { DEFAULT_META_FORM, type MetaTagForm } from "../../utils/metaTagGenerator";
import MetaTagCrawlPanel from "./MetaTagCrawlPanel";
import MetaTagGeneratorPanel from "./MetaTagGeneratorPanel";

type ToolMode = "crawl" | "generator";

function MetaTagTool() {
  const [mode, setMode] = useState<ToolMode>("crawl");
  const [form, setForm] = useState<MetaTagForm>(DEFAULT_META_FORM);
  const [twitterCustom, setTwitterCustom] = useState(false);

  function handleApplyFromCrawl(nextForm: MetaTagForm, _crawl: CrawlMetaResult) {
    setForm(nextForm);
    setTwitterCustom(
      Boolean(
        nextForm.twitterTitle ||
          nextForm.twitterDescription ||
          nextForm.twitterImage,
      ),
    );
    setMode("generator");
  }

  const tabs: { id: ToolMode; label: string; icon: typeof Globe }[] = [
    { id: "crawl", label: "Crawl URL", icon: Globe },
    { id: "generator", label: "Generator", icon: Wand2 },
  ];

  return (
    <div className="space-y-6">
      <div
        className="flex flex-wrap gap-2 rounded-2xl border border-border bg-surface p-2"
        role="tablist"
        aria-label="Chế độ meta tag"
      >
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            onClick={() => setMode(id)}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:flex-none ${
              mode === id
                ? "bg-brand text-white shadow-sm"
                : "text-muted hover:bg-hover hover:text-ink"
            }`}
          >
            <Icon size={16} aria-hidden />
            {label}
          </button>
        ))}
      </div>

      {mode === "crawl" ? (
        <MetaTagCrawlPanel onApply={handleApplyFromCrawl} />
      ) : (
        <MetaTagGeneratorPanel
          form={form}
          setForm={setForm}
          twitterCustom={twitterCustom}
          setTwitterCustom={setTwitterCustom}
        />
      )}
    </div>
  );
}

export default MetaTagTool;
