import { useMemo, useState, type ReactNode } from "react";
import {
  Briefcase,
  Check,
  Code2,
  Copy,
  Eye,
  Globe,
  ImageIcon,
  Mail,
  Palette,
  Phone,
  Plus,
  RefreshCw,
  Share2,
  Smartphone,
  Trash2,
  User,
} from "lucide-react";
import {
  buildEmailSignatureHtml,
  buildEmailSignaturePlainText,
  DEFAULT_EMAIL_SIGNATURE_FORM,
  newCustomSignatureLink,
  SIGNATURE_FONT_OPTIONS,
  type CustomSignatureLink,
  type EmailSignatureForm,
} from "../../utils/emailSignature";
import { copyHtml, copyText } from "../../utils/copyText";
import EmailSignatureInstallGuide from "./EmailSignatureInstallGuide";
import {
  CustomLinkBrandIcon,
  SOCIAL_PLATFORM_FIELDS,
} from "./socialBrandIcons";
import { Field } from "./metaTagFormUi";

const inputClass =
  "w-full rounded-xl border border-border bg-app py-2 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15";

function Panel({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: typeof User;
  title: string;
  desc?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <Icon size={18} />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
          {desc ? <p className="mt-0.5 text-xs text-muted">{desc}</p> : null}
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function IconInput({
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  icon: typeof Mail;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Icon
        size={15}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        type={type}
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function BrandInput({
  icon,
  value,
  onChange,
  placeholder,
}: {
  icon: ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center">
        {icon}
      </span>
      <input
        type="text"
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-border bg-app p-0.5"
        />
        <input
          className={inputClass.replace("pl-9", "px-3")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </label>
  );
}

export default function EmailSignatureTool() {
  const [form, setForm] = useState<EmailSignatureForm>(DEFAULT_EMAIL_SIGNATURE_FORM);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedPreview, setCopiedPreview] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const html = useMemo(() => buildEmailSignatureHtml(form), [form]);
  const plainText = useMemo(() => buildEmailSignaturePlainText(form), [form]);

  function update<K extends keyof EmailSignatureForm>(key: K, value: EmailSignatureForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateCustomLink(id: string, patch: Partial<CustomSignatureLink>) {
    setForm((prev) => ({
      ...prev,
      customLinks: prev.customLinks.map((link) =>
        link.id === id ? { ...link, ...patch } : link,
      ),
    }));
  }

  function addCustomLink() {
    setForm((prev) => ({
      ...prev,
      customLinks: [...prev.customLinks, newCustomSignatureLink()],
    }));
  }

  function removeCustomLink(id: string) {
    setForm((prev) => ({
      ...prev,
      customLinks: prev.customLinks.filter((link) => link.id !== id),
    }));
  }

  async function handleCopyHtml() {
    const ok = await copyText(html);
    if (ok) {
      setCopiedHtml(true);
      window.setTimeout(() => setCopiedHtml(false), 1800);
    }
  }

  async function handleCopyPreview() {
    const ok = await copyHtml(html, plainText);
    if (ok) {
      setCopiedPreview(true);
      window.setTimeout(() => setCopiedPreview(false), 1800);
    }
  }

  return (
    <div className="space-y-5">
      {/* Preview bar — top on all breakpoints */}
      <section className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Eye size={16} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-ink">Xem trước</h2>
              <p className="text-xs text-muted">Cập nhật realtime khi bạn nhập</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopyPreview}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              {copiedPreview ? <Check size={14} /> : <Copy size={14} />}
              {copiedPreview ? "Đã copy" : "Copy chữ ký"}
            </button>
            <button
              type="button"
              onClick={() => setShowCode((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-app px-3.5 py-2 text-xs font-semibold text-ink transition hover:bg-hover"
            >
              <Code2 size={14} />
              {showCode ? "Ẩn HTML" : "Xem HTML"}
            </button>
          </div>
        </div>
        <div
          className="overflow-x-auto rounded-xl border border-border p-4"
          style={{ backgroundColor: form.backgroundColor || "#fff" }}
        >
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        {showCode && (
          <div className="mt-3">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={handleCopyHtml}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
              >
                {copiedHtml ? <Check size={12} /> : <Copy size={12} />}
                {copiedHtml ? "Đã copy HTML" : "Copy HTML"}
              </button>
            </div>
            <pre className="max-h-48 overflow-auto rounded-xl border border-border bg-app p-3 text-[10px] leading-relaxed text-ink">
              <code>{html}</code>
            </pre>
          </div>
        )}
      </section>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-[1fr_1fr_280px]">
        {/* Column 1 — Personal + Contact */}
        <div className="space-y-4">
          <Panel icon={User} title="Thông tin cá nhân" desc="Tên, chức danh và ảnh đại diện">
            <IconInput
              icon={User}
              value={form.name}
              onChange={(v) => update("name", v)}
              placeholder="Họ và tên"
            />
            <Field label="Chức danh" hint="Hiển thị đúng như bạn nhập — không tự thêm chữ «at»">
              <IconInput
                icon={Briefcase}
                value={form.title}
                onChange={(v) => update("title", v)}
                placeholder="Fullstack Developer"
              />
            </Field>
            <Field label="Công ty / dòng phụ" hint="Tuỳ chọn. Có thể gõ «tại Kien's Space» nếu muốn">
              <IconInput
                icon={Briefcase}
                value={form.company}
                onChange={(v) => update("company", v)}
                placeholder="Kien's Space"
              />
            </Field>
            <IconInput
              icon={ImageIcon}
              value={form.photoUrl}
              onChange={(v) => update("photoUrl", v)}
              placeholder="URL ảnh đại diện (HTTPS)"
            />
            <IconInput
              icon={ImageIcon}
              value={form.logoUrl}
              onChange={(v) => update("logoUrl", v)}
              placeholder="URL logo (nếu không dùng ảnh đại diện)"
            />
          </Panel>

          <Panel icon={Phone} title="Liên hệ" desc="Email, điện thoại và website">
            <IconInput
              icon={Mail}
              type="email"
              value={form.email}
              onChange={(v) => update("email", v)}
              placeholder="email@example.com"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <IconInput
                icon={Phone}
                value={form.phone}
                onChange={(v) => update("phone", v)}
                placeholder="Điện thoại"
              />
              <IconInput
                icon={Smartphone}
                value={form.mobile}
                onChange={(v) => update("mobile", v)}
                placeholder="Di động"
              />
            </div>
            <IconInput
              icon={Globe}
              value={form.website}
              onChange={(v) => update("website", v)}
              placeholder="https://kienvu.id.vn"
            />
          </Panel>
        </div>

        {/* Column 2 — Social + Format */}
        <div className="space-y-4">
          <Panel icon={Share2} title="Mạng xã hội" desc="Icon thương hiệu — hiện dạng pill trong chữ ký">
            {SOCIAL_PLATFORM_FIELDS.map(({ key, placeholder, Icon }) => (
              <BrandInput
                key={key}
                icon={<Icon size={16} />}
                value={form[key]}
                onChange={(v) => update(key, v)}
                placeholder={placeholder}
              />
            ))}

            <div className="space-y-2 border-t border-border pt-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-ink">Link tuỳ chỉnh</p>
                <button
                  type="button"
                  onClick={addCustomLink}
                  className="inline-flex items-center gap-1 rounded-lg bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand transition hover:bg-brand/15"
                >
                  <Plus size={13} />
                  Thêm link
                </button>
              </div>

              {form.customLinks.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border bg-app/50 px-3 py-2.5 text-xs text-muted">
                  Chưa có link tuỳ chỉnh — bấm «Thêm link» để thêm portfolio, Behance, v.v.
                </p>
              ) : (
                form.customLinks.map((link) => (
                  <div key={link.id} className="flex gap-2">
                    <div className="relative min-w-0 flex-1">
                      <span className="pointer-events-none absolute left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center">
                        <CustomLinkBrandIcon size={15} />
                      </span>
                      <input
                        type="text"
                        className={inputClass}
                        value={link.label}
                        onChange={(e) => updateCustomLink(link.id, { label: e.target.value })}
                        placeholder="Nhãn (Portfolio, Behance…)"
                      />
                    </div>
                    <div className="relative min-w-0 flex-[1.4]">
                      <Globe
                        size={15}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        type="text"
                        className={inputClass}
                        value={link.url}
                        onChange={(e) => updateCustomLink(link.id, { url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCustomLink(link.id)}
                      title="Xóa link"
                      className="inline-flex shrink-0 items-center justify-center rounded-xl border border-border px-2.5 text-muted transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Panel>

          <Panel icon={Palette} title="Tuỳ chọn định dạng" desc="Màu sắc và font chữ">
            <div className="grid gap-3 sm:grid-cols-2">
              <ColorField
                label="Màu nhấn (viền)"
                value={form.accentColor}
                onChange={(v) => update("accentColor", v)}
              />
              <ColorField
                label="Màu chữ"
                value={form.textColor}
                onChange={(v) => update("textColor", v)}
              />
            </div>
            <ColorField
              label="Màu nền"
              value={form.backgroundColor}
              onChange={(v) => update("backgroundColor", v)}
            />
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted">Font chữ</span>
              <select
                className="w-full rounded-xl border border-border bg-app px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
                value={form.fontFamily}
                onChange={(e) =>
                  update("fontFamily", e.target.value as EmailSignatureForm["fontFamily"])
                }
              >
                {SIGNATURE_FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
          </Panel>

          <button
            type="button"
            onClick={() => setForm(DEFAULT_EMAIL_SIGNATURE_FORM)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface py-2.5 text-sm font-medium text-muted transition hover:border-brand/40 hover:text-ink"
          >
            <RefreshCw size={15} />
            Đặt lại mẫu mặc định
          </button>
        </div>

        {/* Column 3 — Install guide */}
        <div className="lg:col-span-2 xl:col-span-1 xl:row-span-1">
          <EmailSignatureInstallGuide />
        </div>
      </div>
    </div>
  );
}
