# Common Patterns

## Server Component with Fallback
```tsx
// components/Header.tsx
import { getNavigationItems, getGlobalSettings } from "@/lib/data";
import HeaderClient from "./HeaderClient";

export const revalidate = 60;

export default async function Header() {
  const navigationItems = await getNavigationItems();
  const settings = await getGlobalSettings();

  // Fallback if CMS is unavailable
  const navigation = navigationItems.length > 0
    ? navigationItems
    : [
        { id: 1, title: "Home", url: "/", sort: 1 },
        { id: 2, title: "Services", url: "/services", sort: 2 },
      ];

  return <HeaderClient navigationItems={navigation} siteName={settings?.site_name || "Clinic"} />;
}
```

## Dynamic Page with Block Rendering
```tsx
// app/page.tsx
import { getPageBySlug, getPageBlocks, getHeroBlock } from "@/lib/data";
import Hero from "@/components/blocks/Hero";

export const revalidate = 60;

export default async function HomePage() {
  const page = await getPageBySlug("home");
  if (!page) return <NotFound />;

  const blocks = await getPageBlocks(page.id);

  return (
    <main>
      {blocks.map(async (block) => {
        if (block.collection === "block_hero") {
          const heroData = await getHeroBlock(parseInt(block.item));
          return heroData ? <Hero key={block.id} data={heroData} /> : null;
        }
        // ... other block types
      })}
    </main>
  );
}
```

## Tracking Click Events
```tsx
// components/BookingButton.tsx
"use client";
import { trackEvent } from "@/lib/analytics/events";

export function BookingButton({ service }: { service: string }) {
  const handleClick = () => {
    trackEvent("booking_click", { service, location: "service_page" });
  };

  return (
    <a href="/contact" onClick={handleClick} className="btn-primary">
      Book Now
    </a>
  );
}
```

## Empty State Pattern
```tsx
export default async function ServicesPage() {
  const services = await getServices();

  if (!services.length) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">No services available.</p>
      </div>
    );
  }

  return <ServiceGrid services={services} />;
}
```

## 404 Handling
```tsx
import { notFound } from "next/navigation";

export default async function ServicePage({ params }) {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  return <ServiceDetail service={service} />;
}
```
