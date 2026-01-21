# Directus Schema Requirements
## สำหรับ Services Collection

---

## สรุป

ต้องเพิ่ม 12 fields ใหม่ ใน services collection เพื่อรองรับ Service Detail Page template ใหม่

---

## JSON Fields (8 fields)

### 1. features
- **Type:** JSON
- **Description:** จุดเด่นของบริการ แสดงเป็น 4 cards บนหน้าเว็บ
```json
[
  {
    "icon": "eye-off",
    "icon_color": "blue",
    "title": "มองแทบไม่เห็น",
    "description": "พลาสติกใสใส่แล้วไม่รู้ว่ากำลังจัดฟัน"
  }
]
```

### 2. process_steps
- **Type:** JSON
- **Description:** ขั้นตอนการรักษา แสดงเป็น timeline
```json
[
  {
    "number": 1,
    "title": "ปรึกษาและสแกนฟัน",
    "description": "พบทันตแพทย์ประเมินฟัน สแกน 3D ฟรี",
    "duration": "30 นาที",
    "color": "blue"
  }
]
```

### 3. results
- **Type:** JSON
- **Description:** ผลลัพธ์ที่คาดหวังจากการรักษา
```json
[
  {
    "title": "ฟันเรียงสวย",
    "description": "ฟันจะค่อยๆ เรียงตัวตามแผนที่วางไว้"
  }
]
```

### 4. care_instructions
- **Type:** JSON
- **Description:** คำแนะนำการดูแลรักษาหลังทำ
```json
[
  {
    "number": 1,
    "title": "ใส่ Aligner 20-22 ชม./วัน",
    "description": "วินัยสำคัญที่สุด ถอดได้เฉพาะตอนกินและแปรงฟัน"
  }
]
```

### 5. suitability
- **Type:** JSON
- **Description:** รายการกลุ่มคนที่เหมาะกับบริการนี้
```json
{
  "items": [
    "ฟันซ้อนเก ฟันห่าง",
    "คนทำงานที่ต้องพบปะลูกค้า",
    "อายุ 12 ปีขึ้นไป"
  ]
}
```

### 6. pricing_plans
- **Type:** JSON
- **Description:** แพ็คเกจราคา แสดงเป็น 3 cards
```json
[
  {
    "tier": "LITE",
    "price": "฿39,000",
    "description": "เหมาะกับเคสง่าย",
    "aligner_count": "14 ชุด",
    "duration": "3-6 เดือน",
    "retainer_count": "1 คู่",
    "is_popular": false
  },
  {
    "tier": "STANDARD",
    "price": "฿59,000",
    "description": "เหมาะกับเคสทั่วไป",
    "aligner_count": "28 ชุด",
    "duration": "6-12 เดือน",
    "retainer_count": "2 คู่",
    "is_popular": true
  }
]
```

### 7. faqs
- **Type:** JSON
- **Description:** คำถามที่พบบ่อย แสดงเป็น accordion
```json
[
  {
    "question": "จัดฟันใสเจ็บไหม?",
    "answer": "ช่วงแรกอาจมีความรู้สึกตึงบ้างเล็กน้อย...",
    "sort": 1
  }
]
```

### 8. portfolio_cases
- **Type:** JSON
- **Description:** ผลงานตัวอย่าง แสดงเป็น Before/After cards
```json
[
  {
    "title": "เคส: ฟันซ้อนเก",
    "duration": "8 เดือน",
    "description": "ฟันหน้าซ้อนเกรุนแรง จัดเรียงใหม่ให้สวยงาม",
    "image": "https://example.com/image.jpg"
  }
]
```

---

## Simple Fields (4 fields)

| Field | Type | Default | ตัวอย่าง |
|-------|------|---------|---------|
| stats_cases | String | null | "5,000+" |
| stats_rating | Float | null | 4.9 |
| price_installment | String | null | "ผ่อน 0%" |
| price_installment_months | Integer | null | 10 |

---

## ตัวอย่างข้อมูลเต็ม

ดูไฟล์ data/services/clear-aligners-seed.json ใน source code

---

## หมายเหตุ

- ถ้า field เป็น null หรือ empty ระบบ frontend จะใช้ fallback data แทน
- ชื่อ Icon อ้างอิงจาก Lucide Icons ที่ lucide.dev/icons
- ถ้าตั้ง is_popular เป็น true จะแสดง badge ยอดนิยม บน pricing card
