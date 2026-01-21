# Development Commands

## Core Commands
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Project-Specific Commands
```bash
# Apply Directus collection configs
npm run apply-configs

# Generate sitemap (after build)
npx next-sitemap
```

## Useful Development Commands
```bash
# Type checking without emit
npx tsc --noEmit

# Check for unused dependencies
npx depcheck

# Analyze bundle size
ANALYZE=true npm run build
```

## Git Workflow
```bash
# Before committing
npm run lint
npm run build

# Commit message format
git commit -m "feat: add booking form component"
git commit -m "fix: resolve mobile menu z-index"
git commit -m "docs: update API documentation"
```
