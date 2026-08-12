import { useMemo, useState } from "react";
import { Copy, KeyRound, Settings2, Sparkles } from "lucide-react";
import { copyText } from "../../utils/copyText";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SPECIAL = "!@#$%^&*()-_=+[]{}|;:,.<>?";

type Strength = "weak" | "medium" | "strong";

function pickRandomChar(pool: string): string {
  const index = crypto.getRandomValues(new Uint32Array(1))[0] % pool.length;
  return pool[index]!;
}

function shuffle(values: string[]): string[] {
  const arr = [...values];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

function generatePassword(
  length: number,
  opts: {
    upper: boolean;
    lower: boolean;
    numbers: boolean;
    special: boolean;
  },
): string {
  const pools: string[] = [];
  const required: string[] = [];

  if (opts.upper) {
    pools.push(UPPER);
    required.push(pickRandomChar(UPPER));
  }
  if (opts.lower) {
    pools.push(LOWER);
    required.push(pickRandomChar(LOWER));
  }
  if (opts.numbers) {
    pools.push(NUMBERS);
    required.push(pickRandomChar(NUMBERS));
  }
  if (opts.special) {
    pools.push(SPECIAL);
    required.push(pickRandomChar(SPECIAL));
  }

  if (pools.length === 0) return "";

  const all = pools.join("");
  const chars = [...required];

  while (chars.length < length) {
    chars.push(pickRandomChar(all));
  }

  return shuffle(chars).join("");
}

function getStrength(password: string, length: number): Strength {
  if (!password) return "weak";

  let score = 0;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (length >= 16) score += 1;

  if (score >= 4) return "strong";
  if (score >= 2) return "medium";
  return "weak";
}

const STRENGTH_LABEL: Record<Strength, string> = {
  weak: "Yếu",
  medium: "Trung bình",
  strong: "Mạnh",
};

const STRENGTH_STYLE: Record<Strength, string> = {
  weak: "bg-rose-50 text-rose-700 ring-rose-200",
  medium: "bg-amber-50 text-amber-700 ring-amber-200",
  strong: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [special, setSpecial] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const primaryPassword = passwords[0] ?? "";
  const strength = useMemo(
    () => getStrength(primaryPassword, length),
    [primaryPassword, length],
  );

  function handleGenerate() {
    if (!upper && !lower && !numbers && !special) {
      setError("Chọn ít nhất một loại ký tự.");
      setPasswords([]);
      return;
    }

    setError("");
    const next = Array.from({ length: quantity }, () =>
      generatePassword(length, { upper, lower, numbers, special }),
    );
    setPasswords(next);
  }

  async function handleCopy(text: string, index = 0) {
    const ok = await copyText(text);
    if (ok) {
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(null), 1500);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <section className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
          <Settings2 size={18} aria-hidden />
          Cài đặt
        </h2>

        <label className="mt-5 block text-sm font-medium text-ink">
          Độ dài mật khẩu: {length}
        </label>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-brand"
          />
          <input
            type="number"
            min={8}
            max={64}
            value={length}
            onChange={(e) =>
              setLength(Math.min(64, Math.max(8, Number(e.target.value) || 8)))
            }
            className="w-16 rounded-lg border border-border px-2 py-1 text-center text-sm"
          />
        </div>

        <fieldset className="mt-5 space-y-2">
          <legend className="text-sm font-medium text-ink">Loại ký tự</legend>
          <label className="flex items-center gap-2 text-sm text-body">
            <input
              type="checkbox"
              checked={upper}
              onChange={(e) => setUpper(e.target.checked)}
              className="accent-brand"
            />
            Chữ hoa (A-Z)
          </label>
          <label className="flex items-center gap-2 text-sm text-body">
            <input
              type="checkbox"
              checked={lower}
              onChange={(e) => setLower(e.target.checked)}
              className="accent-brand"
            />
            Chữ thường (a-z)
          </label>
          <label className="flex items-center gap-2 text-sm text-body">
            <input
              type="checkbox"
              checked={numbers}
              onChange={(e) => setNumbers(e.target.checked)}
              className="accent-brand"
            />
            Số (0-9)
          </label>
          <label className="flex items-center gap-2 text-sm text-body">
            <input
              type="checkbox"
              checked={special}
              onChange={(e) => setSpecial(e.target.checked)}
              className="accent-brand"
            />
            Ký tự đặc biệt (!@#$...)
          </label>
        </fieldset>

        <label className="mt-5 block text-sm font-medium text-ink">
          Số lượng mật khẩu
        </label>
        <input
          type="number"
          min={1}
          max={10}
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.min(10, Math.max(1, Number(e.target.value) || 1)))
          }
          className="mt-2 w-full rounded-xl border border-border bg-app px-3 py-2 text-sm"
        />

        <button
          type="button"
          onClick={handleGenerate}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
        >
          <Sparkles size={16} aria-hidden />
          Tạo mật khẩu
        </button>
        {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <KeyRound size={18} aria-hidden />
            Kết quả
          </h2>
          {primaryPassword ? (
            <button
              type="button"
              onClick={() => handleCopy(primaryPassword)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted transition hover:text-brand"
            >
              <Copy size={14} aria-hidden />
              Sao chép
            </button>
          ) : null}
        </div>

        {primaryPassword ? (
          <>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted">Độ mạnh mật khẩu</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STRENGTH_STYLE[strength]}`}
              >
                {STRENGTH_LABEL[strength]}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {passwords.map((password, index) => (
                <div key={`${password}-${index}`} className="relative">
                  <input
                    readOnly
                    value={password}
                    className="w-full rounded-xl border border-border bg-app px-3 py-3 pr-10 font-mono-ui text-sm text-ink"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(password, index)}
                    className="absolute top-2 right-2 rounded-lg p-1.5 text-muted transition hover:bg-hover hover:text-brand"
                    aria-label="Sao chép mật khẩu"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              ))}
            </div>

            {copiedIndex !== null ? (
              <p className="mt-2 text-sm text-emerald-600">Đã sao chép!</p>
            ) : null}
          </>
        ) : (
          <p className="mt-6 rounded-xl border border-dashed border-border bg-app px-4 py-10 text-center text-sm text-muted">
            Nhấn &quot;Tạo mật khẩu&quot; để sinh mật khẩu ngẫu nhiên.
          </p>
        )}
      </section>
    </div>
  );
}

export default PasswordGeneratorTool;
