# Setup Instructions

## Prerequisites

- Node.js 18+
- Directus instance (local or cloud)
- npm

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_STATIC_TOKEN=your-token-here
```

**Get a Directus Token:**
1. Directus Admin → Settings → Access Tokens
2. Create Token with read permissions
3. Copy to `.env.local`

### 3. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── page.tsx            # Homepage
│   ├── services/           # Services pages
│   └── blog/               # Blog pages
├── components/             # React components
├── lib/
│   ├── directus.ts         # Directus client
│   ├── data.ts             # Data fetching
│   └── types.ts            # TypeScript types
├── config/                 # Directus configs
└── reference/              # Dev guides
```

## Directus Permissions

Grant read access to:
- `pages`, `page_blocks`
- All `block_*` collections
- `services`, `service_categories`
- `navigation`, `global_settings`

## Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Run linting
```

## Troubleshooting

**Cannot connect to Directus:**
- Check `NEXT_PUBLIC_DIRECTUS_URL` is correct
- Ensure Directus is running

**Permission errors:**
- Verify token has read permissions
- Check collection permissions in Directus

**Styles not loading:**
- Run `npm install`
- Verify `globals.css` imported in `layout.tsx`
