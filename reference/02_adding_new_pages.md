# Adding New Pages

> Use this guide when creating new routes (list pages, detail pages, static pages).

## Pattern Overview

```
app/
├── [route]/
│   ├── page.tsx          # List page (e.g., /services)
│   └── [slug]/
│       └── page.tsx      # Detail page (e.g., /services/teeth-whitening)
```

---

## Option A: List Page

Create `app/promotions/page.tsx`:

```typescript
import { getPromotions } from "@/lib/data";
import { getFileUrl } from "@/lib/directus";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Promotions | Clinic Name",
  description: "View our current dental promotions and special offers.",
};

export default async function PromotionsPage() {
  const promotions = await getPromotions();

  if (!promotions.length) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">No promotions available.</p>
      </main>
    );
  }

  return (
    <main className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Promotions</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <Link
              key={promo.id}
              href={`/promotions/${promo.slug}`}
              className="block bg-white rounded-xl shadow-sm border hover:shadow-md transition"
            >
              {promo.image && (
                <img
                  src={getFileUrl(promo.image) || ""}
                  alt={promo.title}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              )}
              <div className="p-4">
                <h2 className="font-semibold text-lg text-slate-900">
                  {promo.title}
                </h2>
                <p className="text-slate-600 text-sm mt-2">
                  {promo.short_description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
```

**Rules:**
- Always set `export const revalidate = 60`
- Handle empty state gracefully
- Use `Link` for internal navigation
- Use `getFileUrl()` for images

---

## Option B: Detail Page with Dynamic Route

Create `app/promotions/[slug]/page.tsx`:

```typescript
import { getPromotionBySlug, getPromotions } from "@/lib/data";
import { getFileUrl } from "@/lib/directus";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

// Generate static paths at build time
export async function generateStaticParams() {
  const promotions = await getPromotions();
  return promotions.map((promo) => ({ slug: promo.slug }));
}

// Dynamic SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const promo = await getPromotionBySlug(params.slug);
  if (!promo) return { title: "Not Found" };

  return {
    title: promo.seo_title || promo.title,
    description: promo.seo_description || promo.short_description,
  };
}

export default async function PromotionDetailPage({ params }: PageProps) {
  const promo = await getPromotionBySlug(params.slug);

  if (!promo) {
    notFound();
  }

  return (
    <main className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/promotions" className="hover:text-slate-700">Promotions</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900">{promo.title}</span>
        </nav>

        {/* Hero Image */}
        {promo.image && (
          <img
            src={getFileUrl(promo.image) || ""}
            alt={promo.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
          />
        )}

        {/* Content */}
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{promo.title}</h1>
        <div
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: promo.content || "" }}
        />
      </div>
    </main>
  );
}
```

**Rules:**
- Use `notFound()` for missing items
- Implement `generateMetadata()` for SEO
- Add `generateStaticParams()` for static generation
- Include breadcrumb navigation
- Use `prose` class for rich content

---

## Option C: Block-Based CMS Page

For pages built from Directus blocks (like homepage):

```typescript
import { getPageBySlug, getPageBlocks, getHeroBlock } from "@/lib/data";
import Hero from "@/components/blocks/Hero";
import Features from "@/components/blocks/Features";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function AboutPage() {
  const page = await getPageBySlug("about");
  if (!page) notFound();

  const blocks = await getPageBlocks(page.id);

  return (
    <main>
      {await Promise.all(
        blocks.map(async (block) => {
          switch (block.collection) {
            case "block_hero":
              const heroData = await getHeroBlock(parseInt(block.item));
              return heroData ? <Hero key={block.id} data={heroData} /> : null;
            case "block_features":
              const featuresData = await getFeaturesBlock(parseInt(block.item));
              return featuresData ? <Features key={block.id} data={featuresData} /> : null;
            default:
              return null;
          }
        })
      )}
    </main>
  );
}
```

---

## Quick Checklist

- [ ] Page file created in correct `app/` path
- [ ] `revalidate = 60` exported
- [ ] Metadata set (static or dynamic)
- [ ] Empty/error states handled
- [ ] `notFound()` called for missing items
- [ ] Images use `getFileUrl()` helper
- [ ] Navigation uses `Link` component
- [ ] Responsive layout with Tailwind
