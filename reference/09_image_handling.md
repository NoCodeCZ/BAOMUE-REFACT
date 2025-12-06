# Image Handling

> Use this guide when working with Directus file/image assets.

## Pattern Overview

```
Directus Asset ──▶ getFileUrl() ──▶ Image URL ──▶ <img> or Next/Image
```

---

## Step 1: Use the Helper Function

The helper is in `lib/directus.ts`:

```typescript
import { getFileUrl } from "@/lib/directus";

// Usage
const imageUrl = getFileUrl(service.hero_image);
// Returns: "https://directus.example.com/assets/abc-123-def"
```

---

## Step 2: Render Images

### Basic Image

```typescript
import { getFileUrl } from "@/lib/directus";

export default function ServiceCard({ service }: { service: Service }) {
  const imageUrl = getFileUrl(service.hero_image);

  return (
    <div className="rounded-xl overflow-hidden">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={service.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-slate-200 flex items-center justify-center">
          <span className="text-slate-400">No image</span>
        </div>
      )}
    </div>
  );
}
```

**Rules:**
- Always check if `imageUrl` exists
- Provide fallback for missing images
- Use `object-cover` for consistent aspect ratio
- Add meaningful `alt` text

---

## Step 3: Image Transformations

Directus supports URL-based transformations:

```typescript
// Original image
const url = getFileUrl(image);
// https://directus.example.com/assets/abc-123

// With transformations (append query params)
const thumbnail = `${url}?width=200&height=200&fit=cover`;
const medium = `${url}?width=600&quality=80`;
const blur = `${url}?width=20&blur=10`;
```

### Common Transformations

| Parameter | Values | Example |
|-----------|--------|---------|
| `width` | pixels | `?width=400` |
| `height` | pixels | `?height=300` |
| `fit` | cover, contain, inside, outside | `?fit=cover` |
| `quality` | 1-100 | `?quality=80` |
| `format` | jpg, png, webp, avif | `?format=webp` |

---

## Step 4: Responsive Images

```typescript
export function ResponsiveImage({
  fileId,
  alt,
  className,
}: {
  fileId: string | { id: string } | null;
  alt: string;
  className?: string;
}) {
  const baseUrl = getFileUrl(fileId);
  if (!baseUrl) return null;

  return (
    <picture>
      <source
        srcSet={`${baseUrl}?width=400&format=webp 400w, ${baseUrl}?width=800&format=webp 800w`}
        type="image/webp"
      />
      <source
        srcSet={`${baseUrl}?width=400 400w, ${baseUrl}?width=800 800w`}
        type="image/jpeg"
      />
      <img
        src={`${baseUrl}?width=800`}
        alt={alt}
        className={className}
        loading="lazy"
      />
    </picture>
  );
}
```

---

## Step 5: Background Images

```typescript
export function HeroSection({ image, title }: { image: string; title: string }) {
  const imageUrl = getFileUrl(image);

  return (
    <section
      className="relative h-96 bg-cover bg-center"
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl}?width=1920&quality=80)` : undefined,
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-4xl font-bold text-white">{title}</h1>
      </div>
    </section>
  );
}
```

---

## Step 6: Next.js Image Component

For optimized images with Next.js:

```typescript
import Image from "next/image";
import { getFileUrl } from "@/lib/directus";

export function OptimizedImage({ fileId, alt }: { fileId: string; alt: string }) {
  const src = getFileUrl(fileId);
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      className="rounded-xl"
      priority={false}
    />
  );
}
```

**Note:** Requires `next.config.js` remote patterns:

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.directus.app",
      },
      {
        protocol: "https",
        hostname: "**.thit.io",
      },
    ],
  },
};
```

---

## Step 7: Avatar/Profile Images

```typescript
export function Avatar({
  image,
  name,
  size = "md",
}: {
  image?: string | { id: string };
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const imageUrl = getFileUrl(image);
  const initial = name.charAt(0).toUpperCase();

  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-xl",
  };

  if (imageUrl) {
    return (
      <img
        src={`${imageUrl}?width=128&height=128&fit=cover`}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-semibold`}
    >
      {initial}
    </div>
  );
}
```

---

## Quick Checklist

- [ ] Use `getFileUrl()` helper for all Directus images
- [ ] Check if URL exists before rendering
- [ ] Provide fallback for missing images
- [ ] Add meaningful `alt` text
- [ ] Use `object-cover` for consistent sizing
- [ ] Add `loading="lazy"` for below-fold images
- [ ] Use transformations for appropriate sizes
- [ ] Configure `next.config.js` for Next/Image
