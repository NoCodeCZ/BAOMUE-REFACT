"use client";

import { useEffect, useRef } from "react";
import { trackMeta } from "@/lib/analytics/meta-client";

interface ViewContentTrackerProps {
  contentName: string;
  contentCategory?: string;
  contentIds?: string[];
}

/**
 * Fires a Meta "ViewContent" event once when a content page (e.g. a service
 * detail page) mounts. Drop this anywhere inside the page — it renders
 * nothing. Useful for building retargeting audiences of people who viewed
 * a specific treatment.
 */
export default function ViewContentTracker({
  contentName,
  contentCategory,
  contentIds,
}: ViewContentTrackerProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    trackMeta("ViewContent", {
      customData: {
        content_name: contentName,
        content_type: "product",
        ...(contentCategory ? { content_category: contentCategory } : {}),
        ...(contentIds && contentIds.length ? { content_ids: contentIds } : {}),
      },
    });
  }, [contentName, contentCategory, contentIds]);

  return null;
}
