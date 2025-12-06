# Scripts Directory

This directory contains utility scripts for managing the Directus CMS configuration.

## apply-collection-configs.js

Applies user-friendly collection configurations to your Directus instance.

### What It Does

- Updates collection metadata (icons, notes, display templates)
- Updates field metadata (notes, translations, widths, interfaces)
- Applies status field configurations with colors
- Preserves existing field types and schemas

### Prerequisites

1. **Node.js** installed (v18+)
2. **Environment variables** set in `.env.local`:
   - `NEXT_PUBLIC_DIRECTUS_URL` - Your Directus instance URL
   - `DIRECTUS_STATIC_TOKEN` - Static token with admin permissions

3. **dotenv package** (optional, for loading .env.local):
   ```bash
   npm install dotenv --save-dev
   ```

### Usage

#### Option 1: Using npm script
```bash
npm run apply-configs
```

#### Option 2: Direct execution
```bash
node scripts/apply-collection-configs.js
```

#### Option 3: With environment variables inline
```bash
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055 DIRECTUS_STATIC_TOKEN=your-token node scripts/apply-collection-configs.js
```

### What Gets Updated

The script reads `COLLECTIONS_USER_FRIENDLY.json` and applies:

**Collection Level:**
- Collection icons
- Collection notes/descriptions
- Display templates
- Archive settings

**Field Level:**
- Field notes (helpful descriptions)
- Field translations (English labels)
- Field widths (full, half)
- Status field options with colors
- Interface configurations

### Output

The script provides:
- Progress indicators for each collection
- Success/error messages for each field
- Summary of applied configurations
- Next steps after completion

### Example Output

```
🚀 Starting collection configuration application...

📡 Connecting to: http://localhost:8055
✅ Connected to Directus

📋 Found 5 collection(s) to configure

📦 Updating collection: pages
  ✅ Collection metadata updated
  📋 Updating 11 field(s)...
  📝 Updating field: title
    ✅ Field metadata updated
  ...

✅ Successfully configured: pages

📊 Summary:
   ✅ Successfully configured: 5 collection(s)
==================================================

🎉 All configurations applied successfully!
```

### Troubleshooting

**Error: NEXT_PUBLIC_DIRECTUS_URL is not set**
- Add `NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055` to `.env.local`

**Error: DIRECTUS_STATIC_TOKEN is not set**
- Add `DIRECTUS_STATIC_TOKEN=your-token` to `.env.local`
- Ensure the token has admin permissions

**Error: Failed to connect to Directus**
- Check that Directus is running
- Verify the URL is correct
- Check network/firewall settings

**Error: API Error (403)**
- Token doesn't have admin permissions
- Create a new static token with full admin access

**Some fields fail to update**
- This is normal for system fields (id, dates, etc.)
- The script continues with other fields
- Check the error messages for specific issues

### Safety

- The script **preserves** existing field types and schemas
- It only updates metadata (notes, translations, widths)
- It **does not** delete or modify field data
- Safe to run multiple times (idempotent)

### Verification

After running the script:

1. Log into Directus admin panel
2. Go to any collection (e.g., Pages)
3. Check that:
   - Collection note appears at the top
   - Field notes appear below each field
   - Status fields show colored options
   - Field labels are in English

### Rollback

If you need to revert changes:
- Use Directus admin panel to manually update fields
- Or restore from a Directus backup
- The script doesn't modify data, only metadata

---

*For more information, see `APPLY_COLLECTION_CONFIGURATIONS.md` in the project root.*

