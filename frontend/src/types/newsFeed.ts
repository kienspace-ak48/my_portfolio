export type FeedLink = {
  label: string;
  href: string;
};

export type FeedPost = {
  id: string;
  author: {
    name: string;
    avatar: string;
    category: string;
  };
  publishedAt: string;
  title: string;
  excerpt: string;
  bullets?: FeedLink[];
  imageUrl: string;
  imageAlt?: string;
  cta: {
    label: string;
    href: string;
  };
};

export type FeedPromo = {
  id: string;
  imageUrl: string;
  href: string;
  alt?: string;
};
