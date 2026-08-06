import { Loader2 } from "lucide-react";
import type { Project } from "../../types/project";

interface Props {
  project: Pick<Project, "id" | "title"> | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({
  project,
  deleting,
  onCancel,
  onConfirm,
}: Props) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl p-6">

        <h2 className="text-lg font-semibold">
          Xóa dự án
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Bạn có chắc chắn muốn xóa
          <span className="font-semibold text-gray-700">
            {" "}
            {project.title}
          </span>
          ?
        </p>

        <div className="mt-6 flex justify-end gap-2">

          <button
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
          >
            Hủy
          </button>

          <button
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
            {deleting ? "Đang xóa..." : "Xóa"}
          </button>

        </div>

      </div>
    </div>
  );
}