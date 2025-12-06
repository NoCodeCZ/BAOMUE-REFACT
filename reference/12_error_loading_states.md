# Error & Loading States

> Use this guide when implementing error boundaries, loading states, and empty states.

## Pattern Overview

```
app/
├── error.tsx      # Error boundary for route
├── loading.tsx    # Loading UI for route
├── not-found.tsx  # 404 page
└── [route]/
    ├── error.tsx      # Route-specific error
    └── loading.tsx    # Route-specific loading
```

---

## Step 1: Global Error Boundary

```typescript
// app/error.tsx
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Something went wrong
        </h1>
        <p className="text-slate-600 mb-8">
          We apologize for the inconvenience. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
```

**Rules:**
- Must be a client component (`"use client"`)
- Log error for debugging
- Provide reset functionality
- Keep UI simple and helpful

---

## Step 2: Global Loading State

```typescript
// app/loading.tsx
export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin" />
        <p className="mt-4 text-slate-500">Loading...</p>
      </div>
    </main>
  );
}
```

---

## Step 3: 404 Not Found Page

```typescript
// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition inline-block"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
```

---

## Step 4: Trigger 404 in Dynamic Routes

```typescript
// app/services/[slug]/page.tsx
import { notFound } from "next/navigation";

export default async function ServicePage({ params }) {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    notFound(); // Renders not-found.tsx
  }

  return <div>{service.name}</div>;
}
```

---

## Step 5: Empty State Pattern

```typescript
// components/EmptyState.tsx
import { FileQuestion } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <FileQuestion className="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      {description && (
        <p className="text-slate-500 mt-2">{description}</p>
      )}
      {action && (
        <a
          href={action.href}
          className="inline-block mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}
```

Usage:

```typescript
export default async function ServicesPage() {
  const services = await getServices();

  if (!services.length) {
    return (
      <EmptyState
        title="No services available"
        description="Check back later for our dental services."
        action={{ label: "Go Home", href: "/" }}
      />
    );
  }

  return <div>{/* Service list */}</div>;
}
```

---

## Step 6: Skeleton Loading Components

```typescript
// components/skeletons/ServiceCardSkeleton.tsx
export function ServiceCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-200" />
      <div className="p-4">
        <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-slate-200 rounded w-full mb-1" />
        <div className="h-4 bg-slate-200 rounded w-2/3" />
      </div>
    </div>
  );
}

export function ServiceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  );
}
```

Route-specific loading:

```typescript
// app/services/loading.tsx
import { ServiceGridSkeleton } from "@/components/skeletons/ServiceCardSkeleton";

export default function Loading() {
  return (
    <main className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="h-10 bg-slate-200 rounded w-48 mb-8 animate-pulse" />
        <ServiceGridSkeleton count={6} />
      </div>
    </main>
  );
}
```

---

## Step 7: Inline Loading States

For components with Suspense:

```typescript
import { Suspense } from "react";

export default function Page() {
  return (
    <main>
      <h1>Our Services</h1>
      <Suspense fallback={<ServiceGridSkeleton />}>
        <ServicesList />
      </Suspense>
    </main>
  );
}
```

---

## Step 8: Graceful CMS Fallbacks

Always handle missing CMS data:

```typescript
export default async function Header() {
  const navigation = await getNavigationItems();
  const settings = await getGlobalSettings();

  // Fallback data
  const navItems = navigation.length > 0 ? navigation : [
    { id: 1, title: "Home", url: "/" },
    { id: 2, title: "Services", url: "/services" },
  ];

  const siteName = settings?.site_name || "Dental Clinic";

  return <HeaderClient items={navItems} siteName={siteName} />;
}
```

---

## Quick Checklist

- [ ] `app/error.tsx` handles runtime errors
- [ ] `app/loading.tsx` shows during navigation
- [ ] `app/not-found.tsx` handles 404s
- [ ] `notFound()` called for missing items
- [ ] Empty states show when lists are empty
- [ ] Skeleton components match real content layout
- [ ] CMS data has fallbacks
- [ ] Error logging for debugging
- [ ] Reset button in error boundary
