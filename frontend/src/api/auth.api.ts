import api, { clearAuthTokens, setAuthTokens } from "./axios";
import { isAccessTokenValid } from "../utils/authSession";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
  updatedAt: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export const login = async (email: string, password: string) => {
  const res = await api.post<{ data: LoginResponse }>("/auth/login", {
    email,
    password,
  });
  const payload = res.data.data;
  setAuthTokens(payload.accessToken, payload.refreshToken);
  return payload;
};

export const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    if (refreshToken) {
      await api.post("/auth/logout", { refreshToken });
    }
  } finally {
    clearAuthTokens();
  }
};

export const getMe = () => api.get<{ data: AuthUser }>("/auth/me");

export const isAuthenticated = () => isAccessTokenValid();
