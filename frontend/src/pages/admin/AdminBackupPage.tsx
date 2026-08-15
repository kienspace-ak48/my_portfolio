import { useCallback, useEffect, useState } from "react";
import {
  Database,
  Download,
  HardDrive,
  Loader2,
  RefreshCw,
  Sprout,
} from "lucide-react";
import {
  downloadBackupJson,
  downloadSavedBackup,
  getBackupStats,
  saveBackupOnServer,
  seedBlogDemo,
  type BackupStatsResponse,
} from "../../api/backup.api";
import { adminCardClass, adminSectionTitleClass } from "../../components/admin/adminFormStyles";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN");
}

export default function AdminBackupPage() {
  const [info, setInfo] = useState<BackupStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getBackupStats();
      setInfo(res.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được thông tin backup");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDownload() {
    try {
      setDownloading(true);
      setError(null);
      setMessage(null);
      await downloadBackupJson();
      setMessage("Đã tải file backup JSON về máy.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tải backup thất bại");
    } finally {
      setDownloading(false);
    }
  }

  async function handleSaveOnServer() {
    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      const res = await saveBackupOnServer();
      setMessage(`Đã lưu ${res.data.data.filename} trên server (${formatBytes(res.data.data.sizeBytes)}).`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu backup thất bại");
    } finally {
      setSaving(false);
    }
  }

  async function handleSeedBlog() {
    try {
      setSeeding(true);
      setError(null);
      setMessage(null);
      const res = await seedBlogDemo();
      setMessage(`Đã seed ${res.data.data.count} bài blog demo — mở /blog để test.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Seed blog thất bại");
    } finally {
      setSeeding(false);
    }
  }

  const stats = info?.stats;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Backup Database</h1>
        <p className="mt-1 text-sm text-slate-500">
          Xuất snapshot JSON thủ công — users, projects, blog, stories, gallery, SEO, resume.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Users", value: stats?.users },
          { label: "Projects", value: stats?.projects },
          { label: "Blog posts", value: stats?.blogPosts },
          { label: "Stories", value: stats?.stories },
        ].map((item) => (
          <div key={item.label} className={`${adminCardClass} p-4`}>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {item.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {loading ? "…" : (item.value ?? 0)}
            </p>
          </div>
        ))}
      </div>

      <section className={adminCardClass}>
        <div className="border-b border-[#E7E9EE] px-4 py-3 sm:px-5">
          <h2 className={adminSectionTitleClass}>Thao tác backup</h2>
        </div>
        <div className="flex flex-wrap gap-3 p-4 sm:p-5">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
          >
            {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Tải backup JSON
          </button>
          <button
            type="button"
            onClick={handleSaveOnServer}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E7E9EE] bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <HardDrive size={16} />}
            Lưu trên server
          </button>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E7E9EE] px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Làm mới
          </button>
        </div>
        <p className="border-t border-[#E7E9EE] px-4 py-3 text-xs text-slate-500 sm:px-5">
          File lưu server nằm trong <code className="rounded bg-slate-100 px-1">backend/backups/</code> (gitignore).
          CLI: <code className="rounded bg-slate-100 px-1">pnpm db:export</code> → commit{" "}
          <code className="rounded bg-slate-100 px-1">migration/data/db-export.json</code>
        </p>
      </section>

      <section className={adminCardClass}>
        <div className="border-b border-[#E7E9EE] px-4 py-3 sm:px-5">
          <h2 className={adminSectionTitleClass}>Seed blog demo</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            11 bài test: featured, draft, archived, ẩn, không cover, nhiều tag, TOC, popular sort…
          </p>
        </div>
        <div className="p-4 sm:p-5">
          <button
            type="button"
            onClick={handleSeedBlog}
            disabled={seeding}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {seeding ? <Loader2 size={16} className="animate-spin" /> : <Sprout size={16} />}
            Seed blog demo
          </button>
          <p className="mt-3 text-xs text-slate-500">
            Upsert theo slug — chạy lại an toàn. Cần có user ADMIN. CLI:{" "}
            <code className="rounded bg-slate-100 px-1">pnpm seed:blog</code>
          </p>
        </div>
      </section>

      <section className={adminCardClass}>
        <div className="border-b border-[#E7E9EE] px-4 py-3 sm:px-5">
          <h2 className={`${adminSectionTitleClass} flex items-center gap-2`}>
            <Database size={18} />
            Backup đã lưu trên server
          </h2>
        </div>
        {loading ? (
          <p className="p-5 text-sm text-slate-500">Đang tải…</p>
        ) : !info?.savedBackups?.length ? (
          <p className="p-5 text-sm text-slate-500">Chưa có file backup trên server.</p>
        ) : (
          <ul className="divide-y divide-[#E7E9EE]">
            {info.savedBackups.map((file) => (
              <li
                key={file.filename}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5"
              >
                <div>
                  <p className="font-mono text-sm text-slate-800">{file.filename}</p>
                  <p className="text-xs text-slate-500">
                    {formatDate(file.createdAt)} · {formatBytes(file.sizeBytes)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => downloadSavedBackup(file.filename)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E7E9EE] px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Download size={14} />
                  Tải
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
