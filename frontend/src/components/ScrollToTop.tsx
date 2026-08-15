import { useEffect, type RefObject } from "react";
import { useLocation } from "react-router-dom";

type ScrollToTopProps = {
  /** Scroll container; mặc định là window (client). */
  target?: RefObject<HTMLElement | null>;
};

export default function ScrollToTop({ target }: ScrollToTopProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    const el = target?.current;
    if (el) {
      el.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, target]);

  return null;
}
