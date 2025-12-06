# AuraBuild Workflow

When converting AuraBuild HTML exports to Next.js:

## Process
1. **Extract component structure** from HTML sections
2. **Create block types** in `lib/types.ts` matching the design
3. **Build React components** in `components/blocks/`
4. **Create Directus collection** for the block in admin panel
5. **Add data fetching function** in `lib/data.ts`
6. **Wire up to page** via block rendering pattern

## Conversion Rules

| AuraBuild | Next.js |
|-----------|---------|
| `class=""` | `className=""` |
| `<img src="">` | `<img src={getFileUrl(data.image)}` |
| `<a href="">` | `<Link href="">` for internal |
| Inline styles | Tailwind classes |
| Static text | `{data.field}` from CMS |
| `onclick=""` | `onClick={}` handler |
| `for=""` | `htmlFor=""` |

## Color Mapping

| AuraBuild | Project |
|-----------|---------|
| `gray-*` | `slate-*` |
| `blue-*` | `cyan-*` |
| Primary | `cyan-600` |
| Text dark | `slate-900` |
| Text body | `slate-600` |

## Important
- Do NOT copy HTML directly
- Convert to proper React/Tailwind components
- Replace static content with CMS fields
- Ensure mobile-first responsive design

See `reference/05_aurabuild_conversion.md` for detailed guide.
