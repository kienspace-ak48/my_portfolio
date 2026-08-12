import { useMemo, useState } from "react";
import { Copy, Lock, Trash2 } from "lucide-react";
import { copyText } from "../../utils/copyText";

function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function decodeBase64(text: string): string {
  const binary = atob(text.trim());
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function Base64Tool() {
  const [encodeInput, setEncodeInput] = useState("");
  const [decodeInput, setDecodeInput] = useState("");
  const { value: encoded, error: encodeError } = useMemo(() => {
    if (!encodeInput) return { value: "", error: "" };
    try {
      return { value: encodeBase64(encodeInput), error: "" };
    } catch {
      return { value: "", error: "Không thể mã hóa văn bản này." };
    }
  }, [encodeInput]);

  const { value: decoded, error: decodeError } = useMemo(() => {
    if (!decodeInput.trim()) return { value: "", error: "" };
    try {
      return { value: decodeBase64(decodeInput), error: "" };
    } catch {
      return { value: "", error: "Chuỗi Base64 không hợp lệ." };
    }
  }, [decodeInput]);

  const [copiedField, setCopiedField] = useState<"encode" | "decode" | null>(
    null,
  );

  async function handleCopy(field: "encode" | "decode", value: string) {
    const ok = await copyText(value);
    if (ok) {
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 1500);
    }
  }

  function clearAll() {
    setEncodeInput("");
    setDecodeInput("");
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <Lock size={18} aria-hidden />
            Mã hóa sang Base64
          </h2>
          <label className="mt-4 block text-sm font-medium text-ink">
            Đầu vào
          </label>
          <textarea
            value={encodeInput}
            onChange={(e) => setEncodeInput(e.target.value)}
            placeholder="Nhập văn bản để mã hóa sang Base64..."
            rows={6}
            className="mt-2 w-full rounded-xl border border-border bg-app px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand"
          />
          <label className="mt-4 block text-sm font-medium text-ink">
            Kết quả
          </label>
          <div className="relative mt-2">
            <textarea
              readOnly
              value={encoded}
              placeholder="Kết quả mã hóa sẽ hiển thị ở đây..."
              rows={4}
              className="w-full rounded-xl border border-border bg-white px-3 py-2.5 pr-10 text-sm text-ink"
            />
            <button
              type="button"
              onClick={() => handleCopy("encode", encoded)}
              disabled={!encoded}
              className="absolute top-2 right-2 rounded-lg p-1.5 text-muted transition hover:bg-hover hover:text-brand disabled:opacity-40"
              aria-label="Sao chép kết quả mã hóa"
            >
              <Copy size={16} />
            </button>
          </div>
          {encodeError ? (
            <p className="mt-2 text-sm text-danger">{encodeError}</p>
          ) : null}
          {copiedField === "encode" ? (
            <p className="mt-2 text-sm text-emerald-600">Đã sao chép!</p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <Lock size={18} aria-hidden />
            Giải mã từ Base64
          </h2>
          <label className="mt-4 block text-sm font-medium text-ink">
            Đầu vào
          </label>
          <textarea
            value={decodeInput}
            onChange={(e) => setDecodeInput(e.target.value)}
            placeholder="Nhập chuỗi Base64 để giải mã..."
            rows={6}
            className="mt-2 w-full rounded-xl border border-border bg-app px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand"
          />
          <label className="mt-4 block text-sm font-medium text-ink">
            Kết quả
          </label>
          <div className="relative mt-2">
            <textarea
              readOnly
              value={decoded}
              placeholder="Kết quả giải mã sẽ hiển thị ở đây..."
              rows={4}
              className="w-full rounded-xl border border-border bg-white px-3 py-2.5 pr-10 text-sm text-ink"
            />
            <button
              type="button"
              onClick={() => handleCopy("decode", decoded)}
              disabled={!decoded}
              className="absolute top-2 right-2 rounded-lg p-1.5 text-muted transition hover:bg-hover hover:text-brand disabled:opacity-40"
              aria-label="Sao chép kết quả giải mã"
            >
              <Copy size={16} />
            </button>
          </div>
          {decodeError ? (
            <p className="mt-2 text-sm text-danger">{decodeError}</p>
          ) : null}
          {copiedField === "decode" ? (
            <p className="mt-2 text-sm text-emerald-600">Đã sao chép!</p>
          ) : null}
        </section>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-muted transition hover:border-border-strong hover:text-ink"
        >
          <Trash2 size={16} aria-hidden />
          Xóa
        </button>
      </div>
    </div>
  );
}

export default Base64Tool;
