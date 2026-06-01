"use client";

/**
 * Client-side Meta event helper.
 *
 * Every event is sent twice with the SAME event_id:
 *   1. Browser Pixel  -> fbq('track', name, customData, { eventID })
 *   2. Server CAPI     -> POST /api/meta/track (which reads cookies + IP + UA)
 * Meta deduplicates the pair via event_id, so conversions are counted once
 * but survive ad-blockers / iOS that drop the browser Pixel.
 */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

/** Optional PII used for advanced matching (hashed server-side, never stored raw). */
export interface MetaUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

export interface TrackOptions {
  customData?: Record<string, unknown>;
  userData?: MetaUserData;
  /** Provide to reuse an id (e.g. generated before an async submit). */
  eventId?: string;
}

/** RFC4122-ish unique id for Pixel <-> CAPI deduplication. */
export function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Track a standard Meta event on both Pixel and CAPI.
 * Returns the event_id used (handy if you need to correlate).
 */
export function trackMeta(eventName: string, opts: TrackOptions = {}): string {
  const eventId = opts.eventId || newEventId();
  const customData = opts.customData ?? {};

  // 1) Browser Pixel
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", eventName, customData, { eventID: eventId });
  }

  // 2) Server CAPI gateway (fire-and-forget)
  try {
    const body = {
      eventName,
      eventId,
      eventSourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
      customData,
      userData: opts.userData ?? {},
      fbp: readCookie("_fbp"),
      fbc: readCookie("_fbc"),
    };
    const payload = JSON.stringify(body);

    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      navigator.sendBeacon(
        "/api/meta/track",
        new Blob([payload], { type: "application/json" })
      );
    } else {
      void fetch("/api/meta/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }
  } catch {
    // Analytics must never break UX
  }

  return eventId;
}
