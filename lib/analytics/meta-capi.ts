import crypto from "crypto";

/**
 * Meta Conversions API (CAPI) server-side sender.
 *
 * Sends events to the Graph API so conversions are counted even when the
 * browser Pixel is blocked (iOS / ad-blockers). Events are deduplicated
 * against the browser Pixel via a shared `event_id`.
 *
 * Docs: https://developers.facebook.com/docs/marketing-api/conversions-api
 */

const GRAPH_VERSION = "v21.0";

const PIXEL_ID =
  process.env.META_DATASET_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || "";
const TEST_EVENT_CODE = process.env.META_CAPI_TEST_EVENT_CODE || "";

export function isCapiConfigured(): boolean {
  return Boolean(PIXEL_ID && ACCESS_TOKEN);
}

/** SHA-256 hash a normalized value (Meta requires lowercase hex). */
function hash(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/** Normalize + hash an email per Meta's matching spec. */
function hashEmail(email?: string | null): string | undefined {
  if (!email) return undefined;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return undefined;
  return hash(normalized);
}

/** Normalize + hash a name (trim, lowercase, strip non-letters/spaces). */
function hashName(name?: string | null): string | undefined {
  if (!name) return undefined;
  const normalized = name.trim().toLowerCase();
  if (!normalized) return undefined;
  return hash(normalized);
}

/**
 * Normalize a phone to E.164-style digits (no +) and hash it.
 * Thai numbers entered as 0XX-XXX-XXXX are converted to country code 66.
 */
function hashPhone(phone?: string | null): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, "");
  if (!digits) return undefined;
  // Local Thai format (leading 0, 9-10 digits) -> prepend country code 66
  if (digits.startsWith("0") && digits.length >= 9 && digits.length <= 10) {
    digits = "66" + digits.slice(1);
  }
  return hash(digits);
}

export interface CapiUserData {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  /** _fbp cookie value (Pixel browser id) */
  fbp?: string | null;
  /** _fbc cookie value (click id), or built from fbclid */
  fbc?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
}

export interface CapiEvent {
  eventName: string;
  /** Shared with the browser Pixel for deduplication */
  eventId?: string;
  /** Unix seconds; defaults to now */
  eventTime?: number;
  eventSourceUrl?: string;
  actionSource?: "website" | "phone_call" | "chat" | "other";
  userData?: CapiUserData;
  customData?: Record<string, unknown>;
}

function buildUserData(u: CapiUserData = {}): Record<string, unknown> {
  const ud: Record<string, unknown> = {};

  const em = hashEmail(u.email);
  if (em) ud.em = [em];

  const ph = hashPhone(u.phone);
  if (ph) ud.ph = [ph];

  const fn = hashName(u.firstName);
  if (fn) ud.fn = [fn];

  const ln = hashName(u.lastName);
  if (ln) ud.ln = [ln];

  if (u.fbp) ud.fbp = u.fbp;
  if (u.fbc) ud.fbc = u.fbc;
  if (u.clientIpAddress) ud.client_ip_address = u.clientIpAddress;
  if (u.clientUserAgent) ud.client_user_agent = u.clientUserAgent;

  return ud;
}

/**
 * Send one event to the Conversions API. Returns true on success.
 * No-ops (returns false) when credentials are not configured.
 */
export async function sendCapiEvent(event: CapiEvent): Promise<boolean> {
  if (!isCapiConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[meta-capi] Skipped: META_CAPI_ACCESS_TOKEN / pixel id not set");
    }
    return false;
  }

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: event.eventName,
        event_time: event.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        event_source_url: event.eventSourceUrl,
        action_source: event.actionSource ?? "website",
        user_data: buildUserData(event.userData),
        custom_data: event.customData ?? {},
      },
    ],
  };

  if (TEST_EVENT_CODE) {
    payload.test_event_code = TEST_EVENT_CODE;
  }

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(
    ACCESS_TOKEN
  )}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Never cache analytics calls
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[meta-capi] ${event.eventName} failed (${res.status}): ${text}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[meta-capi] request error:", err);
    return false;
  }
}
