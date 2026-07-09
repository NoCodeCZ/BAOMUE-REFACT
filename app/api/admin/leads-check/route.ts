import { NextRequest, NextResponse } from 'next/server';
import directus from '@/lib/directus';
import { readItems } from '@directus/sdk';

/**
 * TEMPORARY read-only endpoint to inspect form_submissions for a one-time
 * lead audit. Guarded by the LEADS_CHECK_SECRET env var. Remove after use.
 */
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-check-secret');
  if (!secret || secret !== process.env.LEADS_CHECK_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!directus) {
    return NextResponse.json({ error: 'no directus client' }, { status: 500 });
  }

  try {
    const items: any[] = await (directus as any).request(
      (readItems as any)('form_submissions', {
        fields: ['id', 'status', 'form', 'date_created', 'customer_name', 'phone', 'service', 'branch', 'data'],
        sort: ['id'],
        limit: -1,
      })
    );

    const rows = (items || []).map((it) => {
      const data = it.data && typeof it.data === 'object' ? it.data : {};
      return {
        id: it.id,
        status: it.status,
        form: it.form,
        date_created: it.date_created,
        form_type: data.form_type ?? null,
        name: it.customer_name ?? data.name ?? null,
        phone: it.phone ?? data.phone ?? null,
        email: data.email ?? null,
        service: it.service ?? data.service ?? null,
        keys: Object.keys(data),
      };
    });

    return NextResponse.json({ count: rows.length, rows });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'query failed', message: String(error?.message ?? error) },
      { status: 500 }
    );
  }
}
