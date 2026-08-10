import { ChevronRight } from "lucide-react";
import type { NavItem } from "../../types/nav";
import PagePlaceholder from "./PagePlaceholder";

type MainContentProps = {
  activeItem?: NavItem;
};

const MainContent = ({ activeItem }: MainContentProps) => {
  return (
    <main className="min-h-screen pt-16 pb-20 md:pb-0 md:pl-16 lg:pl-64">
      <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <div className="font-mono-ui mb-4 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
          <span>kien's space</span>
          <ChevronRight size={12} />
          <span className="text-slate-600">{activeItem?.path}</span>
        </div>

        <h1 className="font-display mb-6 text-2xl font-extrabold text-slate-900">
          {activeItem?.label}
        </h1>

        <PagePlaceholder path={activeItem?.path} />
      </div>
    </main>
  );
};

export default MainContent;
