import { NextRequest, NextResponse } from "next/server";
import { sendCapiEvent, isCapiConfigured } from "@/lib/analytics/meta-capi";

/**
 * Server-side Conversions API gateway.
 *
 * The browser calls this (via lib/analytics/meta-client.ts) for every Meta
 * event. We enrich it with the client IP, user agent, and Pixel cookies
 * (_fbp / _fbc) — data the browser can't put in a CAPI call itself — then
 * forward to Meta with the shared event_id for deduplication.
 *
 * Accepts both fetch() JSON bodies and navigator.sendBeacon() Blobs.
 */

const MAX_PAYLOAD_SIZE = 20 * 1024; // 20KB

// Standard Meta events we accept, plus our custom Scroll event.
const ALLOWED_EVENTS = new Set([
  "PageView",
  "Lead",
  "Contact",
  "ViewContent",
  "Schedule",
  "Scroll",
]);

function getClientIp(request: NextRequest): string | undefined {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") || undefined;
}

export async function POST(request: NextRequest) {
  try {
    // Short-circuit if Meta isn't configured yet (scaffold-safe).
    if (!isCapiConfigured()) {
      return NextResponse.json({ success: false, skipped: true });
    }

    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_PAYLOAD_SIZE) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const {
      eventName,
      eventId,
      eventSourceUrl,
      customData,
      userData,
      fbp,
      fbc,
    } = body as Record<string, any>;

    if (typeof eventName !== "string" || !ALLOWED_EVENTS.has(eventName)) {
      return NextResponse.json({ error: "Invalid event name" }, { status: 400 });
    }

    const ok = await sendCapiEvent({
      eventName,
      eventId: typeof eventId === "string" ? eventId : undefined,
      eventSourceUrl: typeof eventSourceUrl === "string" ? eventSourceUrl : undefined,
      actionSource: "website",
      userData: {
        email: userData?.email,
        phone: userData?.phone,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        fbp: typeof fbp === "string" ? fbp : undefined,
        fbc: typeof fbc === "string" ? fbc : undefined,
        clientIpAddress: getClientIp(request),
        clientUserAgent: request.headers.get("user-agent") || undefined,
      },
      customData: customData && typeof customData === "object" ? customData : {},
    });

    return NextResponse.json({ success: ok });
  } catch (error) {
    console.error("[api/meta/track] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
