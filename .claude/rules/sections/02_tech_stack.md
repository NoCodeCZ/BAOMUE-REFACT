# Tech Stack

## Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.x | App Router, SSR/SSG |
| React | 18.3.x | UI components |
| TypeScript | 5.6.x | Type safety |
| Tailwind CSS | 3.4.x | Styling |
| Lucide React | 0.454.x | Icons |

## Backend (Headless CMS)
| Technology | Version | Purpose |
|------------|---------|---------|
| Directus | 16.x | Headless CMS |
| @directus/sdk | 16.x | API client |

## Analytics (Tier 1 + Tier 2)
| Tool | Purpose | Required |
|------|---------|----------|
| Google Tag Manager | Container for all tracking | Always |
| Google Analytics 4 | Traffic & behavior | Always |
| Google Search Console | SEO monitoring | Always |
| next-sitemap | Auto sitemap generation | Always |
| Google Ads Conversion | Paid ads tracking | If running ads |
| Meta Pixel | Social ads tracking | If running ads |

## Package Manager
- **npm** (use `npm ci` for CI/CD, `npm install` for local dev)
