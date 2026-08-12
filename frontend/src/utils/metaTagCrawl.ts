import { BASE_API } from "../api/fetchApi";
import type { MetaTagForm } from "./metaTagGenerator";

export type CrawlMetaResult = {
  requestedUrl: string;
  finalUrl: string;
  statusCode: number;
  parsed: Partial<Record<keyof MetaTagForm, string>>;
  foundTags: { tag: string; value: string }[];
};

export function normalizeCrawlUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, "")}`;
}

export async function crawlMetaFromUrl(url: string): Promise<CrawlMetaResult> {
  const normalized = normalizeCrawlUrl(url);
  if (!normalized) {
    throw new Error("Nhập URL website cần phân tích.");
  }

  const endpoint = `${BASE_API}/tools/meta-crawl?url=${encodeURIComponent(normalized)}`;
  let res: Response;
  try {
    res = await fetch(endpoint);
  } catch {
    throw new Error(
      "Không kết nối được backend. Chạy server backend (pnpm dev trong thư mục backend).",
    );
  }

  const json = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
    data?: CrawlMetaResult;
  };

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message ?? `HTTP ${res.status}`);
  }

  return json.data;
}
