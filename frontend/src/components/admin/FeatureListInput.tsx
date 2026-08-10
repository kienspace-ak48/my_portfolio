import { Plus, Trash2 } from "lucide-react";
import { adminInputClass } from "./adminFormStyles";

type FeatureListInputProps = {
  value: string[];
  onChange: (features: string[]) => void;
};

function FeatureListInput({ value, onChange }: FeatureListInputProps) {
  function updateItem(index: number, text: string) {
    const next = [...value];
    next[index] = text;
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...value, ""]);
  }

  if (value.length === 0) {
    return (
      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#E7E9EE] px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-amber-300 hover:bg-amber-50/50 hover:text-amber-700"
      >
        <Plus size={14} />
        Thêm tính năng
      </button>
    );
  }

  return (
    <div className="space-y-2">
      {value.map((feature, index) => (
        <div key={index} className="flex gap-2">
          <input
            value={feature}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={`Tính năng ${index + 1}`}
            className={adminInputClass}
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="shrink-0 rounded-lg border border-[#E7E9EE] p-2 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            aria-label="Xóa tính năng"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800"
      >
        <Plus size={14} />
        Thêm dòng
      </button>
    </div>
  );
}

export default FeatureListInput;
