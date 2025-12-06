# Analytics Event Tracking

> Use this guide when adding GTM/GA4 event tracking to user interactions.

## Pattern Overview

```
User Action ──▶ trackEvent() ──▶ dataLayer.push() ──▶ GTM ──▶ GA4/Google Ads
```

---

## Step 1: Set Up Analytics Infrastructure

Create `lib/analytics/events.ts`:

```typescript
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  }
}

// Pre-defined events for consistency
export const events = {
  bookingClick: (service?: string, location?: string) =>
    trackEvent("booking_click", { service, location }),

  phoneClick: (location: string) =>
    trackEvent("phone_click", { location }),

  formSubmit: (formName: string) =>
    trackEvent("form_submit", { form_name: formName }),

  serviceView: (serviceName: string, serviceId: number) =>
    trackEvent("service_view", { service_name: serviceName, service_id: serviceId }),

  promotionClick: (promoName: string) =>
    trackEvent("promotion_click", { promo_name: promoName }),
};
```

---

## Step 2: Add Event to Client Component

```typescript
"use client";
import { events } from "@/lib/analytics/events";

export function BookingButton({ service }: { service: string }) {
  const handleClick = () => {
    events.bookingClick(service, "service_page");
  };

  return (
    <a
      href="/contact"
      onClick={handleClick}
      className="btn-primary"
    >
      Book Appointment
    </a>
  );
}
```

**Rules:**
- Only track in client components (`"use client"`)
- Call tracking BEFORE navigation
- Include contextual parameters
- Use pre-defined event functions

---

## Step 3: Track Page Views (Automatic)

GTM handles page views automatically. For SPA navigation tracking, add to `app/layout.tsx`:

```typescript
"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/events";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("page_view", { page_path: pathname });
  }, [pathname]);

  return null;
}
```

---

## Common Events Reference

| Event | When to Fire | Parameters |
|-------|--------------|------------|
| `booking_click` | User clicks booking CTA | `service`, `location` |
| `phone_click` | User clicks phone number | `location` |
| `form_submit` | Form submitted successfully | `form_name` |
| `service_view` | Service detail page loads | `service_name`, `service_id` |
| `promotion_click` | User clicks promotion | `promo_name` |
| `location_click` | User clicks clinic location | `branch_name` |
| `social_click` | User clicks social link | `platform` |

---

## Step 4: Configure in GTM

For each event, create a GTM trigger and tag:

1. **Trigger**: Custom Event → Event name matches (e.g., `booking_click`)
2. **Tag**: GA4 Event → Event name: `booking_click`
3. **Variables**: Create Data Layer variables for parameters

---

## Conversion Tracking (Google Ads)

For conversion events, add conversion tracking:

```typescript
export function trackConversion(conversionLabel: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", {
      send_to: `${process.env.NEXT_PUBLIC_GADS_CONVERSION_ID}/${conversionLabel}`,
    });
  }
}
```

Call after successful form submission:

```typescript
const handleFormSubmit = async () => {
  const success = await submitForm(data);
  if (success) {
    events.formSubmit("contact");
    trackConversion("CONVERSION_LABEL_HERE");
  }
};
```

---

## Quick Checklist

- [ ] Event function added to `lib/analytics/events.ts`
- [ ] Client component uses `"use client"` directive
- [ ] Event fires on correct user action
- [ ] Parameters provide useful context
- [ ] GTM trigger configured for event
- [ ] GA4 tag configured for event
- [ ] Tested in GTM Preview mode
- [ ] Conversion tracking added (if applicable)
