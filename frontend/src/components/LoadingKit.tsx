/**
 * =============================================================================
 * CHERRY HOUSE — LOADING KIT (PORTABLE, 1 FILE)
 * =============================================================================
 *
 * Nguồn gốc: cherry_house/frontend
 *   - components/booking/BookingLoading.jsx
 *   - components/RouteTransitionLoading.jsx
 *   - lib/loadingDelay.js
 *   - index.css (.app-loading-ring)
 *
 * CÁCH DÙNG TRONG PROJECT MỚI (React + Tailwind + react-router-dom):
 *
 * 1. Copy file này vào:  src/components/LoadingKit.jsx
 *
 * 2. Trong root layout (vd. MainLayout), thêm overlay đổi trang:
 *
 *      import { RouteTransitionLoading, LoadingKitStyles } from './components/LoadingKit';
 *
 *      function MainLayout() {
 *        return (
 *          <>
 *            <LoadingKitStyles />
 *            <RouteTransitionLoading />
 *            <Outlet />
 *          </>
 *        );
 *      }
 *
 * 3. Trang đang fetch API:
 *
 *      import { PageLoading } from './components/LoadingKit';
 *      if (loading) return <PageLoading title="Đang tải" message="Đang tải dữ liệu…" />;
 *
 * 4. Loading inline (form, list):
 *
 *      import { InlineLoading } from './components/LoadingKit';
 *      <InlineLoading message="Đang cập nhật…" />
 *
 * 5. Spinner thuần:
 *
 *      import { LoadingRing } from './components/LoadingKit';
 *      <LoadingRing size="sm" />
 *
 * YÊU CẦU TAILWIND / THEME (map nếu project khác tên token):
 *   - primary          → màu brand (spinner, chấm pulse)
 *   - bg-surface       → nền trang
 *   - text-on-surface, text-on-surface-variant
 *   - font-headline    → font tiêu đề (hoặc thay bằng font-sans)
 *
 * Nếu chưa có @theme, spinner vẫn chạy nhờ CSS var(--loading-kit-primary, #7f1d1d).
 *
 * KHÔNG CẦN npm package (react-spinners, nprogress, …).
 *
 * Export alias (tương thích tên cũ Cherry House):
 *   PageLoading = BookingPageLoading
 *   InlineLoading = BookingInlineLoading
 * =============================================================================
 */

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/** Container layout — chỉnh max-width/padding cho khớp project mới */
export const LOADING_LAYOUT_CONTAINER =
  "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12";

/** Delay tối thiểu overlay khi đổi pathname (ms) */
export const MIN_ROUTE_TRANSITION_MS = 480;

export type LoadingRingSize = "sm" | "md" | "lg";
export type PageLoadingVariant = "full" | "embedded";

export type LoadingRingProps = {
  size?: LoadingRingSize;
  className?: string;
};

export type PageLoadingProps = {
  message?: string;
  title?: string;
  variant?: PageLoadingVariant;
  layoutClassName?: string;
};

export type InlineLoadingProps = {
  message?: string;
};

export type RouteTransitionLoadingProps = {
  title?: string;
  message?: string;
  minMs?: number;
};

export type ContentSkeletonProps = {
  layoutClassName?: string;
};

export function getRouteTransitionMinMs(): number {
  if (typeof window === "undefined") return 0;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
  return MIN_ROUTE_TRANSITION_MS;
}

export function awaitMinDelay(
  startedAt: number,
  minMs: number = getRouteTransitionMinMs(),
): Promise<void> {
  const remaining = minMs - (Date.now() - startedAt);
  if (remaining <= 0) return Promise.resolve();
  return new Promise((resolve) => {
    window.setTimeout(resolve, remaining);
  });
}

/** Inject CSS spinner — gọi một lần trong layout root */
export function LoadingKitStyles() {
  return (
    <style>{`
      @keyframes loading-kit-spin {
        to { transform: rotate(360deg); }
      }
      .loading-kit-ring {
        border-radius: 9999px;
        border-style: solid;
        border-color: color-mix(in srgb, var(--loading-kit-primary, var(--color-primary, #7f1d1d)) 14%, transparent);
        border-top-color: var(--loading-kit-primary, var(--color-primary, #7f1d1d));
        animation: loading-kit-spin 0.85s linear infinite;
      }
      .loading-kit-ring--lg {
        width: 4rem;
        height: 4rem;
        border-width: 4px;
      }
      .loading-kit-ring--md {
        width: 2.75rem;
        height: 2.75rem;
        border-width: 3px;
      }
      .loading-kit-ring--sm {
        width: 1.25rem;
        height: 1.25rem;
        border-width: 2px;
      }
      .loading-kit-ring--reverse {
        border-color: color-mix(in srgb, var(--loading-kit-primary, var(--color-primary, #7f1d1d)) 10%, transparent);
        border-bottom-color: color-mix(in srgb, var(--loading-kit-primary, var(--color-primary, #7f1d1d)) 55%, transparent);
        border-top-color: transparent;
        animation-direction: reverse;
        animation-duration: 1.15s;
      }
      @media (prefers-reduced-motion: reduce) {
        .loading-kit-ring { animation-duration: 1.6s; }
      }
    `}</style>
  );
}

export function LoadingRing({ size = "lg", className = "" }: LoadingRingProps) {
  const sizeClass =
    size === "sm"
      ? "loading-kit-ring--sm"
      : size === "md"
        ? "loading-kit-ring--md"
        : "loading-kit-ring--lg";

  return (
    <div
      className={["relative inline-flex items-center justify-center", className].join(
        " ",
      )}
    >
      <div className={["loading-kit-ring", sizeClass].join(" ")} aria-hidden />
      {size === "lg" ? (
        <div
          className="loading-kit-ring loading-kit-ring--md loading-kit-ring--reverse absolute"
          aria-hidden
        />
      ) : null}
    </div>
  );
}

export function PageLoading({
  message = "Đang tải dữ liệu…",
  title = "Đang tải",
  variant = "full",
  layoutClassName = LOADING_LAYOUT_CONTAINER,
}: PageLoadingProps) {
  const wrapClass =
    variant === "embedded"
      ? "flex min-h-[min(50vh,400px)] items-center justify-center py-10"
      : [
          layoutClassName,
          "flex min-h-[min(68vh,520px)] items-center justify-center pt-24 pb-16",
        ].join(" ");

  return (
    <div className={wrapClass}>
      <div
        className="flex w-full max-w-sm flex-col items-center rounded-3xl border border-black/5 bg-white px-8 py-14 text-center shadow-lg shadow-primary/5"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <LoadingRing size="lg" />
        <p className="mt-8 font-headline text-lg font-bold text-on-surface">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{message}</p>
        <div className="mt-6 flex items-center gap-1.5" aria-hidden>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/70" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/50 [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/30 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

export function InlineLoading({ message = "Đang tải…" }: InlineLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-3 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-on-surface-variant"
    >
      <LoadingRing size="sm" />
      <span>{message}</span>
    </div>
  );
}

export function RouteTransitionLoading({
  title = "Đang tải",
  message = "Vui lòng đợi trong giây lát…",
  minMs = MIN_ROUTE_TRANSITION_MS,
}: RouteTransitionLoadingProps) {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const prevPathRef = useRef(pathname);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevPathRef.current = pathname;
      return undefined;
    }

    if (prevPathRef.current === pathname) return undefined;
    prevPathRef.current = pathname;

    let cancelled = false;
    const shownAt = Date.now();
    setVisible(true);

    void (async () => {
      const effectiveMin =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : minMs;
      await awaitMinDelay(shownAt, effectiveMin);
      if (!cancelled) setVisible(false);
    })();

    return () => {
      cancelled = true;
      setVisible(false);
    };
  }, [pathname, minMs]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[98] flex items-center justify-center bg-surface/80 px-4 backdrop-blur-[3px]"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Đang chuyển trang"
    >
      <div className="flex max-w-xs flex-col items-center rounded-3xl border border-black/5 bg-white px-8 py-10 text-center shadow-xl shadow-primary/10">
        <LoadingRing size="lg" />
        <p className="mt-6 font-headline text-base font-bold text-on-surface">{title}</p>
        <p className="mt-1.5 text-sm text-on-surface-variant">{message}</p>
      </div>
    </div>
  );
}

export function ContentSkeleton({
  layoutClassName = LOADING_LAYOUT_CONTAINER,
}: ContentSkeletonProps) {
  return (
    <div className={[layoutClassName, "animate-pulse pt-24 pb-28"].join(" ")}>
      <div className="mb-8 h-80 rounded-3xl bg-surface-container" />
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <div className="h-8 w-2/3 rounded-lg bg-surface-container" />
          <div className="h-4 w-full rounded bg-surface-container" />
          <div className="h-4 w-5/6 rounded bg-surface-container" />
        </div>
        <div className="h-96 rounded-2xl bg-surface-container" />
      </div>
    </div>
  );
}

export const BookingPageLoading = PageLoading;
export const BookingInlineLoading = InlineLoading;

const LoadingKit = {
  LoadingKitStyles,
  LoadingRing,
  PageLoading,
  InlineLoading,
  RouteTransitionLoading,
  ContentSkeleton,
  awaitMinDelay,
  LOADING_LAYOUT_CONTAINER,
} as const;

export default LoadingKit;
