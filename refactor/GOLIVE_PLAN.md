# แผน Implementation สู่ Go-Live
**Baomue Website - Next.js + Directus CMS**

---

## ✅ สิ่งที่ทำเสร็จแล้ว

| รายการ | สถานะ |
|--------|-------|
| Authentication (Email/Password) | ✅ |
| Blog listing & detail pages | ✅ |
| Thai URL slug support | ✅ |
| Services section (tab ทั้งหมด) | ✅ |
| Homepage blocks rendering | ✅ |
| Assets API proxy | ✅ |

---

## 🔧 งานที่ต้องทำก่อน Go-Live

### Priority 1: Critical (ต้องทำก่อน Deploy)

#### 1.1 แก้ไข Directus Schema - Service Categories
```
ตำแหน่ง: Directus Admin > Settings > Data Model > Services
ปัญหา: services.category เป็น UUID แต่ service_categories.id เป็น Integer
วิธีแก้: 
1. ลบ field category เดิม
2. สร้าง M2O relationship ใหม่ไปยัง service_categories
3. กำหนด category ให้แต่ละ service
```

#### 1.2 ตั้งค่า Environment Variables สำหรับ Production
```env
# .env.production
NEXT_PUBLIC_DIRECTUS_URL=https://directus-toco0gwwossccs40swsocgoo.app.thit.io
DIRECTUS_EMAIL=<production-email>
DIRECTUS_PASSWORD=<production-password>

# Optional: ใช้ Static Token แทน (recommended for production)
DIRECTUS_TOKEN=<static-api-token>
```

#### 1.3 Security - เปลี่ยน Directus Password
```
ตำแหน่ง: Directus Admin > User Profile > Change Password
เหตุผล: Password ปัจจุบัน (helloworld123) ไม่ปลอดภัย
```

---

### Priority 2: Important (ควรทำ)

#### 2.1 เพิ่ม Error Handling & Loading States
```typescript
// เพิ่มใน components ที่ดึงข้อมูลจาก Directus
- Loading skeleton/spinner
- Error boundary
- Fallback content เมื่อไม่มีข้อมูล
```

#### 2.2 Image Optimization
```typescript
// ปรับปรุง Assets API
- เพิ่ม image resize parameters
- เพิ่ม caching headers
- ใช้ Next.js Image component
```

#### 2.3 SEO Optimization
```typescript
// เพิ่มใน layout.tsx และ page.tsx
- Dynamic meta tags จาก Directus
- Open Graph tags
- Sitemap generation
```

---

### Priority 3: Nice to Have

#### 3.1 Performance
- [ ] Implement ISR (Incremental Static Regeneration)
- [ ] Add Redis caching for Directus queries
- [ ] Optimize bundle size

#### 3.2 Analytics & Monitoring
- [ ] Google Analytics / Plausible
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring

#### 3.3 Content Features
- [ ] Search functionality
- [ ] Blog categories filter
- [ ] Contact form integration

---

## 📋 Go-Live Checklist

### Pre-Deploy
- [ ] แก้ไข Directus schema (service categories)
- [ ] ทดสอบทุกหน้าบน localhost
- [ ] ตั้งค่า production environment variables
- [ ] เปลี่ยน Directus password
- [ ] Build test: `npm run build`

### Deploy
- [ ] Push to production branch
- [ ] Deploy ไป Vercel / Hosting platform
- [ ] ตั้งค่า custom domain
- [ ] ตั้งค่า SSL certificate

### Post-Deploy
- [ ] ทดสอบทุกหน้าบน production
- [ ] ตรวจสอบ images/assets load ถูกต้อง
- [ ] ทดสอบเพิ่ม/แก้ไขข้อมูลจาก Directus
- [ ] ตรวจสอบ mobile responsive

---

## 🚀 Deployment Options

### Option A: Vercel (แนะนำ)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option B: Docker
```dockerfile
# สร้าง Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

---

## ⏱️ ประมาณการเวลา

| งาน | เวลา |
|-----|------|
| แก้ Directus schema | 30 นาที |
| ตั้งค่า production env | 15 นาที |
| Build & Deploy | 30 นาที |
| ทดสอบ production | 1 ชั่วโมง |
| **รวม** | **~2-3 ชั่วโมง** |

---

## 🎯 Quick Start: Go-Live ภายใน 3 ชั่วโมง

1. **ชั่วโมงที่ 1**: แก้ไข Directus schema + ตั้งค่า env
2. **ชั่วโมงที่ 2**: Build + Deploy
3. **ชั่วโมงที่ 3**: ทดสอบ + แก้ไขปัญหา

หากต้องการ Go-Live เร็วโดยไม่แก้ Directus:
- ใช้ tab "ทั้งหมด" เป็น default (ทำแล้ว)
- ซ่อน tabs หมวดหมู่อื่นชั่วคราว
