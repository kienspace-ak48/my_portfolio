import type { ResumeAdminData, ResumeContent, ResumePublicData } from "../types/resume";
import { downloadBlob, parseContentDispositionFilename } from "../utils/downloadBlob";
import adminApi from "./axios";
import publicApi from "./publicApi";

export async function fetchPublicResume(): Promise<ResumePublicData> {
  const response = await publicApi.get<{ success: boolean; data: ResumePublicData }>("/resume");
  return response.data.data;
}

export async function fetchAdminResume(): Promise<ResumeAdminData> {
  const response = await adminApi.get<{ success: boolean; data: ResumeAdminData }>("/admin/resume");
  return response.data.data;
}

export async function updateAdminResume(content: ResumeContent): Promise<ResumePublicData> {
  const response = await adminApi.put<{ success: boolean; data: ResumePublicData }>(
    "/admin/resume",
    { content },
  );
  return response.data.data;
}

export async function uploadResumeCv(file: File): Promise<{ cvPdfUrl: string | null; cvPdfFileName: string | null }> {
  const formData = new FormData();
  formData.append("cv", file);

  const response = await adminApi.post<{
    success: boolean;
    data: { cvPdfUrl: string | null; cvPdfFileName: string | null };
  }>("/admin/resume/cv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000,
  });

  return response.data.data;
}

export async function downloadResumeCv(): Promise<void> {
  const response = await publicApi.get("/resume/cv/download", {
    responseType: "blob",
  });

  const disposition = response.headers["content-disposition"] as string | undefined;
  const filename =
    parseContentDispositionFilename(disposition) ??
    `${new Date().toISOString().slice(0, 10)}_CV.pdf`;

  downloadBlob(response.data, filename);
}

export async function removeResumeCv(): Promise<{ cvPdfUrl: string | null; cvPdfFileName: string | null }> {
  const response = await adminApi.delete<{
    success: boolean;
    data: { cvPdfUrl: string | null; cvPdfFileName: string | null };
  }>("/admin/resume/cv");
  return response.data.data;
}
