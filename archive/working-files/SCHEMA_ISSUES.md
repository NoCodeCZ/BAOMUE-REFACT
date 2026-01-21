# Directus Schema Issues Report

**Generated:** $(date)  
**Status:** ⚠️ Multiple critical issues found

## 🔴 Critical Issues

### 1. Primary Key Type Mismatches

**Issue:** Collections have inconsistent primary key types between actual schema and expected configuration.

#### `services` Collection
- **Current:** `integer` (auto-increment)
- **Expected (config):** `uuid`
- **Impact:** TypeScript types expect `number`, but config suggests `uuid`. This creates confusion and potential runtime errors.
- **Location:** `config/COLLECTIONS_USER_FRIENDLY.json` vs actual schema

#### `service_categories` Collection
- **Current:** `integer` (auto-increment)
- **Expected (config):** `uuid`
- **Impact:** Same as above - type mismatch between config and reality.

**Recommendation:** 
- Either update config files to match actual schema (`integer`), OR
- Migrate collections to use `uuid` primary keys (requires data migration)

---

### 2. Broken Relations

**Issue:** Several M2O (Many-to-One) relations are not properly configured.

#### `services.category` → `service_categories`
- **Current:** `relation.collection: null`
- **Expected:** `relation.collection: "service_categories"`
- **Impact:** Cannot link services to categories in Directus UI. The relation field exists but doesn't work.
- **Fix Required:** Create/update relation using `relations` tool

#### `services.hero_image` → `directus_files`
- **Current:** `relation.collection: null`
- **Expected:** `relation.collection: "directus_files"`
- **Impact:** Cannot upload/select images for services
- **Fix Required:** Create/update relation using `relations` tool

#### `global_settings.logo` → `directus_files`
- **Current:** `relation.collection: null`
- **Expected:** `relation.collection: "directus_files"`
- **Impact:** Cannot upload logo in global settings
- **Fix Required:** Create/update relation using `relations` tool

#### `global_settings.favicon` → `directus_files`
- **Current:** `relation.collection: null`
- **Expected:** `relation.collection: "directus_files"`
- **Impact:** Cannot upload favicon in global settings
- **Fix Required:** Create/update relation using `relations` tool

---

### 3. Type Mismatch in Relations

**Issue:** `services.category` field is `uuid` type but `service_categories.id` is `integer`.

- **Field Type:** `services.category` = `uuid`
- **Related PK:** `service_categories.id` = `integer`
- **Impact:** This relation CANNOT work. UUID field cannot reference integer primary key.
- **Fix Required:** 
  - Change `services.category` to `integer` type, OR
  - Change `service_categories.id` to `uuid` type (requires migration)

---

## 🟡 Medium Priority Issues

### 4. Missing User-Friendly UI Configuration

**Issue:** Collections may not have proper UI enhancements applied (notes, display templates, translations).

**Collections to Check:**
- All block collections (`block_*`)
- `page_blocks` (junction collection)
- `page_features`, `page_testimonials`, `page_pricing_plans`

**Impact:** Users may see technical field names instead of friendly labels, missing helpful notes, or unclear interfaces.

**Fix:** Run `npm run apply-configs` to apply configurations from `config/COLLECTIONS_USER_FRIENDLY.json`

---

### 5. Missing System Fields

**Issue:** Some collections may be missing standard system fields.

**Expected System Fields:**
- `user_created` (uuid, readonly, hidden)
- `date_created` (timestamp, readonly, hidden)
- `user_updated` (uuid, readonly, hidden)
- `date_updated` (timestamp, readonly, hidden)
- `sort` (integer, hidden) - for sortable collections

**Collections to Verify:**
- `service_categories` - appears to be missing system fields
- Block collections - need verification

---

## 🟢 Low Priority / Observations

### 6. Collection Organization

**Current State:**
- Collections exist in Directus
- Some are in "website" folder (good)
- All expected collections are present

**Note:** The folder organization could be improved for better UX.

---

## 📋 Summary of Required Fixes

### Immediate Actions Required:

1. **Fix `services.category` relation:**
   - Resolve type mismatch (uuid vs integer)
   - Create proper relation to `service_categories`

2. **Fix file relations:**
   - `services.hero_image` → `directus_files`
   - `global_settings.logo` → `directus_files`
   - `global_settings.favicon` → `directus_files`

3. **Decide on primary key strategy:**
   - Standardize on either `integer` or `uuid` for all collections
   - Update config files to match reality

4. **Apply UI configurations:**
   - Run `npm run apply-configs` to ensure all collections have user-friendly settings

---

## 🔧 Recommended Fix Order

1. **First:** Fix the `services.category` type mismatch (most critical - breaks functionality)
2. **Second:** Create missing file relations (blocks image uploads)
3. **Third:** Apply UI configurations (improves UX)
4. **Fourth:** Standardize primary keys (long-term consistency)

---

## 📝 Notes

- The schema is functional but not user-friendly
- Relations are the most critical issue - they prevent proper data linking
- Type mismatches will cause runtime errors when trying to use relations
- UI configuration is cosmetic but important for content editors

---

## ✅ What's Working

- All collections exist
- Basic field structure is correct
- Page builder blocks are set up
- Navigation structure is in place
- System collections (directus_*) are properly configured

