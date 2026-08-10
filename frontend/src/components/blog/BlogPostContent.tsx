import type { ContentBlock } from "../../types/blog";

function BlogPostContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="blog-prose space-y-5">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={index}
                className="text-base leading-[1.85] text-body sm:text-[17px]"
              >
                {block.text}
              </p>
            );

          case "heading":
            if (block.level === 2) {
              return (
                <h2
                  key={block.id}
                  id={block.id}
                  className="scroll-mt-28 pt-4 text-xl font-bold tracking-tight text-ink sm:text-2xl"
                >
                  {block.text}
                </h2>
              );
            }
            return (
              <h3
                key={block.id}
                id={block.id}
                className="scroll-mt-28 pt-2 text-lg font-bold text-ink"
              >
                {block.text}
              </h3>
            );

          case "code":
            return (
              <pre
                key={index}
                className="overflow-x-auto rounded-xl border border-border bg-[#101322] p-4 text-sm leading-relaxed text-slate-100"
              >
                <code>{block.code}</code>
              </pre>
            );

          case "quote":
            return (
              <blockquote
                key={index}
                className="border-l-4 border-brand pl-5 italic text-body"
              >
                <p className="text-base leading-relaxed">{block.text}</p>
                {block.cite ? (
                  <footer className="mt-2 text-sm not-italic text-muted">
                    — {block.cite}
                  </footer>
                ) : null}
              </blockquote>
            );

          case "list":
            if (block.ordered) {
              return (
                <ol
                  key={index}
                  className="list-decimal space-y-2 pl-5 text-base leading-relaxed text-body"
                >
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              );
            }
            return (
              <ul
                key={index}
                className="list-disc space-y-2 pl-5 text-base leading-relaxed text-body"
              >
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );

          case "callout": {
            const styles = {
              tip: "border-emerald-200 bg-emerald-50 text-emerald-900",
              note: "border-blue-200 bg-blue-50 text-blue-900",
              warning: "border-amber-200 bg-amber-50 text-amber-900",
            };
            return (
              <div
                key={index}
                className={`rounded-xl border px-4 py-3.5 sm:px-5 ${styles[block.variant]}`}
              >
                {block.title ? (
                  <p className="text-sm font-bold">{block.title}</p>
                ) : null}
                <p className="mt-1 text-sm leading-relaxed">{block.text}</p>
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}

export default BlogPostContent;
