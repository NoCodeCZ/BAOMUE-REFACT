# Website - Next.js + Directus CMS

A modern, block-based website built with Next.js 14 and Directus CMS.

## Features

- 🚀 Next.js 14 with App Router
- 💾 Directus CMS integration
- 🎨 Tailwind CSS for styling
- 📱 Fully responsive design
- 🔄 Server Components for optimal performance
- 🧩 Block-based page builder structure

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Directus instance running
- Environment variables configured

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create `.env.local`:
```env
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_STATIC_TOKEN=your-static-token-here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── blog/              # Blog pages
│   ├── services/          # Service pages
│   └── ...
├── components/            # React components
│   └── README.md          # Component documentation
├── lib/                   # Utilities and Directus client
├── config/                # Configuration files
│   ├── ALL_COLLECTIONS_COMPLETE.json  # Complete collection config
│   ├── COLLECTIONS_USER_FRIENDLY.json  # UI enhancement config
│   └── README.md          # Config documentation
├── docs/                  # Documentation
│   ├── USER_GUIDE.md
│   ├── QUICK_REFERENCE.md
│   ├── COLLECTION_GUIDES/
│   └── ...
├── reference/             # Developer reference guides
├── scripts/               # Utility scripts
│   └── apply-collection-configs.js
├── archive/               # Archived/unused files (for reference)
│   ├── old-configs/       # Outdated configuration files
│   ├── working-files/     # Temporary working documents
│   ├── plans/             # Planning documents
│   └── reference-files/   # Original HTML reference files
└── package.json
```

## Documentation

All documentation is organized in the `docs/` directory:

- **[docs/USER_GUIDE.md](docs/USER_GUIDE.md)** - Complete user manual for content managers
- **[docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)** - Quick reference card
- **[docs/DOCUMENTATION_INDEX.md](docs/DOCUMENTATION_INDEX.md)** - Complete documentation index
- **[docs/COLLECTION_GUIDES/](docs/COLLECTION_GUIDES/)** - Collection-specific guides

### For Content Managers

Start with the [User Guide](docs/USER_GUIDE.md) to learn how to:
- Edit homepage content
- Add and manage services
- Create blog posts
- Update navigation menus
- Change site settings
- Use the page builder

### For Developers

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System architecture
- [docs/SETUP.md](docs/SETUP.md) - Setup instructions
- [docs/INTEGRATION_PLAN.md](docs/INTEGRATION_PLAN.md) - Integration plan

## Directus Collections

The website uses the following Directus collections:

- **pages** - Main pages
- **page_blocks** - Junction table for blocks (M2A)
- **block_*** - Content blocks (hero, about_us, why_choose_us, team, signature_treatment, safety_banner, services, locations, booking, contact, features, testimonials, pricing, footer)
- **services** - Service offerings
- **service_categories** - Service organization
- **blog_posts** - Blog posts and articles
- **blog_categories** - Blog post categories
- **global_settings** - Site-wide settings
- **navigation** - Menu items

See [docs/COLLECTION_SETUP_GUIDE.md](docs/COLLECTION_SETUP_GUIDE.md) for complete collection setup information.

## Configuration

### Applying Collection Configurations

To apply user-friendly collection configurations to Directus:

```bash
npm run apply-configs
```

This updates collection metadata (notes, translations, display templates) in Directus. See [config/README.md](config/README.md) for details.

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Environment Variables

- `NEXT_PUBLIC_DIRECTUS_URL` - Your Directus instance URL
- `DIRECTUS_STATIC_TOKEN` - Static token for API access

## License

MIT







