import type { ProjectPayload, ProjectQuery, UpdateProjectDto } from "../types/project";
import adminApi from "./axios";
import publicApi from "./publicApi";

export const getProjects = (params?: ProjectQuery) =>
  publicApi.get("/projects", { params });

export const getProjectTags = () => publicApi.get("/projects/tags");

export const getProjectBySlug = (slug: string) =>
  publicApi.get(`/projects/slug/${slug}`);

export const getAdminProjects = () => adminApi.get("/projects/admin");

export const getProject = (id: number) => adminApi.get(`/projects/${id}`);

export const createProject = (data: ProjectPayload) =>
  adminApi.post("/projects", data);

export const updateProject = (id: number, data: ProjectPayload | UpdateProjectDto) =>
  adminApi.put(`/projects/${id}`, data);

export const deleteProject = (id: number) => adminApi.delete(`/projects/${id}`);
