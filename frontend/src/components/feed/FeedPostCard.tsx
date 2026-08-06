import type { FeedPost } from "../../types/newsFeed";
import { formatFeedDate } from "../../data/newsFeed";

type FeedPostCardProps = {
  post: FeedPost;
};

function FeedPostCard({ post }: FeedPostCardProps) {
  return (
    <article className="overflow-hidden rounded-xl bg-white">
      <header className="flex items-start gap-3 px-5 pt-5">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="h-11 w-11 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold text-slate-900">
            {post.author.name}
          </h3>
          <p className="text-sm text-slate-500">
            {post.author.category} · {formatFeedDate(post.publishedAt)}
          </p>
        </div>
      </header>

      <div className="space-y-4 px-5 py-4">
        <h2 className="text-xl font-bold leading-snug text-slate-900">
          {post.title}
        </h2>

        <p className="text-[15px] leading-7 text-slate-700">{post.excerpt}</p>

        {post.bullets && post.bullets.length > 0 && (
          <ul className="space-y-1.5 text-[15px] leading-7 text-slate-700">
            {post.bullets.map((item) => (
              <li key={item.label} className="flex gap-2">
                <span className="text-slate-400">•</span>
                <a
                  href={item.href}
                  className="text-orange-600 hover:text-orange-700 hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="px-5 pb-5">
        <img
          src={post.imageUrl}
          alt={post.imageAlt ?? post.title}
          className="w-full rounded-lg object-cover"
        />
      </div>

      <div className="px-5 pb-5">
        <a
          href={post.cta.href}
          className="inline-flex w-full items-center justify-center rounded-md bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          {post.cta.label}
        </a>
      </div>
    </article>
  );
}

export default FeedPostCard;
