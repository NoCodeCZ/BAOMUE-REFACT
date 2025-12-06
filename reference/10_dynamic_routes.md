# Dynamic Routes

> Use this guide when creating pages with dynamic URL segments like `/services/[slug]`.

## Pattern Overview

```
app/
├── services/
│   ├── page.tsx           # /services (list)
│   └── [slug]/
│       └── page.tsx       # /services/teeth-whitening (detail)
```

---

## Step 1: Create Folder Structure

```bash
# Create dynamic route folder
mkdir -p app/services/[slug]
touch app/services/[slug]/page.tsx
```

---

## Step 2: Basic Dynamic Page

```typescript
// app/services/[slug]/page.tsx
import { getServiceBySlug } from "@/lib/data";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900">{service.name}</h1>
        <p className="text-slate-600 mt-4">{service.short_description}</p>
      </div>
    </main>
  );
}
```

**Rules:**
- Use `params.slug` to get URL segment
- Call `notFound()` for missing items
- Always set `revalidate` for ISR

---

## Step 3: Add Dynamic Metadata

```typescript
import type { Metadata } from "next";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: service.seo_title || `${service.name} | Clinic Name`,
    description: service.seo_description || service.short_description,
    openGraph: {
      title: service.name,
      description: service.short_description,
    },
  };
}
```

---

## Step 4: Add Static Generation (Optional)

For better performance, generate pages at build time:

```typescript
import { getServices } from "@/lib/data";

export async function generateStaticParams() {
  const services = await getServices();

  return services.map((service) => ({
    slug: service.slug,
  }));
}
```

**This generates:**
- `/services/teeth-whitening`
- `/services/dental-implants`
- `/services/orthodontics`
- etc.

---

## Step 5: Multiple Dynamic Segments

For nested dynamic routes:

```bash
# Structure
app/
└── blog/
    └── [category]/
        └── [slug]/
            └── page.tsx   # /blog/news/my-post
```

```typescript
// app/blog/[category]/[slug]/page.tsx
interface PageProps {
  params: {
    category: string;
    slug: string;
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.category, params.slug);
  // ...
}

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    category: post.category.slug,
    slug: post.slug,
  }));
}
```

---

## Step 6: Catch-All Routes

For flexible paths like `/docs/getting-started/installation`:

```bash
# Structure
app/
└── docs/
    └── [...slug]/
        └── page.tsx   # Matches /docs/a, /docs/a/b, /docs/a/b/c
```

```typescript
// app/docs/[...slug]/page.tsx
interface PageProps {
  params: {
    slug: string[];  // Array of segments
  };
}

export default async function DocsPage({ params }: PageProps) {
  // params.slug = ["getting-started", "installation"]
  const path = params.slug.join("/");
  const doc = await getDocByPath(path);
  // ...
}
```

---

## Step 7: Optional Catch-All

To also match the root:

```bash
# Structure
app/
└── docs/
    └── [[...slug]]/
        └── page.tsx   # Matches /docs AND /docs/a/b
```

```typescript
interface PageProps {
  params: {
    slug?: string[];  // Optional - undefined for /docs
  };
}

export default async function DocsPage({ params }: PageProps) {
  const path = params.slug?.join("/") || "index";
  // ...
}
```

---

## Complete Example

```typescript
// app/services/[slug]/page.tsx
import { getServiceBySlug, getServices } from "@/lib/data";
import { getFileUrl } from "@/lib/directus";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

// Generate static paths
export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

// Dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) return { title: "Not Found" };

  return {
    title: service.seo_title || service.name,
    description: service.seo_description || service.short_description,
  };
}

// Page component
export default async function ServiceDetailPage({ params }: PageProps) {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-500 mb-6">
          <Link href="/">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/services">Services</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900">{service.name}</span>
        </nav>

        {/* Hero */}
        {service.hero_image && (
          <img
            src={getFileUrl(service.hero_image) || ""}
            alt={service.name}
            className="w-full h-64 object-cover rounded-xl mb-8"
          />
        )}

        {/* Content */}
        <h1 className="text-4xl font-bold text-slate-900">{service.name}</h1>
        <p className="text-slate-600 text-lg mt-4">{service.short_description}</p>

        {service.long_description && (
          <div
            className="prose prose-slate max-w-none mt-8"
            dangerouslySetInnerHTML={{ __html: service.long_description }}
          />
        )}
      </div>
    </main>
  );
}
```

---

## Quick Checklist

- [ ] Folder named `[slug]` (with brackets)
- [ ] `params.slug` accessed from props
- [ ] `notFound()` called for missing items
- [ ] `revalidate` exported for ISR
- [ ] `generateMetadata()` for dynamic SEO
- [ ] `generateStaticParams()` for static generation
- [ ] Breadcrumb navigation included
- [ ] Data fetching function exists in `lib/data.ts`
