import type { ProjectPayload, UpdateProjectDto } from "../types/project";
import api from "./axios";

export const getProjects = () => api.get("/projects");

export const getProject = (id: number) => api.get(`/projects/${id}`);

export const createProject = (data: ProjectPayload) =>
  api.post("/projects", data);

export const updateProject = (id: number, data: ProjectPayload | UpdateProjectDto) =>
  api.put(`/projects/${id}`, data);
export const deleteProject = (id: number) => api.delete(`/projects/${id}`);
