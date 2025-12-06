# Server & Client Components

> Use this guide when deciding between server and client components, and how to build each.

## Pattern Overview

```
Server Component (default)     Client Component ("use client")
├── Fetches data              ├── Has interactivity
├── No useState/useEffect     ├── Uses React hooks
├── Can be async              ├── Event handlers
└── Renders on server         └── Renders on client
```

---

## Decision Tree

```
Does the component need...
│
├── useState, useEffect, or other hooks? ──▶ Client Component
├── onClick, onChange, or event handlers? ──▶ Client Component
├── Browser APIs (window, localStorage)? ──▶ Client Component
├── Third-party libraries needing browser? ──▶ Client Component
│
└── None of the above? ──▶ Server Component (default)
```

---

## Server Component Pattern

```typescript
// components/ServicesList.tsx
import { getServices } from "@/lib/data";
import { getFileUrl } from "@/lib/directus";
import Link from "next/link";

export default async function ServicesList() {
  const services = await getServices();

  if (!services.length) {
    return <p className="text-slate-500">No services available.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <Link
          key={service.id}
          href={`/services/${service.slug}`}
          className="block bg-white rounded-xl shadow-sm hover:shadow-md transition"
        >
          {service.hero_image && (
            <img
              src={getFileUrl(service.hero_image) || ""}
              alt={service.name}
              className="w-full h-48 object-cover rounded-t-xl"
            />
          )}
          <div className="p-4">
            <h3 className="font-semibold text-slate-900">{service.name}</h3>
            <p className="text-slate-600 text-sm mt-2">
              {service.short_description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
```

**Rules:**
- Use `async` function for data fetching
- No `"use client"` directive
- Fetch data directly in component
- Can use `await` for async operations

---

## Client Component Pattern

```typescript
// components/MobileMenu.tsx
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import type { NavigationItem } from "@/lib/types";

interface MobileMenuProps {
  items: NavigationItem[];
}

export default function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-600"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <nav className="absolute top-full left-0 right-0 bg-white shadow-lg">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.url || "#"}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 border-b text-slate-700 hover:bg-slate-50"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
```

**Rules:**
- Add `"use client"` at top of file
- Receive data via props (don't fetch)
- Use hooks for state management
- Handle events with arrow functions

---

## Hybrid Pattern (Server + Client)

Split into server wrapper and client interactive part:

```typescript
// components/Header.tsx (Server)
import { getNavigationItems, getGlobalSettings } from "@/lib/data";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const navigationItems = await getNavigationItems();
  const settings = await getGlobalSettings();

  return (
    <HeaderClient
      navigationItems={navigationItems}
      siteName={settings?.site_name || "Clinic"}
      logo={settings?.logo}
    />
  );
}
```

```typescript
// components/HeaderClient.tsx (Client)
"use client";

import { useState } from "react";
import Link from "next/link";
import type { NavigationItem } from "@/lib/types";

interface HeaderClientProps {
  navigationItems: NavigationItem[];
  siteName: string;
  logo?: string;
}

export default function HeaderClient({
  navigationItems,
  siteName,
  logo,
}: HeaderClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      {/* Interactive header content */}
    </header>
  );
}
```

**Rules:**
- Server component fetches data
- Client component receives via props
- Name client component with `Client` suffix
- Keep data fetching in server component

---

## Passing Server Data to Client

```typescript
// ✅ Correct: Pass serializable data
<ClientComponent
  items={items}                    // Array of objects
  title={settings.title}           // String
  count={items.length}             // Number
  isActive={true}                  // Boolean
/>

// ❌ Wrong: Cannot pass functions or non-serializable
<ClientComponent
  onClick={handleClick}            // Functions don't serialize
  date={new Date()}                // Dates need conversion
  fetchData={fetchData}            // Functions don't serialize
/>
```

---

## Quick Checklist

**For Server Components:**
- [ ] No `"use client"` directive
- [ ] Uses `async function`
- [ ] Fetches data directly
- [ ] No React hooks
- [ ] No event handlers

**For Client Components:**
- [ ] Has `"use client"` at top
- [ ] Receives data via props
- [ ] Uses hooks if needed
- [ ] Handles events properly
- [ ] Named with `Client` suffix (if paired)

**For Hybrid:**
- [ ] Server component fetches data
- [ ] Client component receives props
- [ ] Only serializable data passed
- [ ] Clear separation of concerns
