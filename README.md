# Baomue Dental Clinic Website

> 🦷 Modern, premium dental clinic website built with **Next.js 14** + **Directus CMS**

A complete, production-ready website framework featuring a block-based page builder, dynamic content management, and beautiful responsive design.

---

## ✨ Features

### Core Technology
- 🚀 **Next.js 14** with App Router & Server Components
- 💾 **Directus CMS** for headless content management
- 🎨 **Tailwind CSS** with custom design system
- 📱 **Fully responsive** - mobile-first design
- ⚡ **Optimized performance** - Server Components & lazy loading
- 🔒 **Secure API** - Token-based authentication

### Content Management
- 🧩 **Block-based Page Builder** - 22+ reusable content blocks
- 📝 **Blog System** - Categories, Thai slug support, featured images
- 🏥 **Services Management** - Categories, detailed pages, image galleries
- 🎁 **Promotions** - Carousel display with active/expired status
- 📍 **Multi-location** - Branch information with maps
- 👨‍⚕️ **Team Profiles** - Staff and dentist profiles
- 📊 **Portfolio/Our Work** - Before/after galleries with categories

### SEO & Performance
- 🔍 **Auto-generated Sitemap** - next-sitemap integration
- 📃 **Dynamic Meta Tags** - Per-page SEO
- 🖼️ **Optimized Images** - Directus asset proxy with authentication

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Directus instance (hosted or self-hosted)
- Environment variables configured

### Installation

```bash
# Clone the repository
git clone https://github.com/taciosoftdev/baomue-refactor.git
cd baomue-refactor

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your Directus credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes (asset proxy)
│   ├── blog/              # Blog listing & detail pages
│   ├── services/          # Service listing & detail pages
│   ├── our-work/          # Portfolio page
│   ├── promotions/        # Promotions page
│   ├── contact/           # Contact page
│   └── [...slug]/         # Dynamic page builder
├── components/
│   ├── blocks/            # 22 reusable content blocks
│   ├── services/          # Service-specific components
│   └── skeletons/         # Loading states
├── lib/
│   ├── directus.ts        # Directus client & auth
│   ├── data.ts            # Data fetching functions
│   └── types.ts           # TypeScript interfaces
├── config/                # Directus collection configs
├── docs/                  # Documentation
├── reference/             # Developer guides
├── scripts/               # Utility scripts
└── public/                # Static assets
```

---

## 🧩 Available Content Blocks

| Block | Description |
|-------|-------------|
| `HeroBlock` | Main hero section with background image |
| `AboutUsBlock` | About section with images |
| `ServicesBlock` | Service categories & cards |
| `WhyChooseUsBlock` | Features & benefits |
| `TeamBlock` | Dentist/staff profiles |
| `SignatureTreatmentBlock` | Featured treatments |
| `SafetyBannerBlock` | Safety & trust indicators |
| `LocationsBlock` | Branch locations with maps |
| `BookingBlock` | Appointment booking CTA |
| `ContactBlock` | Contact form & info |
| `TestimonialsBlock` | Customer reviews |
| `StatsBlock` | Statistics & numbers |
| `PromotionsBlock` | Promotional carousel |
| `PortfolioBlock` | Before/after gallery |
| `BlogListingBlock` | Blog posts grid |
| `ServiceDetailBlock` | Full service detail page |
| `FormBlock` | Dynamic forms |
| `TextBlock` | Rich text content |

---

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
# Directus Configuration
NEXT_PUBLIC_DIRECTUS_URL=https://your-directus.example.com
DIRECTUS_EMAIL=admin@example.com
DIRECTUS_PASSWORD=your-password

# Optional: Static token (if not using email/password)
# DIRECTUS_STATIC_TOKEN=your-static-token
```

### Directus Collections

Required collections in Directus:

| Collection | Purpose |
|------------|---------|
| `pages` | Main pages |
| `page_blocks` | Junction table (M2A) |
| `block_*` | Content blocks |
| `services` | Service items |
| `service_categories` | Service grouping |
| `blog_posts` | Blog articles |
| `blog_categories` | Blog grouping |
| `promotions` | Promotional content |
| `portfolio_items` | Before/after cases |
| `team_members` | Staff profiles |
| `locations` | Branch info |
| `global_settings` | Site-wide settings |
| `navigation` | Menu items |

See [docs/DIRECTUS_SCHEMA_REQUIREMENTS.md](docs/DIRECTUS_SCHEMA_REQUIREMENTS.md) for complete schema.

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run apply-configs` | Apply Directus collection configs |
| `npm run organize-collections` | Organize Directus collections |

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [docs/USER_GUIDE.md](docs/USER_GUIDE.md) | Content manager guide |
| [docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md) | Quick reference card |
| [docs/DIRECTUS_SCHEMA_REQUIREMENTS.md](docs/DIRECTUS_SCHEMA_REQUIREMENTS.md) | Database schema |
| [CLAUDE.md](CLAUDE.md) | AI development rules |

### Developer Reference Guides

Located in `reference/` directory:
- Creating Directus blocks
- Adding new pages
- Data fetching patterns
- Analytics integration
- SEO metadata
- Image handling
- And more...

---

## 🔄 Recent Updates (January 2025)

- ✅ Fixed Directus API authentication (lazy login)
- ✅ Fixed blog page with Thai slug support
- ✅ Fixed services category filtering
- ✅ Added "All" tab for services section
- ✅ Improved error handling & loading states
- ✅ Cleaned up old documentation files
- ✅ Added service detail seed data

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14.2.18 |
| CMS | Directus (via @directus/sdk) |
| Styling | Tailwind CSS 3.4 |
| Icons | Lucide React |
| Language | TypeScript 5.6 |
| SEO | next-sitemap |

---

## 📄 License

MIT

---

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with ❤️ for Baomue Dental Clinic**
