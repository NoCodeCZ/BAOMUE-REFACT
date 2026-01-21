# Analytics Implementation

## GTM Setup (Required for all projects)
```tsx
// lib/analytics/gtm.tsx
"use client";
import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export function GTMScript() {
  if (!GTM_ID) return null;

  return (
    <>
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
    </>
  );
}

export function GTMNoScript() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
```

## Event Tracking Helper
```typescript
// lib/analytics/events.ts
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  }
}

// Usage examples:
// trackEvent("booking_click", { service: "teeth-whitening" });
// trackEvent("phone_click", { location: "header" });
// trackEvent("form_submit", { form_name: "contact" });
```

## Analytics Config (Per-Client)
```typescript
// config/analytics.config.ts
export const analyticsConfig = {
  gtm: {
    enabled: true,
    containerId: process.env.NEXT_PUBLIC_GTM_ID,
  },
  googleAds: {
    enabled: process.env.NEXT_PUBLIC_GADS_CONVERSION_ID ? true : false,
    conversionId: process.env.NEXT_PUBLIC_GADS_CONVERSION_ID,
    conversionLabel: process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL,
  },
  metaPixel: {
    enabled: process.env.NEXT_PUBLIC_META_PIXEL_ID ? true : false,
    pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  },
};
```

## Layout Integration
```tsx
// app/layout.tsx
import { GTMScript, GTMNoScript } from "@/lib/analytics/gtm";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className="scroll-smooth">
      <head>
        <GTMScript />
      </head>
      <body>
        <GTMNoScript />
        {children}
      </body>
    </html>
  );
}
```
