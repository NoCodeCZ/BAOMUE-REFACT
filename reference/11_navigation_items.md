# Navigation Items

> Use this guide when adding or modifying site navigation from Directus.

## Pattern Overview

```
Directus (navigation) ──▶ getNavigationItems() ──▶ Header Component ──▶ Rendered Nav
```

---

## Step 1: Understand Navigation Structure

```typescript
// lib/types.ts
export interface NavigationItem {
  id: number;
  title: string;
  url?: string | null;           // External URL
  page?: Page | number | null;   // Internal page link
  parent?: NavigationItem | number | null;
  target?: '_self' | '_blank';
  sort?: number | null;
  children?: NavigationItem[];   // Nested items
}
```

---

## Step 2: Fetch Navigation

The fetch function in `lib/data.ts`:

```typescript
export async function getNavigationItems(): Promise<NavigationItem[]> {
  try {
    const items = await directus.request(
      readItems('navigation', {
        fields: ['*', 'page.slug', 'page.id', 'children.*', 'children.page.slug'],
        sort: ['sort'],
        filter: { parent: { _null: true } }, // Top-level only
      })
    );

    // Process items to build hierarchy
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url || null,
      target: item.target || '_self',
      page: item.page,
      children: item.children || [],
    }));
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return [];
  }
}
```

---

## Step 3: Get Navigation URL Helper

```typescript
// lib/data.ts
export function getNavigationUrl(item: NavigationItem): string {
  // External URL
  if (item.url) {
    return item.url;
  }

  // Internal page link
  if (item.page && typeof item.page === 'object' && item.page.slug) {
    return item.page.slug === 'home' ? '/' : `/${item.page.slug}`;
  }

  return '#';
}
```

---

## Step 4: Render Navigation (Server Component)

```typescript
// components/Header.tsx
import { getNavigationItems, getGlobalSettings } from "@/lib/data";
import HeaderClient from "./HeaderClient";

export const revalidate = 60;

export default async function Header() {
  const navigationItems = await getNavigationItems();
  const settings = await getGlobalSettings();

  // Fallback navigation
  const navigation = navigationItems.length > 0
    ? navigationItems
    : [
        { id: 1, title: "Home", url: "/", sort: 1 },
        { id: 2, title: "Services", url: "/services", sort: 2 },
        { id: 3, title: "Blog", url: "/blog", sort: 3 },
        { id: 4, title: "Contact", url: "/contact", sort: 4 },
      ];

  return (
    <HeaderClient
      navigationItems={navigation}
      siteName={settings?.site_name || "Clinic"}
    />
  );
}
```

---

## Step 5: Interactive Navigation (Client Component)

```typescript
// components/HeaderClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { getNavigationUrl } from "@/lib/data";
import type { NavigationItem } from "@/lib/types";

interface HeaderClientProps {
  navigationItems: NavigationItem[];
  siteName: string;
}

export default function HeaderClient({ navigationItems, siteName }: HeaderClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-slate-900">
            {siteName}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <div key={item.id} className="relative">
                {item.children?.length ? (
                  // Dropdown
                  <>
                    <button
                      onClick={() => setOpenDropdown(
                        openDropdown === item.id ? null : item.id
                      )}
                      className="flex items-center text-slate-600 hover:text-slate-900"
                    >
                      {item.title}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    {openDropdown === item.id && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={getNavigationUrl(child)}
                            className="block px-4 py-2 text-slate-600 hover:bg-slate-50"
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  // Regular link
                  <Link
                    href={getNavigationUrl(item)}
                    target={item.target}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <nav className="md:hidden py-4 border-t">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                href={getNavigationUrl(item)}
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-slate-600"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
```

---

## Step 6: Add New Navigation Item in Directus

1. Go to Directus Admin → Navigation collection
2. Create new item:
   - **Title**: Display text (e.g., "Promotions")
   - **URL**: External URL (leave empty for internal)
   - **Page**: Select internal page (e.g., Promotions page)
   - **Target**: `_self` or `_blank`
   - **Sort**: Order number (lower = first)
   - **Parent**: Leave empty for top-level

3. For dropdown menus, set **Parent** to the parent item

---

## Navigation Types

| Type | URL Field | Page Field |
|------|-----------|------------|
| Internal page | Empty | Select page |
| External link | Full URL | Empty |
| Dropdown parent | Empty | Empty |
| Anchor link | `#section-id` | Empty |

---

## Quick Checklist

- [ ] Navigation item created in Directus
- [ ] Title is concise and clear
- [ ] URL or Page is set (not both)
- [ ] Sort order is correct
- [ ] Children nested under parent (if dropdown)
- [ ] Target set correctly (`_blank` for external)
- [ ] Page exists and is published (if internal)
- [ ] Test on mobile and desktop
