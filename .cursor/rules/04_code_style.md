# Code Style

## Component Naming
```typescript
// Server Component (default)
// components/Header.tsx
export default async function Header() { ... }

// Client Component (when needed)
// components/HeaderClient.tsx
"use client";
export default function HeaderClient() { ... }
```

## Data Fetching Functions
```typescript
// lib/data.ts - Always follow this pattern
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const services = await directus.request(
      readItems('services', {
        filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
        fields: ['*', 'category.*', 'hero_image.*'],
        limit: 1,
      })
    );
    return (services?.[0] as Service) || null;
  } catch (error) {
    console.error('Error fetching service by slug:', error);
    return null;
  }
}
```

## TypeScript Interfaces
```typescript
// lib/types.ts - Mirror Directus collections
export interface Service {
  id: number;
  name: string;
  slug: string;
  status: 'published' | 'draft';
  category?: ServiceCategory | number | null;
  short_description?: string;
  // ... all fields from Directus
}
```

## Tailwind Class Ordering
Follow this order: layout → sizing → spacing → typography → colors → effects
```tsx
<div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-8 text-lg text-slate-600 bg-white shadow-lg">
```
