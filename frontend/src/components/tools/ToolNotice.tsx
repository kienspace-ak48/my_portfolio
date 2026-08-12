import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

type ToolNoticeProps = {
  children: ReactNode;
};

function ToolNotice({ children }: ToolNoticeProps) {
  return (
    <div className="mb-6 flex gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
      <ShieldCheck size={18} className="mt-0.5 shrink-0 text-sky-600" aria-hidden />
      <p>{children}</p>
    </div>
  );
}

export default ToolNotice;
