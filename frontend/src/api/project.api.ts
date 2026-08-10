import type { ProjectPayload, ProjectQuery, UpdateProjectDto } from "../types/project";
import api from "./axios";

export const getProjects = (params?: ProjectQuery) =>
  api.get("/projects", { params });

export const getAdminProjects = () => api.get("/projects/admin");

export const getProjectTags = () => api.get("/projects/tags");

export const getProjectBySlug = (slug: string) =>
  api.get(`/projects/slug/${slug}`);

export const getProject = (id: number) => api.get(`/projects/${id}`);

export const createProject = (data: ProjectPayload) =>
  api.post("/projects", data);

export const updateProject = (id: number, data: ProjectPayload | UpdateProjectDto) =>
  api.put(`/projects/${id}`, data);

export const deleteProject = (id: number) => api.delete(`/projects/${id}`);
