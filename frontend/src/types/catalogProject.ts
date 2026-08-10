export type ProjectStatus = "completed" | "in-progress" | "archived";

export type CatalogProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  badge: string;
  tags: string[];
  year: string;
  status: ProjectStatus;
  featured: boolean;
  demoUrl?: string | null;
  repoUrl?: string | null;
  features: string[];
  viewCount?: number;
};

export type ProjectSort = "featured" | "newest" | "name";
export type ProjectViewMode = "grid" | "list";
export type ProjectStatusFilter = "all" | ProjectStatus | "featured";
