import type { SeoPublicConfig } from "../seo/types";
import publicApi from "./publicApi";

export async function fetchSeoConfig(): Promise<SeoPublicConfig> {
  const response = await publicApi.get<{ success: boolean; data: SeoPublicConfig }>(
    "/seo/config",
  );
  return response.data.data;
}
