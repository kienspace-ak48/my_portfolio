import type { ReactNode } from "react";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "../layout/Breadcrumbs";
import ToolNotice from "./ToolNotice";

type ToolPageShellProps = {
  title: string;
  description: string;
  breadcrumbLabel: string;
  clientSide?: boolean;
  children: ReactNode;
};

function ToolPageShell({
  title,
  description,
  breadcrumbLabel,
  clientSide,
  children,
}: ToolPageShellProps) {
  const crumbs: BreadcrumbItem[] = [
    { label: "Công cụ miễn phí", to: "/tools" },
    { label: breadcrumbLabel },
  ];

  return (
    <div className="pb-8">
      <Breadcrumbs items={crumbs} />

      <header className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-muted">
          {description}
        </p>
      </header>

      {clientSide ? (
        <ToolNotice>
          Quá trình xử lý được thực hiện hoàn toàn trên trình duyệt của bạn.
          Dữ liệu không được gửi lên máy chủ và không được lưu trữ.
        </ToolNotice>
      ) : null}

      {children}
    </div>
  );
}

export default ToolPageShell;
