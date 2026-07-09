import { Code2 } from "lucide-react";

type PagePlaceholderProps = {
  path?: string;
};

const PagePlaceholder = ({ path }: PagePlaceholderProps) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 text-center">
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
      <Code2 size={20} className="text-slate-400" />
    </div>
    <p className="font-medium text-slate-600">
      Nội dung của trang sẽ hiển thị ở đây
    </p>
    <p className="font-mono-ui mt-1 text-xs text-slate-400">{path}/index</p>
  </div>
);

export default PagePlaceholder;
