# Directus Integration Patterns

## Client Initialization
```typescript
// lib/directus.ts
import { createDirectus, rest, staticToken } from '@directus/sdk';
import type { Schema } from './types';

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const directusToken = process.env.DIRECTUS_STATIC_TOKEN;

const directus = directusUrl
  ? createDirectus<Schema>(directusUrl.replace(/\/$/, ''))
      .with(rest())
      .with(staticToken(directusToken || ''))
  : null;

export default directus;
```

## Image URL Helper
```typescript
// lib/directus.ts
export function getFileUrl(fileId: string | { id: string } | null): string | null {
  if (!fileId || !process.env.NEXT_PUBLIC_DIRECTUS_URL) return null;

  if (typeof fileId === 'string' && fileId.startsWith('http')) return fileId;

  const id = typeof fileId === 'string' ? fileId : fileId.id;
  return `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${id}`;
}
```

## On-Demand Revalidation Webhook
```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-webhook-secret");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const collection = body.collection;

    // Revalidate based on collection
    if (collection === "pages" || collection?.startsWith("block_")) {
      revalidatePath("/", "layout");
    } else if (collection === "services") {
      revalidatePath("/services", "layout");
    } else if (collection === "posts") {
      revalidatePath("/blog", "layout");
    }

    return NextResponse.json({ revalidated: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 });
  }
}
```
