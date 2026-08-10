function BlogNewsletter() {
  return (
    <div className="rounded-2xl border border-brand-border bg-gradient-to-br from-brand-soft to-surface p-5">
      <h3 className="text-sm font-bold text-ink">Nhận bài mới qua email</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">
        ~1 email/tuần — technical note ngắn, không spam. (UI demo — chưa kết nối backend)
      </p>
      <form
        className="mt-4 space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          type="email"
          placeholder="email@cua-ban.com"
          className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
}

export default BlogNewsletter;
