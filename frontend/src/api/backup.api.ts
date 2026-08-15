import adminApi from "./axios";

export type BackupStats = {
  users: number;
  tags: number;
  projects: number;
  blogPosts: number;
  stories: number;
  galleryAssets: number;
  seoPageTemplates: number;
};

export type SavedBackupFile = {
  filename: string;
  sizeBytes: number;
  createdAt: string;
};

export type BackupStatsResponse = {
  stats: BackupStats;
  savedBackups: SavedBackupFile[];
  backupsDir: string;
};

export const getBackupStats = () =>
  adminApi.get<{ success: boolean; data: BackupStatsResponse }>("/admin/backup/stats");

export const saveBackupOnServer = () =>
  adminApi.post<{ success: boolean; data: { filename: string; sizeBytes: number; exportedAt: string; counts: BackupStats } }>(
    "/admin/backup/save",
  );

export const seedBlogDemo = () =>
  adminApi.post<{ success: boolean; data: { count: number; posts: { slug: string; id: string; title: string }[] } }>(
    "/admin/backup/seed-blog-demo",
  );

export async function downloadBackupJson(): Promise<void> {
  const response = await adminApi.get("/admin/backup/export", {
    responseType: "blob",
  });

  const disposition = response.headers["content-disposition"] as string | undefined;
  const match = disposition?.match(/filename="([^"]+)"/);
  const filename = match?.[1] ?? `backup-${Date.now()}.json`;

  const url = URL.createObjectURL(response.data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function downloadSavedBackup(filename: string): Promise<void> {
  const response = await adminApi.get(`/admin/backup/files/${encodeURIComponent(filename)}`, {
    responseType: "blob",
  });

  const url = URL.createObjectURL(response.data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
