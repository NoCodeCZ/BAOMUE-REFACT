# Components

React components for the website.

## Active Components

These components are currently used in the application:

- **Header.tsx** - Main header component (server component)
- **HeaderClient.tsx** - Client-side header with navigation
- **ArticleCard.tsx** - Blog post card component
- **BlogNavigation.tsx** - Blog category navigation
- **FeaturedArticle.tsx** - Featured blog article display
- **PromotionsCarousel.tsx** - Promotions carousel component

## Legacy Components

These components exist but are not currently imported in the codebase. The home page (`app/page.tsx`) has inline implementations instead. They are kept for potential future refactoring:

- **Features.tsx** - Features section component
- **Footer.tsx** - Footer component
- **Hero.tsx** - Hero section component
- **Navbar.tsx** - Navigation bar component
- **Pricing.tsx** - Pricing section component
- **Testimonials.tsx** - Testimonials section component

## Future Refactoring

Consider refactoring `app/page.tsx` to use these component files for better code organization and reusability.

