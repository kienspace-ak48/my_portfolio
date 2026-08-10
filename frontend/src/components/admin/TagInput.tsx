import { X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
};

function TagInput({ value, onChange, suggestions = [] }: TagInputProps) {
  const [input, setInput] = useState("");

  function addTag(raw: string) {
    const tag = raw.trim();
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
    setInput("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  const unusedSuggestions = suggestions.filter((s) => !value.includes(s));

  return (
    <div className="space-y-2">
      <div className="flex min-h-[42px] flex-wrap gap-1.5 rounded-lg border border-[#E7E9EE] bg-[#F8F9FB] px-2 py-1.5">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-[#E7E9EE]"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              className="text-slate-400 hover:text-red-500"
              aria-label={`Xóa tag ${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => addTag(input)}
          placeholder={value.length ? "Thêm tag..." : "React, Node.js..."}
          className="min-w-[120px] flex-1 border-0 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-slate-400"
        />
      </div>
      {unusedSuggestions.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {unusedSuggestions.slice(0, 6).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="rounded-md bg-[#F3F4F6] px-2 py-0.5 text-[11px] font-medium text-slate-600 transition hover:bg-amber-50 hover:text-amber-700"
            >
              + {tag}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default TagInput;
