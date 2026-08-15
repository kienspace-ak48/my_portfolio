import { Construction } from "lucide-react";
import { Link } from "react-router-dom";
import { feedPosts, feedPromos } from "../data/newsFeed";
import FeedPostCard from "./feed/FeedPostCard";
import FeedSidebar from "./feed/FeedSidebar";

function NewsFeed() {
  return (
    <section className="w-full">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Bảng tin</h1>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
          <Construction size={14} aria-hidden />
          Đang phát triển
        </span>
      </div>

      <div
        className="mb-6 rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm text-amber-950"
        role="status"
      >
        <p className="font-medium">Tính năng bảng tin chưa sẵn sàng</p>
        <p className="mt-1 text-amber-900/80">
          Nội dung bên dưới chỉ là demo giao diện. Bài viết chính thức xem tại{" "}
          <Link to="/blog" className="font-semibold text-amber-900 underline-offset-2 hover:underline">
            Blog
          </Link>
          .
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)] lg:gap-8 xl:gap-10">
        <div className="min-w-0 space-y-5">
          {feedPosts.map((post) => (
            <FeedPostCard key={post.id} post={post} />
          ))}
        </div>

        <aside className="relative hidden lg:block">
          <div className="sticky top-[4.5rem] z-10 max-h-[calc(100vh-4.5rem)] overflow-y-auto overscroll-contain [scrollbar-width:thin]">
            <FeedSidebar promos={feedPromos} />
          </div>
        </aside>
      </div>
    </section>
  );
}

export default NewsFeed;
