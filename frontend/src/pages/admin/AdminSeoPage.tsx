import { useEffect, useState } from "react";
import { FileText, Globe } from "lucide-react";
import api from "../../api/axios";
import SeoMetaCoveragePanel from "../../components/admin/seo/SeoMetaCoveragePanel";
import SeoOgImageField from "../../components/admin/seo/SeoOgImageField";
import SeoTemplateVarPanel from "../../components/admin/seo/SeoTemplateVarPanel";
import { DYNAMIC_OG_PAGE_KEYS } from "../../data/seoTemplateVars";
import type { SeoPageTemplate, SeoPublicConfig } from "../../seo/types";

export async function fetchAdminSeoConfig(): Promise<SeoPublicConfig & { pages: SeoPageTemplate[] }> {
  const response = await api.get<{ success: boolean; data: SeoPublicConfig }>("/admin/seo");
  return response.data.data;
}

export async function updateAdminSeoGlobal(payload: SeoPublicConfig["global"]) {
  const response = await api.put<{ success: boolean; data: SeoPublicConfig["global"] }>(
    "/admin/seo/global",
    payload,
  );
  return response.data.data;
}

export async function updateAdminSeoPage(pageKey: string, payload: Partial<SeoPageTemplate>) {
  const response = await api.put<{ success: boolean; data: SeoPageTemplate }>(
    `/admin/seo/pages/${encodeURIComponent(pageKey)}`,
    payload,
  );
  return response.data.data;
}

const inputClass =
  "w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand";

const panelClass =
  "flex max-h-[calc(100vh-11rem)] flex-col rounded-2xl border border-border bg-white";

function AdminSeoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [config, setConfig] = useState<SeoPublicConfig | null>(null);
  const [selectedKey, setSelectedKey] = useState("home");

  useEffect(() => {
    fetchAdminSeoConfig()
      .then((data) => {
        setConfig(data);
        setError("");
      })
      .catch(() => {
        setError(
          "Không tải được cấu hình SEO. Kiểm tra backend đang chạy và đã chạy prisma migrate deploy.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedPage = config?.pages.find((page) => page.pageKey === selectedKey);

  async function handleSaveGlobal() {
    if (!config) return;
    try {
      setSaving(true);
      setMessage("");
      const global = await updateAdminSeoGlobal(config.global);
      setConfig((prev) => (prev ? { ...prev, global } : prev));
      setMessage("Đã lưu cấu hình global.");
    } catch {
      setMessage("Không thể lưu cấu hình global.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSavePage() {
    if (!selectedPage) return;
    try {
      setSaving(true);
      setMessage("");
      const page = await updateAdminSeoPage(selectedPage.pageKey, selectedPage);
      setConfig((prev) =>
        prev
          ? {
              ...prev,
              pages: prev.pages.map((item) =>
                item.pageKey === page.pageKey ? page : item,
              ),
            }
          : prev,
      );
      setMessage(`Đã lưu template ${page.pageKey}.`);
    } catch {
      setMessage("Không thể lưu template trang.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">Đang tải cấu hình SEO...</p>;
  }

  if (error || !config) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-8 text-center">
        <p className="font-medium text-rose-900">
          {error || "Không có dữ liệu SEO."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">SEO</h1>
          <p className="mt-1 text-sm text-muted">
            Global và page templates trong cùng một màn hình.
          </p>
        </div>
        {message ? (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
            {message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
        {/* ── Global ── */}
        <section className={panelClass}>
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-brand" aria-hidden />
              <h2 className="text-lg font-bold text-ink">Global</h2>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveGlobal}
              className="rounded-xl bg-brand px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
            >
              Lưu
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            <SeoMetaCoveragePanel siteUrl={config.global.siteUrl} />
            <SeoTemplateVarPanel compact />

            <label className="block text-sm">
              <span className="font-medium">Site name</span>
              <input
                className={`${inputClass} mt-1`}
                value={config.global.siteName}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    global: { ...config.global, siteName: e.target.value },
                  })
                }
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Site URL</span>
              <input
                className={`${inputClass} mt-1`}
                value={config.global.siteUrl}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    global: { ...config.global, siteUrl: e.target.value },
                  })
                }
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Tagline</span>
              <input
                className={`${inputClass} mt-1`}
                value={config.global.tagline ?? ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    global: { ...config.global, tagline: e.target.value },
                  })
                }
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Default title template</span>
              <input
                className={`${inputClass} mt-1`}
                value={config.global.defaultTitle}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    global: { ...config.global, defaultTitle: e.target.value },
                  })
                }
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Default description</span>
              <textarea
                className={`${inputClass} mt-1`}
                rows={3}
                value={config.global.defaultDescription}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    global: { ...config.global, defaultDescription: e.target.value },
                  })
                }
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Default keywords</span>
              <input
                className={`${inputClass} mt-1`}
                value={config.global.defaultKeywords ?? ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    global: { ...config.global, defaultKeywords: e.target.value },
                  })
                }
                placeholder="portfolio, nodejs, react"
              />
            </label>

            <SeoOgImageField
              label="OG image mặc định"
              hint="Fallback mọi trang — 1200×630 JPG/PNG. Trang động (dự án/blog) ưu tiên ảnh entity."
              value={config.global.ogImageUrl ?? ""}
              onChange={(url) =>
                setConfig({
                  ...config,
                  global: { ...config.global, ogImageUrl: url },
                })
              }
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="block text-sm">
                <span className="font-medium">Theme color</span>
                <div className="mt-1 flex gap-2">
                  <input
                    type="color"
                    value={config.global.themeColor ?? "#6366f1"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        global: { ...config.global, themeColor: e.target.value },
                      })
                    }
                    className="h-10 w-14 cursor-pointer rounded-lg border border-border bg-white"
                  />
                  <input
                    className={inputClass}
                    value={config.global.themeColor ?? "#6366f1"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        global: { ...config.global, themeColor: e.target.value },
                      })
                    }
                  />
                </div>
              </label>
              <label className="block text-sm">
                <span className="font-medium">Twitter @site</span>
                <input
                  className={`${inputClass} mt-1`}
                  value={config.global.twitterSite ?? ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      global: { ...config.global, twitterSite: e.target.value },
                    })
                  }
                  placeholder="@username"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium">og:locale</span>
                <input
                  className={`${inputClass} mt-1`}
                  value={config.global.ogLocale ?? "vi_VN"}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      global: { ...config.global, ogLocale: e.target.value },
                    })
                  }
                  placeholder="vi_VN"
                />
                <span className="mt-1 block text-[11px] text-muted">
                  vd: vi_VN, en_US — dùng cho Open Graph + lang HTML
                </span>
              </label>
            </div>

            <div className="rounded-xl border border-border bg-app/50 p-3">
              <p className="text-sm font-semibold text-ink">Organization (JSON-LD)</p>
              <div className="mt-3 space-y-3">
                <label className="block text-sm">
                  <span className="font-medium">Tên</span>
                  <input
                    className={`${inputClass} mt-1`}
                    value={config.global.organization?.name ?? ""}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        global: {
                          ...config.global,
                          organization: {
                            ...config.global.organization,
                            name: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium">URL</span>
                  <input
                    className={`${inputClass} mt-1`}
                    value={config.global.organization?.url ?? ""}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        global: {
                          ...config.global,
                          organization: {
                            ...config.global.organization,
                            url: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </label>
                <SeoOgImageField
                  label="Logo"
                  compact
                  value={config.global.organization?.logoUrl ?? ""}
                  onChange={(url) =>
                    setConfig({
                      ...config,
                      global: {
                        ...config.global,
                        organization: {
                          ...config.global.organization,
                          logoUrl: url,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={config.global.allowIndexing ?? true}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    global: { ...config.global, allowIndexing: e.target.checked },
                  })
                }
              />
              Cho phép index (robots.txt + sitemap)
            </label>
          </div>
        </section>

        {/* ── Page templates ── */}
        <section className={panelClass}>
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-brand" aria-hidden />
                <h2 className="text-lg font-bold text-ink">Page templates</h2>
              </div>
              <p className="mt-1 text-xs text-muted">
                {`{{siteName}}`}, {`{{projectTitle}}`}, {`{{blogTitle}}`}…
              </p>
            </div>
            <button
              type="button"
              disabled={saving || !selectedPage}
              onClick={handleSavePage}
              className="rounded-xl bg-brand px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
            >
              Lưu
            </button>
          </div>

          <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[minmax(0,180px)_minmax(0,1fr)]">
            <div className="overflow-y-auto border-b border-border p-2 lg:border-r lg:border-b-0">
              {config.pages.map((page) => (
                <button
                  key={page.pageKey}
                  type="button"
                  onClick={() => setSelectedKey(page.pageKey)}
                  className={`mb-1 block w-full rounded-lg px-3 py-2 text-left text-sm transition last:mb-0 ${
                    selectedKey === page.pageKey
                      ? "bg-brand-soft font-semibold text-brand"
                      : "text-muted hover:bg-app hover:text-ink"
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </div>

            {selectedPage ? (
              <div className="space-y-4 overflow-y-auto p-4">
                <p className="text-xs text-muted">
                  pageKey:{" "}
                  <code className="font-mono-ui text-ink">{selectedPage.pageKey}</code>
                </p>

                <SeoTemplateVarPanel pageKey={selectedPage.pageKey} />

                <label className="block text-sm">
                  <span className="font-medium">Title template</span>
                  <input
                    className={`${inputClass} mt-1`}
                    value={selectedPage.titleTemplate}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        pages: config.pages.map((item) =>
                          item.pageKey === selectedPage.pageKey
                            ? { ...item, titleTemplate: e.target.value }
                            : item,
                        ),
                      })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium">Description template</span>
                  <textarea
                    className={`${inputClass} mt-1`}
                    rows={4}
                    value={selectedPage.descriptionTemplate}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        pages: config.pages.map((item) =>
                          item.pageKey === selectedPage.pageKey
                            ? { ...item, descriptionTemplate: e.target.value }
                            : item,
                        ),
                      })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium">Keywords template</span>
                  <input
                    className={`${inputClass} mt-1`}
                    value={selectedPage.keywordsTemplate ?? ""}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        pages: config.pages.map((item) =>
                          item.pageKey === selectedPage.pageKey
                            ? { ...item, keywordsTemplate: e.target.value }
                            : item,
                        ),
                      })
                    }
                    placeholder="{{siteName}}, portfolio"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium">Robots</span>
                  <input
                    className={`${inputClass} mt-1`}
                    value={selectedPage.robots}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        pages: config.pages.map((item) =>
                          item.pageKey === selectedPage.pageKey
                            ? { ...item, robots: e.target.value }
                            : item,
                        ),
                      })
                    }
                  />
                </label>

                {DYNAMIC_OG_PAGE_KEYS.has(selectedPage.pageKey) ? (
                  <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                    Trang động: OG image tự lấy từ thumbnail/cover —{" "}
                    <strong>không cần</strong> OG riêng ở đây trừ khi muốn
                    override fallback.
                  </p>
                ) : (
                  <SeoOgImageField
                    label="OG image override (tuỳ chọn)"
                    hint="Để trống = dùng OG global. Chỉ cần cho trang tĩnh (home, tools…)."
                    compact
                    value={selectedPage.ogImageUrl ?? ""}
                    onChange={(url) =>
                      setConfig({
                        ...config,
                        pages: config.pages.map((item) =>
                          item.pageKey === selectedPage.pageKey
                            ? { ...item, ogImageUrl: url || null }
                            : item,
                        ),
                      })
                    }
                  />
                )}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminSeoPage;
