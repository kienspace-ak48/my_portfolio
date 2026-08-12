import api from "./axios";
import type { ResumeAdminData, ResumeContent, ResumePublicData } from "../types/resume";

export async function fetchPublicResume(): Promise<ResumePublicData> {
  const response = await api.get<{ success: boolean; data: ResumePublicData }>("/resume");
  return response.data.data;
}

export async function fetchAdminResume(): Promise<ResumeAdminData> {
  const response = await api.get<{ success: boolean; data: ResumeAdminData }>("/admin/resume");
  return response.data.data;
}

export async function updateAdminResume(content: ResumeContent): Promise<ResumePublicData> {
  const response = await api.put<{ success: boolean; data: ResumePublicData }>(
    "/admin/resume",
    { content },
  );
  return response.data.data;
}

export async function uploadResumeCv(file: File): Promise<{ cvPdfUrl: string | null; cvPdfFileName: string | null }> {
  const formData = new FormData();
  formData.append("cv", file);

  const response = await api.post<{
    success: boolean;
    data: { cvPdfUrl: string | null; cvPdfFileName: string | null };
  }>("/admin/resume/cv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000,
  });

  return response.data.data;
}

export async function removeResumeCv(): Promise<{ cvPdfUrl: string | null; cvPdfFileName: string | null }> {
  const response = await api.delete<{
    success: boolean;
    data: { cvPdfUrl: string | null; cvPdfFileName: string | null };
  }>("/admin/resume/cv");
  return response.data.data;
}
