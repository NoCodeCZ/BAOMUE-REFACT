/**
 * LINE Messaging API integration.
 *
 * Pushes new lead notifications into a LINE group via a LINE Official Account bot.
 * (LINE Notify was shut down on 2025-03-31, so the Messaging API push endpoint is
 *  the current supported path.)
 *
 * Required env vars (server-only, no NEXT_PUBLIC prefix):
 *   LINE_CHANNEL_ACCESS_TOKEN  - long-lived channel access token from LINE Developers console
 *   LINE_GROUP_ID              - the target group id (capture it via /api/line/webhook)
 *
 * If either is missing, notifyLine() is a graceful no-op so the form keeps working.
 */

const LINE_PUSH_ENDPOINT = 'https://api.line.me/v2/bot/message/push';

export interface LeadNotification {
  /** Submission type as received by /api/forms/submit */
  type: 'contact' | 'form' | 'booking';
  /** Directus form_submissions record id, if available */
  id?: number | string;
  /** Raw submitted data (dynamic shape) */
  data: Record<string, unknown>;
  /** Optional human label for the form/source */
  source?: string;
}

/** Field labels (case-insensitive substrings) hidden from the LINE message. */
const HIDDEN_KEYS = ['form_type', 'consent', 'agree', 'pdpa'];

function isHiddenKey(key: string): boolean {
  const k = key.toLowerCase();
  return HIDDEN_KEYS.some((h) => k.includes(h));
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? '✅' : '❌';
  if (Array.isArray(value)) return value.map((v) => formatValue(v)).join(', ');
  return String(value).trim();
}

/**
 * Build a readable Thai LINE message from a lead submission.
 */
export function formatLeadMessage(lead: LeadNotification): string {
  const heading =
    lead.type === 'booking'
      ? '🦷 มีการจองคิวใหม่ (New Booking)'
      : lead.type === 'contact'
        ? '📩 มีข้อความติดต่อใหม่ (New Contact)'
        : '📝 มีลูกค้ากรอกฟอร์มใหม่ (New Lead)';

  const lines: string[] = [heading];
  if (lead.source) lines.push(`ฟอร์ม: ${lead.source}`);
  lines.push('━━━━━━━━━━━━━━');

  for (const [key, value] of Object.entries(lead.data)) {
    if (isHiddenKey(key)) continue;
    const printed = formatValue(value);
    if (!printed || printed === '-') continue;
    lines.push(`• ${key}: ${printed}`);
  }

  lines.push('━━━━━━━━━━━━━━');
  if (lead.id !== undefined) lines.push(`เลขที่: #${lead.id}`);
  lines.push('🌐 baomuedentalclinic.com');

  // LINE text messages cap at 5000 chars.
  return lines.join('\n').slice(0, 4900);
}

/**
 * Push a lead notification to the configured LINE group.
 * Never throws — returns false on any failure so callers can fire-and-forget.
 */
export async function notifyLine(lead: LeadNotification): Promise<boolean> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const groupId = process.env.LINE_GROUP_ID;

  if (!token || !groupId) {
    // Not configured yet — silently skip so the form still works.
    return false;
  }

  try {
    const res = await fetch(LINE_PUSH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to: groupId,
        messages: [{ type: 'text', text: formatLeadMessage(lead) }],
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('[LINE] push failed:', res.status, detail);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[LINE] push error:', error);
    return false;
  }
}
