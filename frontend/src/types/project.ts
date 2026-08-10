export type ProjectStatusApi = "COMPLETED" | "IN_PROGRESS" | "ARCHIVED";

export interface Project {
  id: number;
  slug: string;
  title: string;
  badge: string | null;
  sumary: string | null;
  desc: string | null;
  longDesc: string | null;
  thumbnail: string | null;
  status: ProjectStatusApi;
  isDisplay: boolean;
  finishedAt: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  viewCount: number;
  features: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type CreateProjectDto = {
  title: string;
  slug: string;
  badge: string;
  sumary: string;
  desc: string;
  longDesc: string;
  thumbnail: string;
  status: ProjectStatusApi;
  demoUrl: string;
  repoUrl: string;
  finishedAt: string;
  viewCount: number;
  isDisplay: boolean;
  featured: boolean;
  tags: string[];
  features: string[];
};

export type UpdateProjectDto = Partial<CreateProjectDto>;

export type ProjectQuery = {
  q?: string;
  status?: string;
  tag?: string;
  featured?: string;
  sort?: "featured" | "newest" | "name";
};

export const PROJECT_STATUS_OPTIONS: {
  value: ProjectStatusApi;
  label: string;
}[] = [
  { value: "IN_PROGRESS", label: "Đang phát triển" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "ARCHIVED", label: "Lưu trữ" },
];

function emptyToNull(value: string) {
  return value.trim() === "" ? null : value;
}

export function toProjectPayload(form: CreateProjectDto) {
  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    badge: emptyToNull(form.badge),
    sumary: emptyToNull(form.sumary),
    desc: emptyToNull(form.desc),
    longDesc: emptyToNull(form.longDesc),
    thumbnail: emptyToNull(form.thumbnail),
    status: form.status,
    demoUrl: emptyToNull(form.demoUrl),
    repoUrl: emptyToNull(form.repoUrl),
    finishedAt: form.finishedAt ? new Date(form.finishedAt).toISOString() : null,
    viewCount: form.viewCount,
    isDisplay: form.isDisplay,
    featured: form.featured,
    tags: form.tags,
    features: form.features.filter((f) => f.trim()),
  };
}

export type ProjectPayload = ReturnType<typeof toProjectPayload>;

export function projectStatusLabel(status: ProjectStatusApi) {
  return PROJECT_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}
