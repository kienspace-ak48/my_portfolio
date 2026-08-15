export type AdminTag = {
  id: number;
  name: string;
  slug: string;
  projectCount: number;
  blogPostCount: number;
  usageCount: number;
};

export type BlogCategoryDef = {
  id: number;
  slug: string;
  label: string;
  description?: string | null;
  sortOrder: number;
  isActive?: boolean;
  postCount?: number;
};

export type TagForm = {
  name: string;
};

export type CategoryForm = {
  label: string;
  slug: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};
