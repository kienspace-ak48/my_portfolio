import { useCallback, useEffect, useState } from "react";
import { Copy, Globe, MapPin, RefreshCw } from "lucide-react";
import { InlineLoading } from "../LoadingKit";
import { copyText } from "../../utils/copyText";

type IpInfo = {
  ip: string;
  isp?: string;
  asn?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  region?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
};

type IpWhoResponse = {
  success?: boolean;
  ip?: string;
  connection?: {
    isp?: string;
    asn?: number;
  };
  country?: string;
  country_code?: string;
  city?: string;
  region?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  message?: string;
};

function InfoRow({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-b-0">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-subtle">
          {label}
        </p>
        <p className="mt-1 text-sm font-medium text-ink">{value || "—"}</p>
      </div>
      {onCopy && value ? (
        <button
          type="button"
          onClick={onCopy}
          className="rounded-lg p-2 text-muted transition hover:bg-hover hover:text-brand"
          aria-label={`Sao chép ${label}`}
        >
          <Copy size={16} />
        </button>
      ) : null}
    </div>
  );
}

function IpLookupTool() {
  const [info, setInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchIp = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("https://ipwho.is/");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as IpWhoResponse;
      if (!json.success) {
        throw new Error(json.message ?? "Không lấy được thông tin IP");
      }

      setInfo({
        ip: json.ip ?? "",
        isp: json.connection?.isp,
        asn: json.connection?.asn ? String(json.connection.asn) : undefined,
        country: json.country,
        countryCode: json.country_code,
        city: json.city,
        region: json.region,
        postal: json.postal,
        latitude: json.latitude,
        longitude: json.longitude,
      });
    } catch (err) {
      setInfo(null);
      setError(
        err instanceof Error
          ? err.message
          : "Không thể tra cứu IP. Thử lại sau.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIp();
  }, [fetchIp]);

  async function handleCopyIp() {
    if (!info?.ip) return;
    const ok = await copyText(info.ip);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-border bg-surface">
        <InlineLoading message="Đang tra cứu IP..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-8 text-center">
        <p className="font-medium text-amber-900">{error}</p>
        <button
          type="button"
          onClick={fetchIp}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover"
        >
          <RefreshCw size={16} aria-hidden />
          Thử lại
        </button>
      </div>
    );
  }

  if (!info) return null;

  const coords =
    info.latitude != null && info.longitude != null
      ? `${info.latitude}, ${info.longitude}`
      : "";

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Globe size={20} className="text-brand" aria-hidden />
            <h2 className="text-lg font-bold text-ink">Địa chỉ IP của bạn</h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopyIp}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted transition hover:text-brand"
            >
              <Copy size={14} aria-hidden />
              Sao chép
            </button>
            <button
              type="button"
              onClick={fetchIp}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted transition hover:text-brand"
            >
              <RefreshCw size={14} aria-hidden />
              Làm mới
            </button>
          </div>
        </div>

        <p className="mt-6 break-all text-3xl font-extrabold tracking-tight text-brand sm:text-4xl">
          {info.ip}
        </p>
        {copied ? (
          <p className="mt-2 text-sm text-emerald-600">Đã sao chép IP!</p>
        ) : null}

        <div className="mt-4 space-y-1 text-sm text-muted">
          {info.isp ? <p>Nhà cung cấp dịch vụ: {info.isp}</p> : null}
          {info.asn ? <p>ASN: {info.asn}</p> : null}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="mb-2 flex items-center gap-2">
          <MapPin size={20} className="text-brand" aria-hidden />
          <h2 className="text-lg font-bold text-ink">Thông tin vị trí</h2>
        </div>

        <InfoRow
          label="Quốc gia"
          value={
            info.countryCode
              ? `${info.country ?? ""} (${info.countryCode})`.trim()
              : (info.country ?? "")
          }
          onCopy={() =>
            copyText(
              info.countryCode
                ? `${info.country ?? ""} (${info.countryCode})`.trim()
                : (info.country ?? ""),
            )
          }
        />
        <InfoRow
          label="Thành phố"
          value={info.city ?? ""}
          onCopy={() => copyText(info.city ?? "")}
        />
        <InfoRow
          label="Khu vực"
          value={info.region ?? ""}
          onCopy={() => copyText(info.region ?? "")}
        />
        <InfoRow
          label="Mã bưu điện"
          value={info.postal ?? ""}
          onCopy={() => copyText(info.postal ?? "")}
        />
        <InfoRow
          label="Tọa độ"
          value={coords}
          onCopy={() => copyText(coords)}
        />
      </section>

      <p className="text-sm text-muted">
        Thông tin vị trí được ước lượng từ dịch vụ tra cứu IP bên thứ ba và có
        thể không chính xác 100%.
      </p>
    </div>
  );
}

export default IpLookupTool;
