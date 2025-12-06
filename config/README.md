# Configuration Files

This folder contains Directus collection configuration files.

## Active Files

- **ALL_COLLECTIONS_COMPLETE.json** - Complete collection configuration with all block collections, fields, and metadata. This is the source of truth for all Directus collections.

- **COLLECTIONS_USER_FRIENDLY.json** - User-friendly collection configurations with helpful notes and translations. Used by `scripts/apply-collection-configs.js` to enhance the Directus UI.

## Usage

### Apply User-Friendly Configurations

```bash
npm run apply-configs
```

This will update collection metadata (notes, translations, display templates) in Directus to make the admin interface more user-friendly.

### Creating Collections

Collections should be created in Directus first (manually or via MCP), then use `ALL_COLLECTIONS_COMPLETE.json` as a reference for field definitions.

## Note

Old configuration files have been moved to `archive/old-configs/`.

