function resolvePageKey(pathname) {
  const path = (pathname || "/").split("?")[0].replace(/\/+$/, "") || "/";

  if (path === "/") return "home";
  if (path === "/news") return "news";
  if (path === "/projects") return "projects.index";
  if (/^\/projects\/[^/]+$/.test(path)) return "project.detail";
  if (path === "/resume") return "resume";
  if (path === "/blog") return "blog.index";
  if (/^\/blog\/[^/]+$/.test(path)) return "blog.post";
  if (path === "/tools") return "tools.index";
  if (path === "/tools/base64") return "tools.base64";
  if (path === "/tools/ip") return "tools.ip";
  if (path === "/tools/password") return "tools.password";
  if (path === "/tools/meta-tag") return "tools.meta-tag";
  if (path === "/admin" || path === "/admin/login") return "admin";
  if (path.startsWith("/admin/")) return "not-found";
  return "not-found";
}

function extractSlug(pathname, prefix) {
  const path = (pathname || "").split("?")[0];
  const re = new RegExp(`^${prefix}/([^/]+)$`);
  const match = path.match(re);
  return match?.[1] ?? null;
}

module.exports = {
  resolvePageKey,
  extractSlug,
};
