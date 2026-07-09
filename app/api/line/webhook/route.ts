import { NextRequest, NextResponse } from 'next/server';

/**
 * LINE webhook — used to CAPTURE THE GROUP ID during setup.
 *
 * Setup flow:
 *   1. Set this URL as the webhook in the LINE Developers console:
 *        https://baomuedentalclinic.com/api/line/webhook
 *   2. Add your bot (Official Account) to the target LINE group.
 *   3. Send any message in that group (or the "bot joined" event fires).
 *   4. Read the Coolify app logs — the group id is logged as:  [LINE webhook] source: { type: 'group', groupId: '...' }
 *   5. Put that value into the LINE_GROUP_ID env var.
 *
 * After you have the group id, this route can stay (harmless) or be removed.
 * LINE requires the webhook to answer 200 quickly, which it always does.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const events = Array.isArray(body?.events) ? body.events : [];
    for (const event of events) {
      // event.source contains { type: 'user' | 'group' | 'room', userId?, groupId?, roomId? }
      console.log('[LINE webhook] event:', event.type, 'source:', event.source);
    }
  } catch (error) {
    console.error('[LINE webhook] parse error:', error);
  }
  // Always 200 so LINE marks the webhook as healthy.
  return NextResponse.json({ ok: true });
}

// LINE sends a GET/verify request when you click "Verify" in the console.
export async function GET() {
  return NextResponse.json({ ok: true });
}
