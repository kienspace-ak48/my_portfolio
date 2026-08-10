const ARTICLE_IMAGE_MAX_WIDTH = 720;
const ARTICLE_IMAGE_DEFAULT_WIDTH = 560;

export type ArticleImageMeta = {
  alt?: string | null;
  title?: string | null;
  width?: number | null;
  height?: number | null;
};

function escapeAttr(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/** Cloudinary: giới hạn width + tối ưu format cho nội dung bài viết */
export function optimizeArticleImageUrl(url: string) {
  if (!url.includes("cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  if (/\/upload\/[^/]*w_\d+/.test(url)) {
    return url;
  }
  return url.replace(
    "/upload/",
    `/upload/w_${ARTICLE_IMAGE_MAX_WIDTH},c_limit,f_auto,q_auto/`,
  );
}

function initialDisplayWidth(meta?: ArticleImageMeta) {
  const nativeW = meta?.width ?? ARTICLE_IMAGE_DEFAULT_WIDTH;
  return Math.min(Math.max(nativeW, 120), ARTICLE_IMAGE_MAX_WIDTH);
}

/**
 * Chèn img thuần — TinyMCE có thể resize (kéo góc), căn trái/giữa/phải, mở dialog chỉnh.
 * Không bọc figure / không khóa inline width:100%.
 */
export function buildArticleImageHtml(
  url: string,
  meta?: ArticleImageMeta,
) {
  const alt = escapeAttr(meta?.alt ?? meta?.title ?? "");
  const src = optimizeArticleImageUrl(url);
  const width = initialDisplayWidth(meta);
  const nativeH = meta?.height ?? null;
  const nativeW = meta?.width ?? null;

  let heightAttr = "";
  if (nativeW && nativeH && nativeW > 0) {
    const scaledH = Math.round((width / nativeW) * nativeH);
    heightAttr = ` height="${scaledH}"`;
  }

  return `<img class="article-image" src="${src}" alt="${alt}" width="${width}"${heightAttr} />`;
}

export { ARTICLE_IMAGE_MAX_WIDTH, ARTICLE_IMAGE_DEFAULT_WIDTH };
