import { useEffect } from "react";
import { useSeoContext } from "../seo/SeoContext";
import type { SeoBreadcrumb, SeoVars } from "../seo/types";

export default function usePageSeo(
  vars: SeoVars,
  breadcrumbs: SeoBreadcrumb[] = [],
) {
  const { setSeoVars, setSeoBreadcrumbs } = useSeoContext();

  useEffect(() => {
    setSeoVars(vars);
    setSeoBreadcrumbs(breadcrumbs);
  }, [vars, breadcrumbs, setSeoVars, setSeoBreadcrumbs]);
}
