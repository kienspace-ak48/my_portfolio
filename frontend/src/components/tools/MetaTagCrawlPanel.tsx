import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowDownToLine,
  CheckCircle2,
  Eye,
  Globe,
  Loader2,
  ListTree,
  Search,
} from "lucide-react";
import { crawlMetaFromUrl, type CrawlMetaResult } from "../../utils/metaTagCrawl";
import {
  buildCrawlSuggestions,
  buildMetaTagsHtml,
  formFromCrawledParsed,
  inspectorSummary,
  inspectMetaTags,
  listMissingTags,
  type CrawlSuggestion,
  type MetaTagForm,
} from "../../utils/metaTagGenerator";
import MetaTagPreviewPanel from "./MetaTagPreviewPanel";

type Props = {
  onApply: (form: MetaTagForm, crawl: CrawlMetaResult) => void;
};

type ResultTab = "analysis" | "preview";

function MetaTagCrawlPanel({ onApply }: Props) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultTab, setResultTab] = useState<ResultTab>("analysis");
  const [result, setResult] = useState<CrawlMetaResult | null>(null);
  const [suggestions, setSuggestions] = useState<CrawlSuggestion[]>([]);
  const [missing, setMissing] = useState<
    ReturnType<typeof listMissingTags>
  >([]);

  useEffect(() => {
    const fromQuery = searchParams.get("url");
    const fromState = (location.state as { crawlUrl?: string } | null)?.crawlUrl;
    const next = fromQuery || fromState;
    if (next) setUrl(next);
  }, [location.state, searchParams]);

  async function handleCrawl() {
    if (!url.trim()) {
      setError("Nhập URL website cần phân tích.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await crawlMetaFromUrl(url.trim());
      const form = formFromCrawledParsed(data.parsed);

      setResult(data);
      setResultTab("preview");
      setMissing(listMissingTags(data.foundTags));
      setSuggestions(buildCrawlSuggestions(form));
    } catch (err) {
      setResult(null);
      setMissing([]);
      setSuggestions([]);
      setError(
        err instanceof Error
          ? err.message
          : "Không thể crawl trang. Kiểm tra URL và thử lại.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleApply() {
    if (!result) return;
    onApply(formFromCrawledParsed(result.parsed), result);
  }

  const crawledForm = result ? formFromCrawledParsed(result.parsed) : null;
  const crawledHtml = crawledForm ? buildMetaTagsHtml(crawledForm) : "";

  const summary = crawledForm
    ? inspectorSummary(inspectMetaTags(crawledForm))
    : null;

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <Globe size={18} aria-hidden />
            Crawl meta từ URL
          </h2>
          <p className="mt-1 text-sm text-muted">
            Dán link website để trích xuất meta hiện có, liệt kê thiếu sót và
            gợi ý sửa.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCrawl();
          }}
          placeholder="kienvu.id.vn hoặc https://example.com"
          className="w-full flex-1 rounded-xl border border-border bg-app px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand"
        />
        <button
          type="button"
          onClick={handleCrawl}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" aria-hidden />
          ) : (
            <Search size={16} aria-hidden />
          )}
          Phân tích
        </button>
      </div>

      {error ? (
        <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-5 space-y-5 border-t border-border pt-5">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted">
              Đã crawl:{" "}
              <a
                href={result.finalUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-brand hover:underline"
              >
                {result.finalUrl}
              </a>
            </span>
            <span className="rounded-full bg-app px-2 py-0.5 text-xs text-muted">
              HTTP {result.statusCode}
            </span>
            {summary ? (
              <>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  ✓ {summary.ok}
                </span>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                  ! {summary.warn}
                </span>
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">
                  ✕ {summary.error}
                </span>
              </>
            ) : null}
            <button
              type="button"
              onClick={handleApply}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-brand-border bg-brand-soft px-3 py-1.5 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
            >
              <ArrowDownToLine size={14} aria-hidden />
              Nạp sang Generator
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setResultTab("analysis")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
                resultTab === "analysis"
                  ? "bg-brand text-white"
                  : "border border-border bg-app text-muted hover:text-ink"
              }`}
            >
              <ListTree size={15} aria-hidden />
              Phân tích
            </button>
            <button
              type="button"
              onClick={() => setResultTab("preview")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
                resultTab === "preview"
                  ? "bg-brand text-white"
                  : "border border-border bg-app text-muted hover:text-ink"
              }`}
            >
              <Eye size={15} aria-hidden />
              Xem trực quan
            </button>
          </div>

          {resultTab === "preview" && crawledForm ? (
            <MetaTagPreviewPanel
              form={crawledForm}
              html={crawledHtml}
              showCode
              showInspector
              compact
            />
          ) : null}

          {resultTab === "analysis" ? (
          <>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-bold text-ink">
                Meta đã tìm thấy ({result.foundTags.length})
              </h3>
              <ul className="mt-2 max-h-52 space-y-1.5 overflow-auto rounded-xl border border-border bg-app p-3">
                {result.foundTags.length === 0 ? (
                  <li className="text-sm text-muted">Không tìm thấy meta tag.</li>
                ) : (
                  result.foundTags.map((item) => (
                    <li key={item.tag} className="text-xs">
                      <span className="font-mono-ui font-semibold text-brand">
                        {item.tag}
                      </span>
                      <p className="mt-0.5 line-clamp-2 text-muted">
                        {item.value}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-ink">
                Meta còn thiếu ({missing.length})
              </h3>
              <ul className="mt-2 max-h-52 space-y-1.5 overflow-auto rounded-xl border border-border bg-app p-3">
                {missing.length === 0 ? (
                  <li className="flex items-center gap-2 text-sm text-emerald-700">
                    <CheckCircle2 size={16} aria-hidden />
                    Đủ các meta quan trọng.
                  </li>
                ) : (
                  missing.map((item) => (
                    <li
                      key={item.tag}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      <span className="font-mono-ui font-medium text-ink">
                        {item.tag}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          item.level === "required"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.level === "required" ? "Bắt buộc" : "Nên có"}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {suggestions.length > 0 ? (
            <div>
              <h3 className="text-sm font-bold text-ink">
                Gợi ý cải thiện ({suggestions.length})
              </h3>
              <ul className="mt-2 space-y-2">
                {suggestions.map((item) => (
                  <li
                    key={`${item.tag}-${item.issue}`}
                    className="rounded-xl border border-border bg-app px-3 py-2.5"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle
                        size={16}
                        className={`mt-0.5 shrink-0 ${
                          item.status === "error"
                            ? "text-rose-500"
                            : "text-amber-500"
                        }`}
                        aria-hidden
                      />
                      <div>
                        <p className="text-sm font-medium text-ink">
                          <span className="font-mono-ui text-brand">
                            {item.tag}
                          </span>
                          {" — "}
                          {item.issue}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted">
                          {item.fix}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          </>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export default MetaTagCrawlPanel;
