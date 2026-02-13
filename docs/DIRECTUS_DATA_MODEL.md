# Directus Data Model - Complete Setup Guide

สรุป Collections และ Fields ที่ต้องสร้างใน Directus เพื่อให้ Frontend ทำงานได้ถูกต้อง

---

## 📋 สรุปภาพรวม Collections

| กลุ่ม | Collections | จำนวน |
|-------|-------------|-------|
| Core Pages | pages, page_blocks | 2 |
| Content Blocks | block_* (19 types) | 19 |
| Services | services, service_categories | 2 |
| Blog | blog_posts, blog_categories | 2 |
| Promotions | promotions, promotion_categories | 2 |
| Portfolio | portfolio_cases, portfolio_categories | 2 |
| Forms | forms, form_fields, form_submissions | 3 |
| Navigation | navigation | 1 |
| Team | dentists | 1 |
| Settings | global_settings | 1 |
| **รวม** | | **35 collections** |

---

## 1️⃣ Core Pages

### 1.1 `pages`
**Type:** Collection

| Field | Type | Notes |
|-------|------|-------|
| id | Integer (Auto) | Primary key |
| title | String | ชื่อหน้า |
| slug | String | URL path (unique) |
| status | String (Dropdown) | `draft`, `published` |
| seo_title | String | ไว้สำหรับ SEO |
| seo_description | Text | ไว้สำหรับ SEO |

### 1.2 `page_blocks`
**Type:** Collection (Junction table for M2A)

| Field | Type | Notes |
|-------|------|-------|
| id | Integer (Auto) | Primary key |
| page | M2O → pages | ลิงค์กับหน้า |
| collection | String | ชื่อ block collection (e.g., `block_hero`) |
| item | String | ID ของ block item |
| sort | Integer | ลำดับการแสดงผล |
| hide_block | Boolean | ซ่อน block ไหม (default: false) |

---

## 2️⃣ Content Blocks (19 types)

### 2.1 `block_hero`
| Field | Type | Notes |
|-------|------|-------|
| badge_text | String | Badge เล็กๆ ด้านบน |
| headline_line1 | String | หัวข้อบรรทัด 1 |
| headline_line2 | String | หัวข้อบรรทัด 2 |
| description | Text | คำอธิบาย |
| primary_cta_text | String | ปุ่มหลัก text |
| primary_cta_link | String | ปุ่มหลัก URL |
| secondary_cta_text | String | ปุ่มรอง text |
| secondary_cta_link | String | ปุ่มรอง URL |
| background_image | File | รูปพื้นหลัง |

### 2.2 `block_about_us`
| Field | Type | Notes |
|-------|------|-------|
| headline | String | หัวข้อ |
| subtitle | String | หัวข้อรอง |
| paragraph_1 | Text | เนื้อหาย่อหน้า 1 |
| paragraph_2 | Text | เนื้อหาย่อหน้า 2 |
| paragraph_3 | Text | เนื้อหาย่อหน้า 3 |
| image_url | File | รูปประกอบ |

### 2.3 `block_why_choose_us`
| Field | Type | Notes |
|-------|------|-------|
| title | String | หัวข้อ |
| subtitle | String | หัวข้อรอง |
| point_1_title | String | จุดเด่น 1 - หัวข้อ |
| point_1_text | Text | จุดเด่น 1 - รายละเอียด |
| point_2_title | String | จุดเด่น 2 - หัวข้อ |
| point_2_text | Text | จุดเด่น 2 - รายละเอียด |
| point_3_title | String | จุดเด่น 3 - หัวข้อ |
| point_3_text | Text | จุดเด่น 3 - รายละเอียด |
| point_4_title | String | จุดเด่น 4 - หัวข้อ |
| point_4_text | Text | จุดเด่น 4 - รายละเอียด |

### 2.4 `block_team`
| Field | Type | Notes |
|-------|------|-------|
| title | String | หัวข้อ |
| subtitle | String | หัวข้อรอง |
| note | Text | หมายเหตุ |
| dentists | M2M → dentists | เชื่อมกับ dentists |

### 2.5 `block_services`
| Field | Type | Notes |
|-------|------|-------|
| title | String | หัวข้อ |
| subtitle | String | หัวข้อรอง |
| services | JSON | Array ของ services `[{label, icon_name}]` |

### 2.6 `block_locations`
| Field | Type | Notes |
|-------|------|-------|
| section_title | String | หัวข้อ section |
| section_subtitle | String | หัวข้อรอง |
| branch_name | String | ชื่อสาขา |
| branch_tag | String | Tag สาขา (เช่น "สำนักงานใหญ่") |
| branch_address | Text | ที่อยู่ |
| branch_hours | String | เวลาทำการ |
| branch_phone | String | เบอร์โทร |
| branch_image_url | File | รูปสาขา |
| map_embed_url | String | Google Maps embed URL |

### 2.7 `block_booking`
| Field | Type | Notes |
|-------|------|-------|
| title | String | หัวข้อ |
| subtitle | String | หัวข้อรอง |
| phone_label | String | Label โทร |
| phone_number | String | เบอร์โทร |
| line_label | String | Label LINE |
| line_handle | String | LINE ID |
| hours_label | String | Label เวลาทำการ |
| hours_value | String | เวลาทำการ |

### 2.8 `block_contact`
| Field | Type | Notes |
|-------|------|-------|
| title | String | หัวข้อ |
| subtitle | String | หัวข้อรอง |
| phone_number | String | เบอร์โทร |
| phone_hours | String | เวลาให้บริการโทร |
| line_handle | String | LINE ID |
| line_response_time | String | เวลาตอบกลับ |
| facebook_page | String | Facebook page URL |
| email_address | String | Email |
| map_embed_url | String | Google Maps URL |
| map_address | Text | ที่อยู่บนแผนที่ |

### 2.9 `block_testimonials`
| Field | Type | Notes |
|-------|------|-------|
| title | String | หัวข้อ |
| subtitle | String | หัวข้อรอง |
| testimonials | JSON | `[{quote, author_name, role, rating, avatar_initial}]` |

### 2.10 `block_promotions`
| Field | Type | Notes |
|-------|------|-------|
| headline | String | หัวข้อ |
| subtitle | String | หัวข้อรอง |
| show_countdown | Boolean | แสดงนาฬิกานับถอยหลัง |
| countdown_date | DateTime | วันหมดโปรโมชั่น |
| countdown_label | String | Label นาฬิกา |
| show_category_filter | Boolean | แสดง filter หมวดหมู่ |

### 2.11 `block_portfolio`
| Field | Type | Notes |
|-------|------|-------|
| headline | String | หัวข้อ |
| subtitle | String | หัวข้อรอง |
| description | Text | คำอธิบาย |
| show_category_filter | Boolean | แสดง filter หมวดหมู่ |
| cases_per_page | Integer | จำนวนเคสต่อหน้า |

### 2.12 `block_blog_listing`
| Field | Type | Notes |
|-------|------|-------|
| headline | String | หัวข้อ |
| subtitle | String | หัวข้อรอง |
| description | Text | คำอธิบาย |
| show_search | Boolean | แสดง search box |
| show_category_filter | Boolean | แสดง filter หมวดหมู่ |
| show_featured_article | Boolean | แสดงบทความแนะนำ |
| articles_per_page | Integer | จำนวนบทความต่อหน้า |

### 2.13 `block_stats`
| Field | Type | Notes |
|-------|------|-------|
| stats | JSON | `[{value, label, icon, icon_color}]` |
| columns | Integer | จำนวนคอลัมน์ (2, 3, 4) |
| show_icons | Boolean | แสดง icons |

### 2.14 `block_page_header`
| Field | Type | Notes |
|-------|------|-------|
| badge_text | String | Badge text |
| title | String | หัวข้อหลัก |
| subtitle | String | หัวข้อรอง |
| description | Text | คำอธิบาย |

### 2.15 - 2.19 Other Blocks
- `block_text` - Rich text block
- `block_form` - Form block (M2O → forms)
- `block_features` - Features grid
- `block_pricing` - Pricing table
- `block_footer` - Footer block
- `block_signature_treatment` - Signature treatment block
- `block_safety_banner` - Safety banner
- `block_service_detail` - Service detail block (M2O → services)

---

## 3️⃣ Services

### 3.1 `service_categories`
| Field | Type | Notes |
|-------|------|-------|
| id | Integer (Auto) | Primary key |
| name | String | ชื่อหมวดหมู่ |
| slug | String | URL slug (unique) |
| description | Text | คำอธิบาย |
| icon_name | String | ชื่อ icon (Lucide) |
| sort | Integer | ลำดับ |

### 3.2 `services`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | Integer (Auto) | ✅ | Primary key |
| name | String | ✅ | ชื่อบริการ |
| slug | String | ✅ | URL slug (unique) |
| status | String | ✅ | `draft`, `published` |
| category | M2O → service_categories | | หมวดหมู่ |
| short_description | Text | | คำอธิบายสั้น |
| long_description | Text/WYSIWYG | | คำอธิบายยาว |
| duration_label | String | | ระยะเวลารักษา (เช่น "3-18 เดือน") |
| price_from | String | | ราคาเริ่มต้น |
| price_starting_from | String | | ราคาเริ่มต้น (alternative field) |
| price_installment | String | | ข้อความผ่อนชำระ |
| price_installment_months | Integer | | จำนวนเดือนผ่อน |
| hero_image | File | | รูปหลัก |
| seo_title | String | | SEO title |
| seo_description | Text | | SEO description |
| highlights | JSON | | `[{title, description}]` |
| **features** | JSON | | `[{icon, icon_color, title, description}]` |
| **process_steps** | JSON | | `[{number, title, description, duration, color}]` |
| **results** | JSON | | `[{title, description}]` |
| **care_instructions** | JSON | | `[{number, title, description}]` |
| **suitability** | JSON | | `{items: [...]}` |
| **pricing_plans** | JSON | | `[{tier, price, description, aligner_count, duration, retainer_count, is_popular}]` |
| **faqs** | JSON | | `[{question, answer, sort}]` |
| **portfolio_cases** | JSON | | `[{title, duration, description, image}]` |
| stats_cases | String | | สถิติเคส (เช่น "5,000+") |
| stats_rating | Float | | คะแนนรีวิว (เช่น 4.9) |
| cta_booking_text | String | | ปุ่มนัดหมาย text |
| cta_booking_link | String | | ปุ่มนัดหมาย URL |
| cta_line_text | String | | ปุ่ม LINE text |
| cta_line_link | String | | ปุ่ม LINE URL |

> ⚠️ **หมายเหตุ:** Fields ที่ **bold** เป็น JSON fields ใหม่ที่ต้องเพิ่ม (12 fields)

---

## 4️⃣ Blog

### 4.1 `blog_categories`
| Field | Type | Notes |
|-------|------|-------|
| id | Integer (Auto) | Primary key |
| name | String | ชื่อหมวดหมู่ |
| slug | String | URL slug (unique) |
| description | Text | คำอธิบาย |
| color | String | สี (hex) |
| sort | Integer | ลำดับ |

### 4.2 `blog_posts`
| Field | Type | Notes |
|-------|------|-------|
| id | Integer (Auto) | Primary key |
| title | String | หัวข้อ |
| slug | String | URL slug (unique) |
| status | String | `draft`, `published` |
| category | M2O → blog_categories | หมวดหมู่ |
| featured_image | File | รูปหลัก |
| excerpt | Text | สรุปบทความ |
| content | WYSIWYG | เนื้อหา |
| author_name | String | ชื่อผู้เขียน |
| author_role | String | ตำแหน่งผู้เขียน |
| author_avatar | File | รูปผู้เขียน |
| published_date | DateTime | วันที่เผยแพร่ |
| reading_time | Integer | เวลาอ่าน (นาที) |
| views | Integer | จำนวนการดู |
| is_featured | Boolean | บทความแนะนำ |
| tags | JSON/Tags | Tags |
| seo_title | String | SEO title |
| seo_description | Text | SEO description |

---

## 5️⃣ Promotions

### 5.1 `promotion_categories`
| Field | Type | Notes |
|-------|------|-------|
| id | Integer (Auto) | Primary key |
| name | String | ชื่อหมวดหมู่ |
| slug | String | URL slug (unique) |
| description | Text | คำอธิบาย |
| sort | Integer | ลำดับ |

### 5.2 `promotions`
| Field | Type | Notes |
|-------|------|-------|
| id | Integer (Auto) | Primary key |
| title | String | ชื่อโปรโมชั่น |
| slug | String | URL slug (unique) |
| status | String | `draft`, `published` |
| category | M2O → promotion_categories | หมวดหมู่ |
| featured_image | File | รูปหลัก |
| short_description | Text | คำอธิบายสั้น |
| description | WYSIWYG | คำอธิบายเต็ม |
| discount_percentage | Integer | ส่วนลด % |
| discount_amount | String | ส่วนลดเป็นเงิน |
| original_price | String | ราคาเดิม |
| discounted_price | String | ราคาลด |
| valid_from | DateTime | เริ่มใช้งาน |
| valid_until | DateTime | หมดอายุ |
| countdown_enabled | Boolean | เปิดนาฬิกานับถอยหลัง |
| countdown_date | DateTime | วันหมดนาฬิกา |
| cta_text | String | ปุ่ม text |
| cta_link | String | ปุ่ม URL |
| is_featured | Boolean | แนะนำ |
| features | JSON | `[string]` - features list |
| sort | Integer | ลำดับ |

---

## 6️⃣ Portfolio

### 6.1 `portfolio_categories`
| Field | Type | Notes |
|-------|------|-------|
| id | Integer (Auto) | Primary key |
| name | String | ชื่อหมวดหมู่ |
| slug | String | URL slug (unique) |
| description | Text | คำอธิบาย |
| sort | Integer | ลำดับ |

### 6.2 `portfolio_cases`
| Field | Type | Notes |
|-------|------|-------|
| id | Integer (Auto) | Primary key |
| title | String | ชื่อเคส |
| slug | String | URL slug (unique) |
| status | String | `draft`, `published` |
| category | M2O → portfolio_categories | หมวดหมู่ |
| image_before | File | รูป Before |
| image_after | File | รูป After |
| description | Text | คำอธิบาย |
| rating | Float | คะแนน |
| duration | String | ระยะเวลารักษา |
| treatment_type | String | ประเภทการรักษา |
| client_name | String | ชื่อลูกค้า |
| client_age | Integer | อายุลูกค้า |
| client_gender | String | เพศ |
| is_featured | Boolean | แนะนำ |
| sort | Integer | ลำดับ |

---

## 7️⃣ Team (Dentists)

### 7.1 `dentists`
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (Auto) | Primary key |
| name | String | ชื่อ-นามสกุล |
| nickname | String | ชื่อเล่น |
| specialty | String | ความเชี่ยวชาญ |
| photo | File | รูป |
| photo_url | String | URL รูป (fallback) |
| linkedin_url | String | LinkedIn URL |
| status | String | `draft`, `published` |
| sort | Integer | ลำดับ |

---

## 8️⃣ Navigation

### 8.1 `navigation`
| Field | Type | Notes |
|-------|------|-------|
| id | Integer (Auto) | Primary key |
| title | String | ชื่อเมนู |
| url | String | External URL |
| page | M2O → pages | ลิงค์กับหน้า |
| parent | M2O → navigation (self) | Parent menu |
| target | String | `_self`, `_blank` |
| sort | Integer | ลำดับ |

---

## 9️⃣ Forms

### 9.1 `forms`
| Field | Type | Notes |
|-------|------|-------|
| id | Integer (Auto) | Primary key |
| name | String | ชื่อฟอร์ม |
| slug | String | slug (unique) |
| description | Text | คำอธิบาย |
| submit_button_text | String | ข้อความปุ่มส่ง |
| success_message | Text | ข้อความเมื่อสำเร็จ |
| redirect_url | String | URL redirect หลังส่ง |
| email_notifications | Boolean | ส่ง email แจ้งเตือน |
| notification_email | String | Email รับแจ้งเตือน |

### 9.2 `form_fields`
| Field | Type | Notes |
|-------|------|-------|
| id | Integer (Auto) | Primary key |
| form | M2O → forms | ลิงค์กับฟอร์ม |
| label | String | Label |
| field_type | String | `text`, `email`, `textarea`, `select`, `checkbox`, `radio`, `file` |
| placeholder | String | Placeholder |
| required | Boolean | บังคับกรอก |
| validation | JSON | กฎ validation |
| options | JSON | `[{label, value}]` - สำหรับ select/radio |
| sort | Integer | ลำดับ |

---

## 🔟 Global Settings

### 10.1 `global_settings`
**Type:** Singleton

| Field | Type | Notes |
|-------|------|-------|
| id | Integer (Auto) | Primary key |
| site_name | String | ชื่อเว็บไซต์ |
| site_description | Text | คำอธิบายเว็บไซต์ |
| logo | File | โลโก้ |
| favicon | File | Favicon |

---

## ⚙️ Tips สำหรับการตั้งค่า

### 1. Permission สำหรับ Static Token
ตั้งค่า Role ที่ใช้กับ Static Token ให้มี permission:
- **Read** ทุก collection ที่กล่าวมา
- **Read** directus_files (สำหรับรูปภาพ)

### 2. M2A (Many-to-Any) สำหรับ page_blocks
ต้องตั้งค่า `page_blocks` เป็น M2A relationship:
- Related collections: ทุก `block_*` collections
- Junction field: `item` + `collection`

### 3. JSON Fields Format
สำหรับ JSON fields ต้องเก็บเป็น array of objects ตาม format ที่ระบุไว้

---

## 📌 Checklist ก่อน Go-Live

- [ ] สร้าง collections ทั้งหมดครบ
- [ ] สร้าง fields ใน services (12 JSON fields ใหม่)
- [ ] ตั้งค่า M2A relationships
- [ ] ตั้งค่า permissions สำหรับ public/static token
- [ ] Upload sample data
- [ ] ทดสอบแต่ละหน้าบนเว็บ
