import axios from "axios";
import { handleAuthFailure, isAuthErrorStatus } from "../utils/authSession";
import { BASE_API } from "./publicApi";

/** Admin / authenticated endpoints — attaches token + auto refresh. */
const adminApi = axios.create({
  baseURL: BASE_API,
  timeout: 10000,
});

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export function setAuthTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

export function clearAuthTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

adminApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  const response = await axios.post(`${BASE_API}/auth/refresh`, {
    refreshToken,
  });

  const accessToken = response.data?.data?.accessToken as string;
  if (!accessToken) {
    throw new Error("Invalid refresh response");
  }

  localStorage.setItem("accessToken", accessToken);
  return accessToken;
}

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (
      !isAuthErrorStatus(status ?? 0) ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return adminApi(originalRequest);
    } catch {
      clearAuthTokens();
      handleAuthFailure();
      return Promise.reject(error);
    }
  },
);

export { adminApi };
export default adminApi;
