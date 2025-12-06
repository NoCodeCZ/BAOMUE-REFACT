# Quick Guide: Applying Collection Configurations

## Quick Start

### 1. Install dotenv (optional but recommended)
```bash
npm install dotenv --save-dev
```

### 2. Ensure environment variables are set

Create or update `.env.local`:
```env
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_STATIC_TOKEN=your-admin-token-here
```

**Important:** The token must have **admin permissions** to update collections and fields.

### 3. Run the script

```bash
npm run apply-configs
```

Or directly:
```bash
node scripts/apply-collection-configs.js
```

## What the Script Does

✅ Updates collection metadata:
- Icons
- Notes/descriptions
- Display templates
- Archive settings

✅ Updates field metadata:
- Helpful notes below each field
- English translations for field labels
- Field widths (full, half)
- Status field colors and options
- Interface configurations

✅ Preserves existing:
- Field types
- Field schemas
- Field data
- Relationships

## Requirements

- **Node.js 18+** (for built-in fetch) OR Node.js with `node-fetch` installed
- **Directus instance** running and accessible
- **Admin token** with permissions to update collections and fields

## Getting an Admin Token

1. Log into Directus admin panel
2. Go to **Settings** → **Access Tokens**
3. Click **Create Token**
4. Set:
   - **Name**: "Config Script Token"
   - **Permissions**: Admin (full access)
   - **Expiration**: Set as needed (or leave empty for no expiration)
5. Copy the token and add to `.env.local`

## Verification

After running the script:

1. **Log into Directus**
2. **Go to Pages collection**
3. **Check that:**
   - Collection note appears: "Manage all pages on your website..."
   - Field notes appear below fields
   - Status field shows colored options
   - Field labels are in English

## Troubleshooting

### "fetch is not available"
- **Solution**: Use Node.js 18+ or install node-fetch:
  ```bash
  npm install node-fetch@2
  ```

### "API Error (403)"
- **Solution**: Token doesn't have admin permissions
- Create a new token with full admin access

### "Failed to connect"
- **Solution**: 
  - Check Directus is running
  - Verify URL in `.env.local`
  - Check network/firewall

### "Field not found"
- **Solution**: This is normal for some fields
- The script continues with other fields
- Check if the field exists in your Directus instance

## What Gets Updated

The script reads `COLLECTIONS_USER_FRIENDLY.json` and applies configurations for:

- ✅ Pages
- ✅ Services  
- ✅ Service Categories
- ✅ Posts (Blog)
- ✅ Global Settings

## Safety

- ✅ **Safe to run multiple times** - Idempotent
- ✅ **Doesn't modify data** - Only metadata
- ✅ **Preserves field types** - Won't break existing fields
- ✅ **Non-destructive** - Can be reverted manually

## Next Steps

After applying configurations:

1. ✅ Verify in Directus admin panel
2. ✅ Test with content managers
3. ✅ Share documentation with team
4. ✅ Review field notes for accuracy

---

*For detailed information, see `scripts/README.md`*

