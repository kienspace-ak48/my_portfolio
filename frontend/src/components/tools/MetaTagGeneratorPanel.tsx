import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Code2, Copy, RefreshCw } from "lucide-react";
import { copyText } from "../../utils/copyText";
import {
  buildMetaTagsHtml,
  DEFAULT_META_FORM,
  resolveMetaValues,
  type MetaTagForm,
  type OgType,
  type TwitterCardType,
} from "../../utils/metaTagGenerator";
import MetaTagPreviewPanel from "./MetaTagPreviewPanel";
import {
  CharCounter,
  Field,
  FORM_PLATFORMS,
  inputClass,
  OG_TYPES,
  PlatformNote,
  TWITTER_CARDS,
  type FormPlatform,
} from "./metaTagFormUi";

type Props = {
  form: MetaTagForm;
  setForm: Dispatch<SetStateAction<MetaTagForm>>;
  twitterCustom: boolean;
  setTwitterCustom: Dispatch<SetStateAction<boolean>>;
};

function MetaTagGeneratorPanel({
  form,
  setForm,
  twitterCustom,
  setTwitterCustom,
}: Props) {
  const [formPlatform, setFormPlatform] = useState<FormPlatform>("common");
  const [syncOgFromSeo, setSyncOgFromSeo] = useState(true);
  const [copied, setCopied] = useState(false);

  const resolved = useMemo(() => resolveMetaValues(form), [form]);
  const html = useMemo(() => buildMetaTagsHtml(form), [form]);

  function update<K extends keyof MetaTagForm>(key: K, value: MetaTagForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSeoChange(key: "title" | "description", value: string) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (syncOgFromSeo) {
        if (key === "title" && !prev.ogTitle) next.ogTitle = value;
        if (key === "description" && !prev.ogDescription) {
          next.ogDescription = value;
        }
      }
      return next;
    });
  }

  function handleOgImageChange(value: string) {
    update("ogImage", value);
    if (!twitterCustom) update("twitterImage", value);
  }

  function resetForm() {
    setForm(DEFAULT_META_FORM);
    setTwitterCustom(false);
  }

  async function handleCopy() {
    const ok = await copyText(html);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    }
  }

  function renderPlatformFields() {
    switch (formPlatform) {
      case "common":
        return (
          <PlatformNote>
            Open Graph dùng chung cho Facebook, Zalo, LinkedIn, Telegram,
            Discord. Chỉnh các field OG ở trên — preview bên phải sẽ cập nhật
            theo từng nền tảng.
          </PlatformNote>
        );

      case "google":
        return (
          <PlatformNote>
            Google Search dùng <strong>title</strong>,{" "}
            <strong>description</strong> và <strong>canonical</strong> — không
            dùng Open Graph cho snippet tìm kiếm.
          </PlatformNote>
        );

      case "facebook":
        return (
          <PlatformNote>
            Facebook đọc Open Graph. Không cần tag riêng — đảm bảo{" "}
            <strong>og:image</strong> tối thiểu 1200×630 px, HTTPS.
          </PlatformNote>
        );

      case "zalo":
        return (
          <PlatformNote>
            Zalo crawl link preview qua Open Graph (og:title, og:description,
            og:image). Không có meta tag đặc thù cho Zalo.
          </PlatformNote>
        );

      case "linkedin":
        return (
          <PlatformNote>
            LinkedIn dùng Open Graph. Khuyến nghị ảnh 1200×627 px, title dưới
            200 ký tự.
          </PlatformNote>
        );

      case "x":
        return (
          <div className="space-y-4">
            <PlatformNote>
              X có Twitter Card riêng. Mặc định fallback sang Open Graph — bật
              override nếu muốn nội dung khác.
            </PlatformNote>

            <label className="flex items-center gap-2 text-sm text-body">
              <input
                type="checkbox"
                checked={twitterCustom}
                onChange={(e) => setTwitterCustom(e.target.checked)}
                className="accent-brand"
              />
              Dùng title / description / image riêng cho X
            </label>

            <Field label="twitter:card">
              <select
                value={form.twitterCard}
                onChange={(e) =>
                  update("twitterCard", e.target.value as TwitterCardType)
                }
                className={inputClass}
              >
                {TWITTER_CARDS.map((card) => (
                  <option key={card.value} value={card.value}>
                    {card.label}
                  </option>
                ))}
              </select>
            </Field>

            {twitterCustom ? (
              <>
                <Field label="twitter:title">
                  <input
                    value={form.twitterTitle}
                    onChange={(e) => update("twitterTitle", e.target.value)}
                    placeholder={resolved.ogTitle}
                    className={inputClass}
                  />
                </Field>
                <Field label="twitter:description">
                  <textarea
                    value={form.twitterDescription}
                    onChange={(e) =>
                      update("twitterDescription", e.target.value)
                    }
                    rows={2}
                    placeholder={resolved.ogDescription}
                    className={inputClass}
                  />
                </Field>
                <Field label="twitter:image">
                  <input
                    value={form.twitterImage}
                    onChange={(e) => update("twitterImage", e.target.value)}
                    placeholder={resolved.ogImage}
                    className={inputClass}
                  />
                </Field>
              </>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="twitter:site" hint="@username thương hiệu">
                <input
                  value={form.twitterSite}
                  onChange={(e) => update("twitterSite", e.target.value)}
                  placeholder="@kienvu"
                  className={inputClass}
                />
              </Field>
              <Field label="twitter:creator" hint="@username tác giả">
                <input
                  value={form.twitterCreator}
                  onChange={(e) => update("twitterCreator", e.target.value)}
                  placeholder="@kienvu"
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        );

      case "advanced":
        return (
          <div className="space-y-4">
            <Field label="theme-color">
              <div className="flex gap-2">
                <input
                  type="color"
                  value={form.themeColor}
                  onChange={(e) => update("themeColor", e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-lg border border-border bg-white"
                />
                <input
                  value={form.themeColor}
                  onChange={(e) => update("themeColor", e.target.value)}
                  className={inputClass}
                />
              </div>
            </Field>
            <Field label="Favicon URL">
              <input
                value={form.favicon}
                onChange={(e) => update("favicon", e.target.value)}
                placeholder="https://example.com/favicon.ico"
                className={inputClass}
              />
            </Field>
          </div>
        );
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div className="space-y-4">
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-subtle">
            SEO cơ bản
          </h2>
          <div className="mt-4 space-y-4">
            <label className="flex items-center gap-2 text-sm text-body">
              <input
                type="checkbox"
                checked={syncOgFromSeo}
                onChange={(e) => setSyncOgFromSeo(e.target.checked)}
                className="accent-brand"
              />
              Tự điền OG title/description từ SEO (nếu OG đang trống)
            </label>

            <Field
              label="title"
              counter={<CharCounter value={form.title} good={60} max={70} />}
            >
              <input
                value={form.title}
                onChange={(e) => handleSeoChange("title", e.target.value)}
                placeholder="Tiêu đề trang"
                className={inputClass}
              />
            </Field>

            <Field
              label="description"
              counter={
                <CharCounter value={form.description} good={160} max={200} />
              }
            >
              <textarea
                value={form.description}
                onChange={(e) =>
                  handleSeoChange("description", e.target.value)
                }
                rows={2}
                placeholder="Mô tả trang"
                className={inputClass}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="canonical">
                <input
                  value={form.canonical}
                  onChange={(e) => update("canonical", e.target.value)}
                  placeholder="https://kienvu.id.vn/trang"
                  className={inputClass}
                />
              </Field>
              <Field label="robots">
                <select
                  value={form.robots}
                  onChange={(e) => update("robots", e.target.value)}
                  className={inputClass}
                >
                  <option value="index, follow">index, follow</option>
                  <option value="noindex, follow">noindex, follow</option>
                  <option value="index, nofollow">index, nofollow</option>
                  <option value="noindex, nofollow">noindex, nofollow</option>
                </select>
              </Field>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-subtle">
            Open Graph — dùng chung
          </h2>
          <div className="mt-4 space-y-4">
            <Field
              label="og:title"
              counter={
                <CharCounter value={resolved.ogTitle} good={60} max={90} />
              }
            >
              <input
                value={form.ogTitle}
                onChange={(e) => update("ogTitle", e.target.value)}
                placeholder={form.title || "Tiêu đề khi chia sẻ"}
                className={inputClass}
              />
            </Field>

            <Field label="og:description">
              <textarea
                value={form.ogDescription}
                onChange={(e) => update("ogDescription", e.target.value)}
                rows={2}
                placeholder={form.description || "Mô tả preview"}
                className={inputClass}
              />
            </Field>

            <Field label="og:image" hint="1200×630 px, HTTPS">
              <input
                value={form.ogImage}
                onChange={(e) => handleOgImageChange(e.target.value)}
                placeholder="https://example.com/og-image.jpg"
                className={inputClass}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="og:url">
                <input
                  value={form.ogUrl}
                  onChange={(e) => update("ogUrl", e.target.value)}
                  placeholder={form.canonical || "https://example.com/page"}
                  className={inputClass}
                />
              </Field>
              <Field label="og:type">
                <select
                  value={form.ogType}
                  onChange={(e) => update("ogType", e.target.value as OgType)}
                  className={inputClass}
                >
                  {OG_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="og:site_name">
                <input
                  value={form.ogSiteName}
                  onChange={(e) => update("ogSiteName", e.target.value)}
                  placeholder="Kien's Space"
                  className={inputClass}
                />
              </Field>
              <Field label="og:locale">
                <input
                  value={form.ogLocale}
                  onChange={(e) => update("ogLocale", e.target.value)}
                  placeholder="vi_VN"
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-subtle">
            Tuỳ chọn theo nền tảng
          </h2>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {FORM_PLATFORMS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setFormPlatform(id)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                  formPlatform === id
                    ? "bg-brand text-white"
                    : "bg-app text-muted hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4">{renderPlatformFields()}</div>

          <button
            type="button"
            onClick={resetForm}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-brand"
          >
            <RefreshCw size={14} aria-hidden />
            Đặt lại form
          </button>
        </section>
      </div>

      <div className="space-y-4">
        <MetaTagPreviewPanel form={form} html={html} showCode showInspector />

        <section className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-ink">
              <Code2 size={18} aria-hidden />
              HTML Meta Tags
            </h2>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted transition hover:text-brand"
            >
              <Copy size={14} aria-hidden />
              Sao chép
            </button>
          </div>
          {copied ? (
            <p className="mt-2 text-sm text-emerald-600">Đã sao chép!</p>
          ) : null}
          <pre className="mt-3 max-h-48 overflow-auto rounded-xl bg-[#0f172a] p-4 text-xs leading-relaxed text-emerald-100">
            <code>{html || "<!-- ... -->"}</code>
          </pre>
        </section>
      </div>
    </div>
  );
}

export default MetaTagGeneratorPanel;
