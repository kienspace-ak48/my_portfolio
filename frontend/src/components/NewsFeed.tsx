import { feedPosts, feedPromos } from "../data/newsFeed";
import FeedPostCard from "./feed/FeedPostCard";
import FeedSidebar from "./feed/FeedSidebar";

function NewsFeed() {
  return (
    <section className="w-full">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Bảng tin</h1>

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
