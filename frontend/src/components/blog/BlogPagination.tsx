type BlogPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function BlogPagination({ page, totalPages, onPageChange }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="flex items-center justify-center gap-1 pt-4"
      aria-label="Phân trang blog"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-hover disabled:opacity-40"
      >
        Trước
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`min-w-[2.25rem] rounded-lg px-3 py-2 text-sm font-medium transition ${
            p === page
              ? "bg-ink text-white"
              : "text-muted hover:bg-hover hover:text-ink"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-hover disabled:opacity-40"
      >
        Sau
      </button>
    </nav>
  );
}

export default BlogPagination;
