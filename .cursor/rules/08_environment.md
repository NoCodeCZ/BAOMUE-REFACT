# Environment Variables

## Required (.env.local)
```bash
# Directus CMS
NEXT_PUBLIC_DIRECTUS_URL=https://your-directus-instance.com
DIRECTUS_STATIC_TOKEN=your-static-token

# Site
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Analytics (Tier 1)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Analytics (Tier 2 - Optional)
NEXT_PUBLIC_GADS_CONVERSION_ID=AW-XXXXXXXXX
NEXT_PUBLIC_GADS_CONVERSION_LABEL=XXXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXX

# Webhook
REVALIDATION_SECRET=your-secret-key
```

## Environment Variable Naming
- `NEXT_PUBLIC_*` - Exposed to browser (public)
- No prefix - Server-only (secrets)

## Per-Environment Files
```
.env                # Default values (committed)
.env.local          # Local overrides (gitignored)
.env.production     # Production values (CI/CD)
```
