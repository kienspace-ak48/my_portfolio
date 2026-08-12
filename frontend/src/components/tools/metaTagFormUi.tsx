import type { ReactNode } from "react";
import { charStatus } from "../../utils/metaTagGenerator";
import type { OgType, TwitterCardType } from "../../utils/metaTagGenerator";

export type FormPlatform =
  | "common"
  | "google"
  | "facebook"
  | "x"
  | "zalo"
  | "linkedin"
  | "advanced";

export const FORM_PLATFORMS: { id: FormPlatform; label: string }[] = [
  { id: "common", label: "Chung" },
  { id: "google", label: "Google" },
  { id: "facebook", label: "Facebook" },
  { id: "x", label: "X" },
  { id: "zalo", label: "Zalo" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "advanced", label: "Nâng cao" },
];

export const OG_TYPES: OgType[] = ["website", "article", "product", "profile"];

export const TWITTER_CARDS: { value: TwitterCardType; label: string }[] = [
  { value: "summary", label: "Summary" },
  { value: "summary_large_image", label: "Large image" },
  { value: "app", label: "App" },
  { value: "player", label: "Player" },
];

export const inputClass =
  "w-full rounded-xl border border-border bg-app px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand";

export function CharCounter({
  value,
  good,
  max,
}: {
  value: string;
  good: number;
  max: number;
}) {
  const status = charStatus(value.length, good, max);
  const tone =
    status === "good"
      ? "text-emerald-600"
      : status === "warn"
        ? "text-amber-600"
        : "text-rose-600";

  return (
    <span className={`text-xs tabular-nums ${tone}`}>
      {value.length}/{max}
    </span>
  );
}

export function Field({
  label,
  hint,
  counter,
  children,
}: {
  label: string;
  hint?: string;
  counter?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-ink">{label}</span>
        {counter}
      </div>
      {children}
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </label>
  );
}

export function PlatformNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
      {children}
    </div>
  );
}
