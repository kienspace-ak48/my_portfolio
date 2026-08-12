import api from "../api/axios";
import type { SeoPublicConfig } from "../seo/types";

export async function fetchSeoConfig(): Promise<SeoPublicConfig> {
  const response = await api.get<{ success: boolean; data: SeoPublicConfig }>(
    "/seo/config",
  );
  return response.data.data;
}
