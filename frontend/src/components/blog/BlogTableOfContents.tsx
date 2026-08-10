import type { ContentBlock } from "../../types/blog";
import { getHeadings } from "../../utils/blogUtils";

type BlogTableOfContentsProps = {
  content: ContentBlock[];
};

function BlogTableOfContents({ content }: BlogTableOfContentsProps) {
  const headings = getHeadings(content);

  if (headings.length === 0) return null;

  return (
    <nav
      className="rounded-2xl border border-border bg-surface p-4"
      aria-label="Mục lục bài viết"
    >
      <p className="text-[11px] font-bold uppercase tracking-wide text-subtle">
        Mục lục
      </p>
      <ul className="mt-3 space-y-2">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className="block text-sm text-muted transition hover:text-brand"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default BlogTableOfContents;
