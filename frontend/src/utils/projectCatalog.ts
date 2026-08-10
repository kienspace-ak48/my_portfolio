import type { Project } from "../types/project";
import type {
  CatalogProject,
  ProjectSort,
  ProjectStatusFilter,
} from "../types/catalogProject";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80";

function mapStatus(status: Project["status"]): CatalogProject["status"] {
  if (status === "COMPLETED") return "completed";
  if (status === "ARCHIVED") return "archived";
  return "in-progress";
}

export function apiToCatalog(p: Project): CatalogProject {
  return {
    id: String(p.id),
    slug: p.slug,
    title: p.title,
    description: p.desc ?? p.sumary ?? "",
    longDescription: p.longDesc ?? p.desc ?? p.sumary ?? "",
    thumbnail: p.thumbnail ?? PLACEHOLDER,
    badge: p.badge ?? "Project",
    tags: p.tags ?? [],
    year: p.finishedAt
      ? String(new Date(p.finishedAt).getFullYear())
      : new Date(p.createdAt).getFullYear().toString(),
    status: mapStatus(p.status),
    featured: p.featured,
    demoUrl: p.demoUrl,
    repoUrl: p.repoUrl,
    features: p.features ?? [],
    viewCount: p.viewCount,
  };
}

export function projectsToCatalog(projects: Project[] = []): CatalogProject[] {
  return projects.map(apiToCatalog);
}

export function getCatalogBySlug(
  catalog: CatalogProject[],
  slug: string,
): CatalogProject | undefined {
  return catalog.find((p) => p.slug === slug);
}

export function getAllTags(catalog: CatalogProject[]) {
  const map = new Map<string, number>();
  for (const p of catalog) {
    for (const tag of p.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));
}

export function filterCatalog(
  catalog: CatalogProject[],
  opts: {
    query?: string;
    status?: ProjectStatusFilter;
    tag?: string | null;
    sort?: ProjectSort;
  },
) {
  let result = [...catalog];

  if (opts.status === "featured") {
    result = result.filter((p) => p.featured);
  } else if (opts.status && opts.status !== "all") {
    result = result.filter((p) => p.status === opts.status);
  }

  if (opts.tag) {
    result = result.filter((p) => p.tags.includes(opts.tag!));
  }

  if (opts.query?.trim()) {
    const q = opts.query.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.badge.toLowerCase().includes(q),
    );
  }

  const sort = opts.sort ?? "featured";
  if (sort === "name") {
    result.sort((a, b) => a.title.localeCompare(b.title, "vi"));
  } else if (sort === "newest") {
    result.sort((a, b) => Number(b.year) - Number(a.year));
  } else {
    result.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return Number(b.year) - Number(a.year);
    });
  }

  return result;
}

export const STATUS_LABEL: Record<CatalogProject["status"], string> = {
  completed: "Hoàn thành",
  "in-progress": "Đang phát triển",
  archived: "Lưu trữ",
};
