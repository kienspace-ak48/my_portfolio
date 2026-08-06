export interface Project {
  id: number;
  slug: string;
  title: string;
  sumary: string | null;
  desc: string | null;
  longDesc: string | null;
  thumbnail: string | null;
  isDisplay: boolean;
  finishedAt: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  viewCount: number;
}

export type CreateProjectDto = {
  title: string;
  slug: string;
  sumary: string;
  desc: string;
  longDesc: string;
  thumbnail: string;
  demoUrl: string;
  repoUrl: string;
  finishedAt: string;
  viewCount: number;
  isDisplay: boolean;
  featured: boolean;
};

export type UpdateProjectDto = Partial<{
  title: string;
  slug: string;
  sumary: string | null;
  desc: string | null;
  longDesc: string | null;
  thumbnail: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  finishedAt: string | null;
  viewCount: number;
  isDisplay: boolean;
  featured: boolean;
}>;

function emptyToNull(value: string) {
  return value.trim() === "" ? null : value;
}

export function toProjectPayload(form: CreateProjectDto) {
  return {
    ...form,
    sumary: emptyToNull(form.sumary),
    desc: emptyToNull(form.desc),
    longDesc: emptyToNull(form.longDesc),
    thumbnail: emptyToNull(form.thumbnail),
    demoUrl: emptyToNull(form.demoUrl),
    repoUrl: emptyToNull(form.repoUrl),
    finishedAt: form.finishedAt ? new Date(form.finishedAt).toISOString() : null,
  };
}

export type ProjectPayload = ReturnType<typeof toProjectPayload>;
