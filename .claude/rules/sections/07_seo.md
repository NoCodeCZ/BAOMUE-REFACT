# SEO Requirements

## Sitemap (next-sitemap)
```javascript
// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://example.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/api/*'],
};
```

## JSON-LD Structured Data
```tsx
// components/StructuredData.tsx
export function LocalBusinessSchema({ settings }: { settings: GlobalSettings }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "name": settings.site_name,
    "description": settings.site_description,
    "url": process.env.NEXT_PUBLIC_SITE_URL,
    // Add address, phone, hours from settings
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

## Dynamic Metadata Pattern
```typescript
// app/services/[slug]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({ params }): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    return { title: "Not Found" };
  }

  return {
    title: service.seo_title || `${service.name} | Clinic`,
    description: service.seo_description || service.short_description,
    openGraph: {
      title: service.name,
      description: service.short_description,
    },
  };
}
```
