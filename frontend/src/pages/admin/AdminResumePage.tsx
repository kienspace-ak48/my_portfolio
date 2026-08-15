import { useEffect, useRef, useState, type ReactNode } from "react";
import { FileText, FileUser, Plus, RotateCcw, Trash2, Upload } from "lucide-react";
import {
  downloadResumeCv,
  fetchAdminResume,
  removeResumeCv,
  updateAdminResume,
  uploadResumeCv,
} from "../../api/resume.api";
import FeatureListInput from "../../components/admin/FeatureListInput";
import TagInput from "../../components/admin/TagInput";
import SeoOgImageField from "../../components/admin/seo/SeoOgImageField";
import {
  adminInputClass,
  adminLabelClass,
  adminSectionDescClass,
  adminSectionTitleClass,
} from "../../components/admin/adminFormStyles";
import type { ResumeContent, ResumeExperience } from "../../types/resume";

const panelClass =
  "flex max-h-[calc(100vh-11rem)] flex-col rounded-2xl border border-border bg-white";

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className={adminSectionTitleClass}>{title}</h3>
        {desc ? <p className={`mt-0.5 ${adminSectionDescClass}`}>{desc}</p> : null}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function AdminResumePage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [content, setContent] = useState<ResumeContent | null>(null);
  const [defaults, setDefaults] = useState<ResumeContent | null>(null);
  const [cvPdfUrl, setCvPdfUrl] = useState<string | null>(null);
  const [cvPdfFileName, setCvPdfFileName] = useState<string | null>(null);
  const [hasCustomContent, setHasCustomContent] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const data = await fetchAdminResume();
      setContent(data.content);
      setDefaults(data.defaults);
      setCvPdfUrl(data.cvPdfUrl);
      setCvPdfFileName(data.cvPdfFileName);
      setHasCustomContent(data.hasCustomContent);
      setError("");
    } catch {
      setError("Không tải được cấu hình resume. Kiểm tra backend và prisma migrate.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave() {
    if (!content) return;
    try {
      setSaving(true);
      setMessage("");
      await updateAdminResume(content);
      setHasCustomContent(true);
      setMessage("Đã lưu nội dung resume.");
    } catch {
      setMessage("Không thể lưu resume.");
    } finally {
      setSaving(false);
    }
  }

  function handleResetDefaults() {
    if (!defaults) return;
    setContent(structuredClone(defaults));
    setResetConfirmOpen(false);
    setMessage("Đã khôi phục form về mặc định — bấm Lưu để ghi DB.");
  }

  async function handleCvUpload(file: File) {
    if (file.type !== "application/pdf") {
      setMessage("Chỉ chấp nhận file PDF.");
      return;
    }
    try {
      setUploading(true);
      setMessage("");
      const result = await uploadResumeCv(file);
      setCvPdfUrl(result.cvPdfUrl);
      setCvPdfFileName(result.cvPdfFileName);
      setMessage("Đã tải CV PDF lên.");
    } catch {
      setMessage("Không thể tải CV PDF.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleRemoveCv() {
    if (!window.confirm("Xóa file CV đã upload?")) return;
    try {
      setUploading(true);
      const result = await removeResumeCv();
      setCvPdfUrl(result.cvPdfUrl);
      setCvPdfFileName(result.cvPdfFileName);
      setMessage("Đã xóa CV PDF.");
    } catch {
      setMessage("Không thể xóa CV PDF.");
    } finally {
      setUploading(false);
    }
  }

  function updateExperience(index: number, patch: Partial<ResumeExperience>) {
    if (!content) return;
    const experience = content.experience.map((item, i) =>
      i === index ? { ...item, ...patch } : item,
    );
    setContent({ ...content, experience });
  }

  if (loading || !content) {
    return <p className="text-sm text-muted">{error || "Đang tải resume..."}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Resume</h1>
          <p className="mt-1 text-sm text-muted">
            Cấu hình trang /resume — chưa lưu DB sẽ dùng fallback mặc định.
            {hasCustomContent ? " Đang có bản tùy chỉnh." : " Chưa lưu tùy chỉnh."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {message ? (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
              {message}
            </p>
          ) : null}
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
          >
            {saving ? "Đang lưu..." : "Lưu nội dung"}
          </button>
          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-border px-3 py-2 text-sm text-muted transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
          >
            <RotateCcw size={14} aria-hidden />
            Khôi phục mặc định
          </button>
        </div>
      </div>

      {resetConfirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-resume-title"
          >
            <h2 id="reset-resume-title" className="text-lg font-semibold text-ink">
              Khôi phục mặc định?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Toàn bộ nội dung form sẽ quay về bản mặc định. Thay đổi chưa bấm{" "}
              <strong className="font-medium text-ink">Lưu nội dung</strong> sẽ mất.
              File CV đã upload không bị xóa.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-hover"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
              >
                Khôi phục
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-800">
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
        {/* ── Cột trái: sidebar + hồ sơ ── */}
        <section className={panelClass}>
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <FileUser size={18} className="text-brand" aria-hidden />
              <h2 className="text-lg font-bold text-ink">Sidebar & hồ sơ</h2>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
            <Section
              title="CV PDF"
              desc="Hiện nút tải xuống trên sidebar /resume."
            >
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCvUpload(file);
                }}
              />

              {cvPdfUrl ? (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-app/60 px-4 py-3">
                  <FileText size={20} className="text-brand" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {cvPdfFileName || "CV.pdf"}
                    </p>
                    <button
                      type="button"
                      onClick={() => downloadResumeCv().catch(() => window.alert("Không thể tải CV."))}
                      className="text-xs text-brand hover:underline"
                    >
                      Tải file
                    </button>
                  </div>
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileRef.current?.click()}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-white"
                  >
                    Thay file
                  </button>
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={handleRemoveCv}
                    className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
                  >
                    Xóa
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border-strong px-6 py-6 text-sm text-muted transition hover:border-brand hover:bg-brand-soft/30"
                >
                  <Upload size={22} className="text-brand" />
                  {uploading ? "Đang tải lên..." : "Chọn file PDF CV"}
                </button>
              )}
            </Section>

            <Section title="Hồ sơ & liên hệ">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm sm:col-span-2">
                  <span className={adminLabelClass}>Họ tên</span>
                  <input
                    className={adminInputClass}
                    value={content.profile.name}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        profile: { ...content.profile, name: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className={adminLabelClass}>Chức danh</span>
                  <input
                    className={adminInputClass}
                    value={content.profile.title}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        profile: { ...content.profile, title: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className={adminLabelClass}>Focus stack</span>
                  <input
                    className={adminInputClass}
                    value={content.profile.focus}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        profile: { ...content.profile, focus: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className={adminLabelClass}>Availability</span>
                  <input
                    className={adminInputClass}
                    value={content.profile.availability}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        profile: { ...content.profile, availability: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <SeoOgImageField
                    label="Avatar"
                    hint="Ảnh hiển thị trên sidebar /resume."
                    value={content.profile.avatarUrl}
                    onChange={(avatarUrl) =>
                      setContent({
                        ...content,
                        profile: { ...content.profile, avatarUrl },
                      })
                    }
                    compact
                    previewAspect="square"
                    emptyLabel="Chưa chọn avatar"
                    galleryTitle="Chọn avatar"
                    galleryDescription="Ảnh vuông — nên dùng JPG/PNG."
                    uploadFolder="resume"
                    urlPlaceholder="https://…/avatar.jpg hoặc chọn từ Gallery"
                  />
                </label>
                <label className="block text-sm">
                  <span className={adminLabelClass}>Email</span>
                  <input
                    className={adminInputClass}
                    value={content.contact.email}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, email: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className={adminLabelClass}>GitHub URL</span>
                  <input
                    className={adminInputClass}
                    value={content.contact.github}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, github: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className={adminLabelClass}>GitHub label</span>
                  <input
                    className={adminInputClass}
                    value={content.contact.githubLabel}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, githubLabel: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className={adminLabelClass}>Location</span>
                  <input
                    className={adminInputClass}
                    value={content.contact.location}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, location: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className={adminLabelClass}>Thời gian phản hồi</span>
                  <input
                    className={adminInputClass}
                    value={content.contact.responseTime}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, responseTime: e.target.value },
                      })
                    }
                  />
                </label>
              </div>
            </Section>

            <Section title="Snapshot (2×2)">
              <div className="grid gap-2 sm:grid-cols-2">
                {content.snapshot.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-border bg-app/50 p-2.5 space-y-1.5"
                  >
                    <input
                      className={adminInputClass}
                      placeholder="Giá trị"
                      value={item.value}
                      onChange={(e) => {
                        const snapshot = [...content.snapshot];
                        snapshot[index] = { ...snapshot[index], value: e.target.value };
                        setContent({ ...content, snapshot });
                      }}
                    />
                    <input
                      className={adminInputClass}
                      placeholder="Nhãn"
                      value={item.label}
                      onChange={(e) => {
                        const snapshot = [...content.snapshot];
                        snapshot[index] = { ...snapshot[index], label: e.target.value };
                        setContent({ ...content, snapshot });
                      }}
                    />
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Quick facts">
              <div className="space-y-2">
                {content.quickFacts.map((fact, index) => (
                  <div key={index} className="grid gap-2 sm:grid-cols-2">
                    <input
                      className={adminInputClass}
                      placeholder="Nhãn"
                      value={fact.label}
                      onChange={(e) => {
                        const quickFacts = [...content.quickFacts];
                        quickFacts[index] = { ...quickFacts[index], label: e.target.value };
                        setContent({ ...content, quickFacts });
                      }}
                    />
                    <input
                      className={adminInputClass}
                      placeholder="Giá trị"
                      value={fact.value}
                      onChange={(e) => {
                        const quickFacts = [...content.quickFacts];
                        quickFacts[index] = { ...quickFacts[index], value: e.target.value };
                        setContent({ ...content, quickFacts });
                      }}
                    />
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </section>

        {/* ── Cột phải: nội dung chính ── */}
        <section className={panelClass}>
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-brand" aria-hidden />
              <h2 className="text-lg font-bold text-ink">Nội dung trang</h2>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
            <Section title="Giới thiệu ngắn">
              <textarea
                className={adminInputClass}
                rows={4}
                value={content.profile.intro}
                onChange={(e) =>
                  setContent({
                    ...content,
                    profile: { ...content.profile, intro: e.target.value },
                  })
                }
              />
            </Section>

            <Section title="Phạm vi làm việc">
              {content.scope.map((item, index) => (
                <div key={item.id} className="space-y-2 rounded-lg border border-border p-3">
                  <input
                    className={adminInputClass}
                    placeholder="Lĩnh vực"
                    value={item.area}
                    onChange={(e) => {
                      const scope = [...content.scope];
                      scope[index] = { ...scope[index], area: e.target.value };
                      setContent({ ...content, scope });
                    }}
                  />
                  <textarea
                    className={adminInputClass}
                    rows={2}
                    placeholder="Chi tiết"
                    value={item.detail}
                    onChange={(e) => {
                      const scope = [...content.scope];
                      scope[index] = { ...scope[index], detail: e.target.value };
                      setContent({ ...content, scope });
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setContent({
                    ...content,
                    scope: [
                      ...content.scope,
                      { id: newId("scope"), area: "", detail: "" },
                    ],
                  })
                }
                className="inline-flex items-center gap-1 text-xs font-medium text-brand"
              >
                <Plus size={14} /> Thêm dòng
              </button>
            </Section>

            <Section title="Dự án & kinh nghiệm">
              {content.experience.map((item, index) => (
                <div key={item.id} className="space-y-3 rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink">
                      {item.company || "Dự án mới"}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setContent({
                          ...content,
                          experience: content.experience.filter((_, i) => i !== index),
                        })
                      }
                      className="rounded p-1 text-muted hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Xóa"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      className={adminInputClass}
                      placeholder="Công ty / dự án"
                      value={item.company}
                      onChange={(e) => updateExperience(index, { company: e.target.value })}
                    />
                    <input
                      className={adminInputClass}
                      placeholder="Vai trò"
                      value={item.role}
                      onChange={(e) => updateExperience(index, { role: e.target.value })}
                    />
                    <input
                      className={adminInputClass}
                      placeholder="Thời gian"
                      value={item.period}
                      onChange={(e) => updateExperience(index, { period: e.target.value })}
                    />
                    <input
                      className={adminInputClass}
                      placeholder="Link dự án (tuỳ chọn)"
                      value={item.projectHref ?? ""}
                      onChange={(e) =>
                        updateExperience(index, { projectHref: e.target.value || undefined })
                      }
                    />
                  </div>
                  <textarea
                    className={adminInputClass}
                    rows={2}
                    placeholder="Bối cảnh"
                    value={item.context}
                    onChange={(e) => updateExperience(index, { context: e.target.value })}
                  />
                  <div>
                    <p className={adminLabelClass}>Bullet points</p>
                    <FeatureListInput
                      value={item.bullets}
                      onChange={(bullets) => updateExperience(index, { bullets })}
                    />
                  </div>
                  <div>
                    <p className={adminLabelClass}>Tags</p>
                    <TagInput
                      value={item.tags}
                      onChange={(tags) => updateExperience(index, { tags })}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setContent({
                    ...content,
                    experience: [
                      ...content.experience,
                      {
                        id: newId("exp"),
                        period: "",
                        role: "",
                        company: "",
                        context: "",
                        bullets: [""],
                        tags: [],
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1 text-xs font-medium text-brand"
              >
                <Plus size={14} /> Thêm kinh nghiệm
              </button>
            </Section>

            <Section title="Công nghệ quen dùng">
              <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                {content.skillGroups.map((group, index) => (
                  <div key={group.id} className="space-y-2 rounded-lg border border-border p-3">
                    <input
                      className={adminInputClass}
                      placeholder="Nhóm"
                      value={group.label}
                      onChange={(e) => {
                        const skillGroups = [...content.skillGroups];
                        skillGroups[index] = { ...skillGroups[index], label: e.target.value };
                        setContent({ ...content, skillGroups });
                      }}
                    />
                    <input
                      className={adminInputClass}
                      placeholder="Công nghệ — cách nhau bằng dấu phẩy"
                      value={group.items.join(", ")}
                      onChange={(e) => {
                        const skillGroups = [...content.skillGroups];
                        skillGroups[index] = {
                          ...skillGroups[index],
                          items: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        };
                        setContent({ ...content, skillGroups });
                      }}
                    />
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Mong muốn công việc">
              <label className="block text-sm">
                <span className={adminLabelClass}>Lead paragraph</span>
                <textarea
                  className={adminInputClass}
                  rows={2}
                  value={content.profile.preferencesIntro}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      profile: { ...content.profile, preferencesIntro: e.target.value },
                    })
                  }
                />
              </label>
              <div>
                <p className={adminLabelClass}>Danh sách mong muốn</p>
                <FeatureListInput
                  value={content.profile.preferences}
                  onChange={(preferences) =>
                    setContent({
                      ...content,
                      profile: { ...content.profile, preferences },
                    })
                  }
                />
              </div>
            </Section>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminResumePage;
