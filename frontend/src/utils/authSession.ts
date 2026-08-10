export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export function isAccessTokenValid() {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  try {
    const base64 = token.split(".")[1];
    if (!base64) return false;

    const payload = JSON.parse(
      atob(base64.replace(/-/g, "+").replace(/_/g, "/")),
    ) as { exp?: number };

    if (!payload.exp) return true;
    return payload.exp * 1000 > Date.now() + 5_000;
  } catch {
    return false;
  }
}

export function redirectToAdminLogin() {
  if (typeof window === "undefined") return;

  const path = window.location.pathname;
  if (path.startsWith("/admin") && !path.includes("/login")) {
    window.location.assign(
      `/admin/login?from=${encodeURIComponent(path)}`,
    );
  }
}

export function handleAuthFailure() {
  clearAuthSession();
  redirectToAdminLogin();
}

export function isAuthErrorStatus(status: number) {
  return status === 401 || status === 403;
}
