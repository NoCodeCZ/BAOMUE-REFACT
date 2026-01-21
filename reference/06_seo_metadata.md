# SEO & Metadata

> Use this guide when implementing meta tags, structured data, and SEO optimizations.

## Pattern Overview

```
Page ──▶ generateMetadata() ──▶ <head> tags
      ──▶ JSON-LD Schema ──▶ Structured data
      ──▶ next-sitemap ──▶ sitemap.xml
```

---

## Step 1: Static Metadata (Simple Pages)

For pages without dynamic content:

```typescript
// app/contact/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Baomue Dental Clinic",
  description: "Get in touch with Baomue Dental Clinic. Book appointments, ask questions, or visit our locations.",
  openGraph: {
    title: "Contact Us | Baomue Dental Clinic",
    description: "Get in touch with Baomue Dental Clinic.",
    type: "website",
  },
};

export default function ContactPage() {
  // ...
}
```

---

## Step 2: Dynamic Metadata (Detail Pages)

For pages with CMS content:

```typescript
// app/services/[slug]/page.tsx
import type { Metadata } from "next";
import { getServiceBySlug } from "@/lib/data";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    return {
      title: "Service Not Found",
      description: "The requested service could not be found.",
    };
  }

  return {
    title: service.seo_title || `${service.name} | Baomue Dental`,
    description: service.seo_description || service.short_description,
    openGraph: {
      title: service.seo_title || service.name,
      description: service.seo_description || service.short_description,
      type: "article",
      images: service.hero_image
        ? [{ url: getFileUrl(service.hero_image) || "" }]
        : [],
    },
  };
}
```

**Rules:**
- Fetch data first, then generate metadata
- Use CMS SEO fields if available
- Fallback to main content fields
- Include OpenGraph for social sharing

---

## Step 3: JSON-LD Structured Data

Create reusable schema components:

```typescript
// components/seo/LocalBusinessSchema.tsx
import { getGlobalSettings } from "@/lib/data";

export async function LocalBusinessSchema() {
  const settings = await getGlobalSettings();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "name": settings?.site_name || "Dental Clinic",
    "description": settings?.site_description,
    "url": process.env.NEXT_PUBLIC_SITE_URL,
    "telephone": "+66-XX-XXX-XXXX",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Sukhumvit Road",
      "addressLocality": "Bangkok",
      "addressCountry": "TH",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "13.7563",
      "longitude": "100.5018",
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00",
      },
    ],
    "priceRange": "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

Add to layout:

```typescript
// app/layout.tsx
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <LocalBusinessSchema />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## Step 4: Service Schema (Detail Pages)

```typescript
// components/seo/ServiceSchema.tsx
import type { Service } from "@/lib/types";

export function ServiceSchema({ service }: { service: Service }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "name": service.name,
    "description": service.short_description,
    "procedureType": "https://schema.org/NoninvasiveProcedure",
    "followup": service.duration_label,
    "howPerformed": service.long_description,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

## Step 5: Sitemap Configuration

Install and configure `next-sitemap`:

```bash
npm install next-sitemap
```

Create `next-sitemap.config.js`:

```javascript
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/api/*", "/admin/*"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/api/", "/admin/"] },
    ],
  },
};
```

Add to `package.json`:

```json
{
  "scripts": {
    "postbuild": "next-sitemap"
  }
}
```

---

## Common Schema Types

| Page Type | Schema Type |
|-----------|-------------|
| Homepage | `LocalBusiness`, `Dentist` |
| Service detail | `MedicalProcedure`, `Service` |
| Blog post | `Article`, `BlogPosting` |
| Team/Dentist | `Person`, `Physician` |
| Location | `LocalBusiness`, `Place` |
| FAQ | `FAQPage` |

---

## Quick Checklist

- [ ] Static pages have `export const metadata`
- [ ] Dynamic pages have `generateMetadata()`
- [ ] SEO fields used from CMS when available
- [ ] Fallback to main content if no SEO fields
- [ ] OpenGraph tags included for social
- [ ] JSON-LD schema added for main entity types
- [ ] `next-sitemap` configured
- [ ] `robots.txt` generated
- [ ] Tested with Google Rich Results Test
