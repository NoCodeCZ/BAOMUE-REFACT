"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackMeta } from "@/lib/analytics/meta-client";

/**
 * Auto-fires Meta events that aren't tied to a specific component:
 *   - PageView on every client-side route change (the initial PageView is
 *     fired by the Pixel base code in <MetaPixelScript />).
 *   - Scroll depth milestones (25 / 50 / 75 / 90%) as a custom "Scroll" event.
 *   - Contact when a user clicks any LINE link or tel: phone link, anywhere
 *     on the site (event delegation — no need to touch each component).
 *
 * Mount once, inside <body> in the root layout.
 */
export default function MetaPixelEvents() {
  const pathname = usePathname();
  const isFirstLoad = useRef(true);

  // PageView on route change (skip the very first load — base code handles it)
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    trackMeta("PageView");
  }, [pathname]);

  // Scroll depth — reset milestones whenever the route changes
  useEffect(() => {
    const milestones = [25, 50, 75, 90];
    const fired = new Set<number>();

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return;
      const percent = (doc.scrollTop / scrollable) * 100;

      for (const m of milestones) {
        if (percent >= m && !fired.has(m)) {
          fired.add(m);
          trackMeta("Scroll", {
            customData: { percent_scrolled: m, page_path: pathname },
          });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Contact — delegated click listener for LINE + phone links
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      let method: string | null = null;

      if (href.startsWith("tel:")) method = "phone";
      else if (href.includes("line.me") || href.includes("line.naver"))
        method = "line";

      if (!method) return;

      trackMeta("Contact", {
        customData: { contact_method: method, page_path: window.location.pathname },
      });
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
