# Data Fetching Functions

> Use this guide when writing functions to fetch data from Directus CMS.

## Pattern Overview

```typescript
// lib/data.ts - Standard pattern
export async function get{Entity}(params?): Promise<{Type} | null> {
  try {
    const result = await directus.request(readItems('collection', { ... }));
    return result as {Type} || null;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
```

---

## Template: Fetch Single Item by Slug

```typescript
export async function getPromotionBySlug(slug: string): Promise<Promotion | null> {
  try {
    const items = await directus.request(
      readItems('promotions', {
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' },
        },
        fields: ['*', 'image.*', 'category.*'],
        limit: 1,
      })
    );
    return (items?.[0] as Promotion) || null;
  } catch (error) {
    console.error('Error fetching promotion by slug:', error);
    return null;
  }
}
```

**Rules:**
- Filter by `slug` and `status: 'published'`
- Expand relationships with dot notation (`image.*`)
- Use `limit: 1` for single items
- Return `null` not `undefined`

---

## Template: Fetch List of Items

```typescript
export async function getPromotions(): Promise<Promotion[]> {
  try {
    const items = await directus.request(
      readItems('promotions', {
        filter: { status: { _eq: 'published' } },
        fields: ['id', 'title', 'slug', 'short_description', 'image'],
        sort: ['-date_created'],
      })
    );
    return (items || []) as Promotion[];
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return [];
  }
}
```

**Rules:**
- Return empty array `[]` on error
- Limit fields to what's needed for lists
- Use `-field` for descending sort
- Always filter by status if applicable

---

## Template: Fetch Singleton (Global Settings)

```typescript
export async function getGlobalSettings(): Promise<GlobalSettings | null> {
  try {
    const settings = await directus.request(
      readSingleton('global_settings', {
        fields: ['*', 'logo.*'],
      })
    );
    return settings as GlobalSettings || null;
  } catch (error) {
    console.error('Error fetching global settings:', error);
    return null;
  }
}
```

**Rules:**
- Use `readSingleton` not `readItems`
- No filter needed for singletons
- Expand file relationships

---

## Template: Fetch with Category Grouping

```typescript
export async function getServicesGroupedByCategory(): Promise<Map<string, Service[]>> {
  try {
    const services = await directus.request(
      readItems('services', {
        filter: { status: { _eq: 'published' } },
        fields: ['*', 'category.id', 'category.name', 'category.slug'],
        sort: ['category.sort', 'name'],
      })
    );

    const grouped = new Map<string, Service[]>();
    for (const service of services as Service[]) {
      const categoryName = typeof service.category === 'object'
        ? service.category?.name || 'Other'
        : 'Other';

      if (!grouped.has(categoryName)) {
        grouped.set(categoryName, []);
      }
      grouped.get(categoryName)!.push(service);
    }
    return grouped;
  } catch (error) {
    console.error('Error fetching services:', error);
    return new Map();
  }
}
```

---

## Template: Fetch with Pagination

```typescript
export async function getPaginatedPosts(
  page: number = 1,
  limit: number = 10
): Promise<{ posts: Post[]; total: number }> {
  try {
    const posts = await directus.request(
      readItems('posts', {
        filter: { status: { _eq: 'published' } },
        fields: ['id', 'title', 'slug', 'excerpt', 'featured_image'],
        sort: ['-publish_date'],
        limit,
        offset: (page - 1) * limit,
        meta: ['total_count'],
      })
    );

    return {
      posts: (posts || []) as Post[],
      total: (posts as any).meta?.total_count || 0,
    };
  } catch (error) {
    console.error('Error fetching paginated posts:', error);
    return { posts: [], total: 0 };
  }
}
```

---

## Filter Operators Reference

| Operator | Usage | Example |
|----------|-------|---------|
| `_eq` | Equals | `{ status: { _eq: 'published' } }` |
| `_neq` | Not equals | `{ status: { _neq: 'draft' } }` |
| `_in` | In array | `{ id: { _in: [1, 2, 3] } }` |
| `_null` | Is null | `{ parent: { _null: true } }` |
| `_contains` | Contains string | `{ title: { _contains: 'dental' } }` |
| `_gte` | Greater or equal | `{ price: { _gte: 100 } }` |
| `_lte` | Less or equal | `{ date: { _lte: '2024-01-01' } }` |

---

## Quick Checklist

- [ ] Function name follows `get{Entity}` pattern
- [ ] Return type explicitly defined
- [ ] Wrapped in try-catch
- [ ] Error logged with `console.error`
- [ ] Returns `null` or `[]` on error (never throws)
- [ ] Status filter applied for published content
- [ ] Only needed fields requested
- [ ] Relationships expanded with `.*`
- [ ] Type assertion used on result
