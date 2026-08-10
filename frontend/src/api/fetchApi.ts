import {
  handleAuthFailure,
  isAuthErrorStatus,
} from "../utils/authSession";

const BASE_API = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  { auth = false }: { auth?: boolean } = {},
): Promise<ApiEnvelope<T>> {
  const headers = new Headers(init?.headers);

  if (
    auth &&
    !headers.has("Authorization") &&
    typeof window !== "undefined"
  ) {
    const token = localStorage.getItem("accessToken");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${BASE_API}${path}`, { ...init, headers });

  if (auth && isAuthErrorStatus(res.status) && typeof window !== "undefined") {
    handleAuthFailure();
    throw new Error("Phiên đăng nhập đã hết hạn");
  }

  const json = (await res.json().catch(() => ({}))) as ApiEnvelope<T> & {
    message?: string;
  };

  if (!res.ok) {
    throw new Error(json.message ?? `HTTP ${res.status}`);
  }

  return json;
}

export { BASE_API };
