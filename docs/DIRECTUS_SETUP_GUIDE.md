# Directus CMS Setup Guide

**Project:** Baomue Website  
**Last Updated:** 2024-12-19

## Overview

โปรเจกต์นี้ใช้ **Directus CMS** เป็น backend สำหรับจัดการเนื้อหา (Content Management System) โดยใช้:
- **@directus/sdk v16.0.0** - Directus JavaScript SDK
- **Static Token Authentication** - สำหรับ server-side API calls
- **REST API** - สำหรับดึงข้อมูลจาก Directus

---

## Environment Variables Required

### 1. สร้างไฟล์ `.env.local`

สร้างไฟล์ `.env.local` ใน root directory ของโปรเจกต์:

```env
# Directus CMS Configuration
NEXT_PUBLIC_DIRECTUS_URL=https://your-directus-instance.com
DIRECTUS_STATIC_TOKEN=your-static-token-here

# Optional: Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Optional: Placeholder Image
DIRECTUS_PLACEHOLDER_IMAGE_ID=uuid-of-placeholder-image

# Optional: Analytics
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Optional: Webhook Revalidation
REVALIDATION_SECRET=your-secret-key
```

### 2. วิธีหา Directus URL และ Token

#### Directus URL
- **Local Development:** `http://localhost:8055`
- **Cloud/Production:** URL ของ Directus instance ของคุณ (เช่น `https://directus.yourdomain.com`)

#### Static Token
1. เข้าสู่ Directus Admin Panel
2. ไปที่ **Settings** → **Access Tokens**
3. คลิก **Create Token**
4. ตั้งชื่อ token (เช่น "Website Static Token")
5. เลือก **Permissions:**
   - ✅ Read access สำหรับ collections ที่ต้องการ
6. คัดลอก token ที่สร้างขึ้น
7. วางใน `.env.local` เป็นค่า `DIRECTUS_STATIC_TOKEN`

---

## Directus Client Configuration

### File: `lib/directus.ts`

```typescript
import { createDirectus, rest, staticToken } from '@directus/sdk';

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const directusToken = process.env.DIRECTUS_STATIC_TOKEN;

const directus = createDirectus<Schema>(directusUrl)
  .with(rest())
  .with(staticToken(directusToken));
```

**Features:**
- ✅ Safe fallback - App ยังรันได้แม้ Directus ยังไม่ได้ตั้งค่า
- ✅ Type-safe - ใช้ TypeScript Schema types
- ✅ Error handling - มี warning messages เมื่อ config ไม่ครบ

---

## Collections ที่ใช้ในโปรเจกต์

### Core Collections

#### 1. Pages & Blocks
- `pages` - หน้าเว็บไซต์
- `page_blocks` - Junction table สำหรับเชื่อม pages กับ blocks (M2A)
- `block_*` - Content blocks (22+ types)

#### 2. Content Blocks (22+ types)
- `block_hero` - Hero section
- `block_text` - Text content
- `block_about_us` - About Us section
- `block_why_choose_us` - Why Choose Us
- `block_team` - Team/Dentists
- `block_signature_treatment` - Signature treatment
- `block_safety_banner` - Safety banner
- `block_services` - Services grid
- `block_locations` - Locations
- `block_booking` - Booking form
- `block_contact` - Contact info
- `block_form` - Form block
- `block_footer` - Footer
- `block_features` - Features
- `block_testimonials` - Testimonials
- `block_pricing` - Pricing
- `block_promotions` - Promotions
- `block_portfolio` - Portfolio
- `block_blog_listing` - Blog listing
- `block_service_detail` - Service detail
- `block_stats` - Statistics
- `block_page_header` - Page header

#### 3. Services
- `services` - บริการทันตกรรม
- `service_categories` - หมวดหมู่บริการ

#### 4. Blog
- `blog_posts` - บทความ
- `blog_categories` - หมวดหมู่บทความ

#### 5. Promotions
- `promotions` - โปรโมชั่น
- `promotion_categories` - หมวดหมู่โปรโมชั่น

#### 6. Portfolio
- `portfolio_cases` - ผลงานเคส
- `portfolio_categories` - หมวดหมู่ผลงาน

#### 7. Forms
- `forms` - Form definitions
- `form_fields` - Form fields
- `form_submissions` - Form responses

#### 8. System
- `navigation` - เมนูนำทาง
- `global_settings` - ตั้งค่าเว็บไซต์

---

## Permissions Required

### Static Token ต้องมี Read Permission สำหรับ:

✅ **Required:**
- `pages`
- `page_blocks`
- All `block_*` collections
- `services`
- `service_categories`
- `navigation`
- `global_settings`

✅ **Optional (if used):**
- `blog_posts`
- `blog_categories`
- `promotions`
- `promotion_categories`
- `portfolio_cases`
- `portfolio_categories`
- `forms`
- `form_fields`

### Write Permissions (if using forms):
- `form_submissions` - สำหรับบันทึก form submissions

---

## Data Fetching Pattern

### Example: Fetching Homepage

```typescript
// lib/data.ts
import directus from './directus';
import { readItems } from '@directus/sdk';

// 1. Get page by slug
const page = await getPageBySlug('home');

// 2. Get page blocks
const blocks = await getPageBlocks(page.id);

// 3. Get block content
const blockContent = await getBlockContent(block.collection, block.item);
```

### Optimized Pattern (Recommended)

```typescript
// Use optimized functions
const result = await getPageWithBlocks('home');
// or
const result = await getPageWithBlocksBatched('home');
```

**Benefits:**
- ลดจำนวน queries จาก 12-17 เป็น 1-3 queries
- เพิ่มความเร็วในการโหลดหน้า
- ลด payload size

---

## Image Handling

### File URL Helper

```typescript
import { getFileUrl } from '@/lib/directus';

// Get image URL from Directus file ID
const imageUrl = getFileUrl(fileId);
// Returns: /api/directus-assets/{fileId}
```

### Image Proxy API

ไฟล์: `app/api/directus-assets/[id]/route.ts`

**Purpose:**
- Proxy images จาก Directus ด้วย authentication
- ป้องกันการ expose token ใน URLs
- จัดการ CORS issues

**Usage:**
- Images จะถูก proxy ผ่าน `/api/directus-assets/{id}`
- ไม่ต้องระบุ Directus URL ใน frontend

---

## Health Check

### Check Directus Connection

```typescript
import { checkDirectusConnection, getDirectusHealthStatus } from '@/lib/directus';

// Simple check
const isHealthy = await checkDirectusConnection();

// Detailed status
const status = await getDirectusHealthStatus();
// Returns: { healthy: boolean, url: string, timestamp: string, error?: string }
```

---

## Configuration Scripts

### Apply Collection Configs

```bash
npm run apply-configs
```

**What it does:**
- อัปเดต collection metadata (notes, translations, display templates)
- ใช้ไฟล์: `config/COLLECTIONS_USER_FRIENDLY.json`

### Organize Collections

```bash
npm run organize-collections
```

**What it does:**
- จัดกลุ่ม collections เป็น folders
- ซ่อน junction tables
- เพิ่ม icons และ notes

---

## Troubleshooting

### ❌ Cannot connect to Directus

**Symptoms:**
- Warning: `[Directus] NEXT_PUBLIC_DIRECTUS_URL is not defined`
- Error: `Client is not configured`

**Solutions:**
1. ตรวจสอบว่า `.env.local` มีอยู่และมีค่าถูกต้อง
2. ตรวจสอบ `NEXT_PUBLIC_DIRECTUS_URL` ว่าถูกต้อง
3. ตรวจสอบว่า Directus instance ทำงานอยู่
4. Restart dev server หลังจากแก้ไข `.env.local`

### ❌ Permission errors

**Symptoms:**
- Error: `You don't have permission to access this.`
- 403 Forbidden errors

**Solutions:**
1. ตรวจสอบว่า Static Token มี read permissions
2. ตรวจสอบ collection permissions ใน Directus
3. ตรวจสอบว่า token ยังไม่หมดอายุ

### ❌ Images not loading

**Symptoms:**
- Images แสดงเป็น broken links
- 404 errors สำหรับ images

**Solutions:**
1. ตรวจสอบว่า `getFileUrl()` ถูกเรียกใช้
2. ตรวจสอบว่า API route `/api/directus-assets/[id]` ทำงาน
3. ตรวจสอบว่า file ID เป็น UUID ที่ถูกต้อง
4. ตรวจสอบ file permissions ใน Directus

### ❌ Data not updating

**Symptoms:**
- ข้อมูลในเว็บไซต์ไม่ update หลังจากแก้ไขใน Directus

**Solutions:**
1. ตรวจสอบ ISR revalidate time (default: 60 seconds)
2. ใช้ revalidation webhook: `/api/revalidate`
3. Hard refresh browser (Ctrl+Shift+R)

---

## Best Practices

### 1. Environment Variables
- ✅ ใช้ `.env.local` สำหรับ local development
- ✅ อย่า commit `.env.local` (อยู่ใน `.gitignore`)
- ✅ ใช้ environment-specific files สำหรับ production

### 2. Token Security
- ✅ ใช้ Static Token แทน User Token
- ✅ จำกัด permissions เฉพาะที่จำเป็น
- ✅ หมุนเวียน token เป็นระยะ

### 3. Query Optimization
- ✅ ใช้ `getPageWithBlocks()` แทน multiple queries
- ✅ ระบุ fields เฉพาะเจาะจงแทน `['*']`
- ✅ ใช้ ISR (Incremental Static Regeneration)

### 4. Error Handling
- ✅ ใช้ `logDirectusError()` สำหรับ error logging
- ✅ มี fallback UI เมื่อ Directus unavailable
- ✅ Handle null/undefined data gracefully

---

## Related Documentation

- `docs/SETUP.md` - Setup instructions
- `docs/DIRECTUS_ORGANIZATION.md` - Collection organization
- `docs/COLLECTION_SETUP_GUIDE.md` - Collection setup
- `lib/directus.ts` - Directus client implementation
- `lib/data.ts` - Data fetching functions

---

## Quick Reference

### Required Environment Variables
```env
NEXT_PUBLIC_DIRECTUS_URL=https://your-directus.com
DIRECTUS_STATIC_TOKEN=your-token
```

### Check Connection
```typescript
const healthy = await checkDirectusConnection();
```

### Fetch Page Data
```typescript
const result = await getPageWithBlocks('home');
```

### Get File URL
```typescript
const imageUrl = getFileUrl(fileId);
```

---

**Need Help?** ดูเอกสารเพิ่มเติมใน `docs/` directory


