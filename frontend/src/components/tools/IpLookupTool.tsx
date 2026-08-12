import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Copy,
  ExternalLink,
  Globe,
  LocateFixed,
  MapPin,
  RefreshCw,
} from "lucide-react";
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

function buildMapLinks(latitude: number, longitude: number) {
  const coords = `${latitude},${longitude}`;
  const label = encodeURIComponent(coords);

  return {
    googleMaps: `https://www.google.com/maps/search/?api=1&query=${label}`,
    openStreetMap: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=14/${latitude}/${longitude}`,
  };
}

function buildMapEmbedUrl(
  latitude: number,
  longitude: number,
  zoom: "overview" | "location",
) {
  const delta = zoom === "location" ? 0.012 : 0.07;
  const bbox = [
    longitude - delta,
    latitude - delta,
    longitude + delta,
    latitude + delta,
  ].join(",");

  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

function IpLocationMap({
  latitude,
  longitude,
  city,
  region,
  country,
}: {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country?: string;
}) {
  const links = useMemo(
    () => buildMapLinks(latitude, longitude),
    [latitude, longitude],
  );
  const [mapZoom, setMapZoom] = useState<"overview" | "location">("location");
  const [mapRefreshKey, setMapRefreshKey] = useState(0);

  useEffect(() => {
    setMapZoom("location");
    setMapRefreshKey((key) => key + 1);
  }, [latitude, longitude]);

  const embedUrl = useMemo(
    () => buildMapEmbedUrl(latitude, longitude, mapZoom),
    [latitude, longitude, mapZoom],
  );

  function focusMyLocation() {
    setMapZoom("location");
    setMapRefreshKey((key) => key + 1);
  }

  const locationLabel = [city, region, country].filter(Boolean).join(", ");

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-brand" aria-hidden />
            <h2 className="text-lg font-bold text-ink">Bản đồ vị trí</h2>
          </div>
          {locationLabel ? (
            <p className="mt-1 text-sm text-muted">{locationLabel}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={focusMyLocation}
            className="inline-flex items-center gap-1.5 rounded-xl border border-brand-border bg-brand-soft px-3.5 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
          >
            <LocateFixed size={15} aria-hidden />
            Vị trí của tôi
          </button>
          <a
            href={links.googleMaps}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            <ExternalLink size={15} aria-hidden />
            Mở Google Maps
          </a>
          <a
            href={links.openStreetMap}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-sm font-medium text-muted transition hover:bg-hover hover:text-brand"
          >
            <ExternalLink size={15} aria-hidden />
            OpenStreetMap
          </a>
        </div>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-xl border border-border bg-app">
        <iframe
          key={mapRefreshKey}
          title={
            locationLabel
              ? `Bản đồ vị trí ước lượng: ${locationLabel}`
              : "Bản đồ vị trí ước lượng từ IP"
          }
          src={embedUrl}
          className="h-[280px] w-full sm:h-[320px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        <button
          type="button"
          onClick={focusMyLocation}
          className="absolute bottom-3 right-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-brand shadow-md transition hover:bg-brand hover:text-white"
          aria-label="Zoom về vị trí của tôi"
          title="Vị trí của tôi"
        >
          <LocateFixed size={18} aria-hidden />
        </button>
      </div>

      <p className="mt-3 text-xs text-muted">
        Vị trí trên bản đồ là ước lượng theo IP, có thể lệch vài km so với vị trí
        thực tế. Bấm <strong>Vị trí của tôi</strong> để zoom lại về tọa độ IP
        hoặc mở Google Maps để xem chi tiết hơn.
      </p>
    </section>
  );
}

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

  const hasCoords = info.latitude != null && info.longitude != null;

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
          onCopy={() => copyText(coords.replace(/\s/g, ""))}
        />
      </section>

      {hasCoords ? (
        <IpLocationMap
          latitude={info.latitude!}
          longitude={info.longitude!}
          city={info.city}
          region={info.region}
          country={info.country}
        />
      ) : (
        <section className="rounded-2xl border border-dashed border-border bg-surface px-5 py-8 text-center sm:px-6">
          <MapPin size={28} className="mx-auto text-subtle" aria-hidden />
          <p className="mt-3 text-sm font-medium text-ink">
            Không có tọa độ để hiển thị bản đồ
          </p>
          <p className="mt-1 text-sm text-muted">
            Dịch vụ tra cứu không trả về latitude/longitude cho IP này.
          </p>
        </section>
      )}

      <p className="text-sm text-muted">
        Thông tin vị trí được ước lượng từ dịch vụ tra cứu IP bên thứ ba và có
        thể không chính xác 100%.
      </p>
    </div>
  );
}

export default IpLookupTool;
