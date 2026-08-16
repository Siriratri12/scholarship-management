# 🎓 Scholarship Management System

ระบบบริหารจัดการคำขอทุนการศึกษา พัฒนาขึ้นในรูปแบบ **Proof of Concept (POC)** สำหรับรองรับการยื่นคำขอทุนการศึกษาของนักศึกษา และสนับสนุนการบริหารจัดการคำขอโดยเจ้าหน้าที่

ระบบครอบคลุมกระบวนการตั้งแต่การยื่นคำขอทุน การตรวจสอบข้อมูล การให้ความยินยอมด้านข้อมูลส่วนบุคคล (PDPA) การตรวจสอบสถานะคำขอ และการพิจารณาคำขอโดยเจ้าหน้าที่

---

## 🌐 Live Demo

สามารถทดลองใช้งานระบบออนไลน์ได้ที่

**Frontend:**  
https://scholarship-management-azure.vercel.app/

> ระบบนี้เป็น Proof of Concept (POC) สำหรับการทดสอบและสาธิตการทำงานของระบบบริหารจัดการทุนการศึกษา

---

# 🛠️ เทคโนโลยีที่ใช้

## Frontend

- React
- Vite
- React Router
- JavaScript
- CSS
- Axios
- Lucide React
- Recharts

## Backend

- Node.js
- Express.js
- TypeScript
- REST API
- JSON Web Token (JWT)
- bcryptjs
- CORS

## Database

- PostgreSQL
- Prisma ORM
- Prisma PostgreSQL Driver Adapter (`@prisma/adapter-pg`)

## Development & Deployment

- Git
- GitHub
- Docker
- Docker Compose
- Vercel — Frontend
- Render — Backend
- Render PostgreSQL — Database

---

# 🚀 วิธีติดตั้งและรันระบบทีละขั้น

## 1. Clone Repository

```bash
git clone https://github.com/Siriratri12/scholarship-management.git
```

เข้าโฟลเดอร์โปรเจกต์

```bash
cd scholarship-management
```

โครงสร้างหลักของระบบ

```text
scholarship-management/
│
├── backend/
├── frontend/
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# ⚙️ การติดตั้ง Backend

## 2. เข้าโฟลเดอร์ Backend

```bash
cd backend
```

ติดตั้ง Dependencies

```bash
npm install
```

---

## 3. ตั้งค่า Environment Variables

สร้างไฟล์

```text
backend/.env
```

ตัวอย่างสำหรับ Local Development

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/scholarship_db?schema=public"

JWT_SECRET="scholarship-management-secret-key"

PORT=5000

FRONTEND_URL="http://localhost:5173"
```

> ⚠️ ไม่ควร Commit ไฟล์ `.env` ขึ้น GitHub เนื่องจากอาจมี Database Password, JWT Secret และข้อมูลสำคัญอื่น ๆ

---

## 4. Generate Prisma Client

```bash
npx prisma generate
```

---

## 5. เตรียมฐานข้อมูล

หากมี Migration อยู่แล้ว ให้รัน

```bash
npx prisma migrate deploy
```

สำหรับ Development สามารถใช้

```bash
npx prisma migrate dev
```

ตรวจสอบสถานะ Migration

```bash
npx prisma migrate status
```

หากฐานข้อมูลพร้อมใช้งาน จะแสดงข้อความประมาณ

```text
Database schema is up to date!
```

---

## 6. รัน Backend

```bash
npm run dev
```

Backend จะทำงานที่

```text
http://localhost:5000
```

สามารถตรวจสอบการทำงานของ API ได้ที่

```text
http://localhost:5000/api/health
```

ตัวอย่าง Response

```json
{
  "success": true,
  "message": "Scholarship Management API is running"
}
```

---

# 💻 การติดตั้ง Frontend

## 7. เปิด Terminal อีกหน้าหนึ่ง

กลับไปที่โฟลเดอร์หลักของโปรเจกต์ แล้วเข้า Frontend

```bash
cd scholarship-management/frontend
```

ติดตั้ง Dependencies

```bash
npm install
```

---

## 8. ตั้งค่า Environment Variables ของ Frontend

สร้างไฟล์

```text
frontend/.env
```

กำหนด API URL สำหรับ Local Development

```env
VITE_API_URL=http://localhost:5000
```

---

## 9. รัน Frontend

```bash
npm run dev
```

Frontend จะทำงานที่

```text
http://localhost:5173
```

จากนั้นเปิด Browser และเข้า

```text
http://localhost:5173
```

---

# 🐳 วิธีรันระบบด้วย Docker

ระบบรองรับการใช้งาน Docker และ Docker Compose สำหรับการพัฒนาในเครื่อง

จากโฟลเดอร์หลักของโปรเจกต์

```bash
docker compose up --build
```

ตรวจสอบ Container

```bash
docker compose ps
```

เมื่อระบบทำงานแล้ว

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:5000

PostgreSQL:
localhost:5433
```

หากต้องการหยุดระบบ

```bash
docker compose down
```

ดู Log

```bash
docker compose logs -f
```

---

# 👤 บัญชีผู้ใช้ทดสอบ

สำหรับเข้าสู่ระบบในส่วนของเจ้าหน้าที่ / ผู้ดูแลระบบ

```text
Username: admin
Password: admin123
Role: ADMIN
```

> บัญชีดังกล่าวจัดทำขึ้นสำหรับการทดสอบระบบ Proof of Concept เท่านั้น

สามารถทดลองเข้าสู่ระบบผ่านเว็บไซต์

https://scholarship-management-azure.vercel.app/

---

# 🌱 วิธีนำเข้าข้อมูลตัวอย่าง (Seed Data)

ระบบมี Seed Data สำหรับสร้างบัญชีผู้ดูแลระบบและข้อมูลคำขอทุนตัวอย่าง

เข้าโฟลเดอร์ Backend

```bash
cd backend
```

---

## Seed ข้อมูลทั้งหมด

รัน

```bash
npm run prisma:seed
```

หรือ

```bash
npx tsx prisma/seed.ts
```

Seed Data จะดำเนินการดังนี้

- สร้างหรืออัปเดตบัญชี Admin
- Username เป็น `admin`
- Password เป็น `admin123`
- Role เป็น `ADMIN`
- เพิ่มข้อมูลคำขอทุนตัวอย่าง 25 รายการ
- มีตัวอย่างคำขอหลายประเภท
- มีตัวอย่างสถานะคำขอหลายสถานะ

สถานะตัวอย่างประกอบด้วย

```text
PENDING
APPROVED
REJECTED
```

เมื่อ Seed สำเร็จ จะแสดงข้อความประมาณ

```text
🌱 Starting seed...
👤 Admin created: admin
📋 Scholarship requests: 25
✅ Seed completed successfully!
```

---

## Seed เฉพาะบัญชี Admin

หากต้องการสร้างหรืออัปเดตเฉพาะบัญชี Admin โดยไม่เพิ่มข้อมูลคำขอทุนตัวอย่าง ให้รัน

```bash
npx tsx prisma/seed-admin.ts
```

เมื่อสำเร็จจะแสดง

```text
🌱 Creating production admin...
✅ Admin ready
👤 Username: admin
```

บัญชีที่ใช้ทดสอบ

```text
Username: admin
Password: admin123
```

---

# ✨ ฟังก์ชันหลักของระบบ

## 👨‍🎓 สำหรับนักศึกษา

นักศึกษาสามารถใช้งานส่วนยื่นคำขอได้โดยไม่จำเป็นต้องเข้าสู่ระบบ

สามารถ

- ดูข้อมูลประเภททุนการศึกษา
- ยื่นคำขอทุนออนไลน์
- กรอกข้อมูลส่วนตัวและข้อมูลการศึกษา
- เลือกประเภททุนที่ต้องการสมัคร
- ระบุจำนวนเงินที่ต้องการขอรับ
- กรอกข้อมูลบัญชีธนาคาร
- ระบุเหตุผลความจำเป็นในการขอทุน
- ให้ความยินยอม PDPA
- รับเลขที่คำขอหลังส่งข้อมูลสำเร็จ
- ตรวจสอบสถานะคำขอภายหลัง

---

# 🔍 การตรวจสอบข้อมูล (Validation)

ระบบมีการตรวจสอบข้อมูลก่อนส่งคำขอ

## รหัสนักศึกษา

ต้องเป็นตัวเลข 10 หลัก

```text
6712345678
```

## GPAX

ต้องอยู่ระหว่าง

```text
0.00 - 4.00
```

และรองรับทศนิยมไม่เกิน 2 ตำแหน่ง

```text
3.25
```

## Email

ต้องอยู่ในรูปแบบ Email ที่ถูกต้อง

```text
student@psu.ac.th
```

## จำนวนเงินที่ขอรับทุน

ต้องเป็นตัวเลขที่มากกว่า 0

## เลขบัญชีธนาคาร

ต้องเป็นตัวเลข

## PDPA Consent

ผู้สมัครต้องให้ความยินยอมในการเก็บและประมวลผลข้อมูลส่วนบุคคลก่อนส่งคำขอ

---

# 🎓 ประเภททุนการศึกษา

ระบบรองรับทุนการศึกษา 5 ประเภท

1. ทุนขาดแคลนทุนทรัพย์
2. ทุนส่งเสริมการศึกษา (เรียนดี)
3. ทุนทำงานพิเศษ (นักศึกษาช่วยงาน)
4. ทุนฉุกเฉิน / ช่วยเหลือกรณีพิเศษ
5. ทุนกิจกรรมนักศึกษา

---

# 📋 สถานะคำขอทุน

ระบบรองรับสถานะหลัก ได้แก่

| Status     | ความหมาย   |
| ---------- | ---------- |
| `PENDING`  | รอพิจารณา  |
| `APPROVED` | อนุมัติ    |
| `REJECTED` | ไม่อนุมัติ |

---

# 👨‍💼 สำหรับเจ้าหน้าที่

เจ้าหน้าที่ต้องเข้าสู่ระบบก่อนใช้งานส่วนบริหารจัดการ

ฟังก์ชันหลักประกอบด้วย

- Login
- JWT Authentication
- Dashboard
- ดูรายการคำขอทุน
- ค้นหาข้อมูล
- กรองข้อมูล
- Pagination
- ดูรายละเอียดคำขอ
- เพิ่มข้อมูลคำขอ
- แก้ไขข้อมูลคำขอ
- พิจารณาคำขอ
- อนุมัติคำขอ
- ไม่อนุมัติคำขอ
- Soft Delete
- ดูข้อมูลสรุปผ่าน Dashboard

---

# 🔐 Authentication

ระบบใช้ **JSON Web Token (JWT)** สำหรับ Authentication

เมื่อ Login สำเร็จ Backend จะออก Token ให้กับผู้ใช้งาน

Protected API จะรับ Token ผ่าน Header

```text
Authorization: Bearer <token>
```

Token จะถูกใช้สำหรับตรวจสอบตัวตนและสิทธิ์ก่อนเข้าถึง API สำหรับเจ้าหน้าที่

---

# 👥 User Roles

ระบบกำหนด Role หลักไว้ 2 ประเภท

```text
ADMIN
STAFF
```

## ADMIN

ผู้ดูแลระบบ

## STAFF

เจ้าหน้าที่สำหรับจัดการและพิจารณาคำขอทุน

---

# 🔒 Password Security

Password ของผู้ใช้งานจะไม่ถูกบันทึกเป็น Plain Text ในฐานข้อมูล

ระบบใช้

```text
bcryptjs
```

สำหรับ Hash Password ก่อนบันทึกลง PostgreSQL

ตัวอย่าง Password

```text
admin123
```

จะถูกแปลงเป็น Password Hash ก่อนจัดเก็บลงฐานข้อมูล

---

# 🛡️ PDPA Consent

ก่อนยื่นคำขอทุน นักศึกษาต้องให้ความยินยอมในการเก็บรวบรวมและประมวลผลข้อมูลส่วนบุคคล

ระบบจัดเก็บข้อมูลที่เกี่ยวข้อง เช่น

```text
pdpaConsent
pdpaConsentAt
```

เพื่อใช้บันทึกการให้ความยินยอมของผู้สมัคร

---

# 🗑️ Soft Delete

ระบบรองรับแนวคิด Soft Delete สำหรับข้อมูลคำขอทุน

ข้อมูลจะไม่ถูกลบออกจากฐานข้อมูลทันที แต่จะถูกระบุว่าเป็นข้อมูลที่ถูกลบแล้ว เพื่อรองรับการตรวจสอบข้อมูลย้อนหลัง

---

# 📝 Audit Log

ระบบมีโครงสร้างสำหรับบันทึกประวัติการดำเนินการของผู้ใช้งาน

ข้อมูลที่สามารถบันทึกได้ เช่น

```text
User
Action
Entity
Entity ID
IP Address
Created At
```

ใช้สำหรับรองรับการตรวจสอบการดำเนินงานย้อนหลัง

---

# 🗄️ Database

ระบบใช้ **PostgreSQL** เป็นฐานข้อมูลหลัก

Model สำคัญประกอบด้วย

## User

ใช้จัดเก็บข้อมูลบัญชีเจ้าหน้าที่

```text
id
username
passwordHash
fullName
role
createdAt
updatedAt
```

---

## ScholarshipRequest

ใช้จัดเก็บข้อมูลคำขอทุนการศึกษา

```text
id
requestNumber
studentId
studentName
faculty
major
year
gpax
email
scholarshipType
requestedAmount
bankAccount
reason
pdpaConsent
pdpaConsentAt
status
staffNote
createdAt
updatedAt
```

---

## AuditLog

ใช้จัดเก็บประวัติการดำเนินการ

```text
id
userId
action
entity
entityId
ipAddress
createdAt
```

---

# 🔷 Prisma ORM

ระบบใช้ Prisma ORM สำหรับเชื่อมต่อ Backend กับ PostgreSQL

Generate Prisma Client

```bash
npx prisma generate
```

ตรวจสอบ Migration

```bash
npx prisma migrate status
```

Deploy Migration

```bash
npx prisma migrate deploy
```

สำหรับ Development

```bash
npx prisma migrate dev
```

---

# 🔌 REST API

Backend ให้บริการข้อมูลผ่าน REST API

## Health Check

```http
GET /api/health
```

## Authentication

```http
POST /api/auth/login
```

## Scholarship Requests

API สำหรับจัดการคำขอทุนอยู่ภายใต้

```text
/api/scholarships
```

## Dashboard

API สำหรับข้อมูล Dashboard อยู่ภายใต้

```text
/api/dashboard
```

บาง Endpoint จำเป็นต้องใช้ JWT Token ก่อนเรียกใช้งาน

---

# 🔑 ตัวอย่างการ Login

Request

```http
POST /api/auth/login
```

Body

```json
{
  "username": "admin",
  "password": "admin123"
}
```

เมื่อ Login สำเร็จ ระบบจะส่งข้อมูลผู้ใช้งานและ JWT Token กลับมา เพื่อใช้สำหรับเข้าถึง Protected API

---

# 🏗️ System Architecture

```text
┌─────────────────────────────┐
│       Student / Staff       │
│          Browser            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│          Frontend           │
│        React + Vite         │
│                             │
│           Vercel            │
└──────────────┬──────────────┘
               │
               │ REST API / HTTPS
               ▼
┌─────────────────────────────┐
│           Backend           │
│ Node.js + Express + TS      │
│                             │
│           Render            │
└──────────────┬──────────────┘
               │
               │ Prisma ORM
               ▼
┌─────────────────────────────┐
│         PostgreSQL          │
│                             │
│           Render            │
└─────────────────────────────┘
```

---

# 🔄 Data Flow

ตัวอย่างกระบวนการยื่นคำขอทุน

```text
นักศึกษา
    ↓
กรอกแบบฟอร์มคำขอทุน
    ↓
Frontend Validation
    ↓
PDPA Consent
    ↓
POST Request
    ↓
REST API
    ↓
Backend Validation
    ↓
Prisma ORM
    ↓
PostgreSQL
    ↓
สร้างเลขที่คำขอ
    ↓
ส่ง Response กลับ Frontend
    ↓
แสดงเลขที่คำขอ
    ↓
นักศึกษาตรวจสอบสถานะ
```

กระบวนการพิจารณาคำขอ

```text
เจ้าหน้าที่
    ↓
Login
    ↓
JWT Authentication
    ↓
Dashboard
    ↓
ดูรายการคำขอ
    ↓
ดูรายละเอียด
    ↓
พิจารณาคำขอ
    ↓
อนุมัติ / ไม่อนุมัติ
    ↓
อัปเดตสถานะ
    ↓
นักศึกษาตรวจสอบผล
```

---

# 📁 Project Structure

```text
scholarship-management/
│
├── backend/
│   │
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── seed-admin.ts
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.ts
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── prisma.config.ts
│   └── tsconfig.json
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── config/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── App.css
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── vercel.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# 🌐 Deployment

ระบบแบ่งการ Deploy ออกเป็น 3 ส่วน

```text
Frontend
   │
   └── Vercel
          │
          │ HTTPS / REST API
          ▼
Backend
   │
   └── Render
          │
          │ Prisma ORM
          ▼
Database
   │
   └── Render PostgreSQL
```

## Frontend

Frontend Production Deploy ผ่าน Vercel

https://scholarship-management-azure.vercel.app/

Environment Variable ที่ใช้

```env
VITE_API_URL=https://your-backend-url
```

---

## Backend

Backend Deploy ผ่าน Render Web Service

Environment Variables ที่จำเป็น เช่น

```text
DATABASE_URL
JWT_SECRET
PORT
FRONTEND_URL
```

---

## Database

Production Database ใช้ PostgreSQL

Backend เชื่อมต่อฐานข้อมูลผ่าน Prisma ORM และ PostgreSQL Driver Adapter

---

# 🌍 CORS

Backend มีการกำหนด CORS เพื่อรองรับการเชื่อมต่อจาก Frontend

รองรับ

```text
Local Development
Vercel Production
Vercel Preview Deployment
```

เพื่อให้ Frontend สามารถเรียกใช้งาน Backend REST API ผ่าน Browser ได้

---

# 🔑 Environment Variables

## Backend

```env
DATABASE_URL=
JWT_SECRET=
PORT=
FRONTEND_URL=
```

## Frontend

```env
VITE_API_URL=
```

> ค่า Environment Variables จริงสำหรับ Production จะถูกกำหนดผ่านบริการ Deployment และไม่ควรบันทึก Credential จริงลง Git Repository

---

# 🛡️ Security

ระบบมีแนวทางด้าน Security เบื้องต้น ได้แก่

- Password Hashing ด้วย bcryptjs
- JWT Authentication
- Protected API Routes
- Role-based Access
- Input Validation
- CORS Configuration
- Environment Variables
- PDPA Consent
- Soft Delete
- Audit Logging

---

# 🎯 ขอบเขตของระบบ

ระบบนี้เป็น Proof of Concept โดยเน้นการสาธิต Workflow หลักของระบบบริหารจัดการทุนการศึกษา

```text
ประชาสัมพันธ์ทุน
        ↓
ยื่นคำขอทุน
        ↓
ตรวจสอบข้อมูล
        ↓
PDPA Consent
        ↓
บันทึกคำขอ
        ↓
รับเลขที่คำขอ
        ↓
ตรวจสอบสถานะ
        ↓
เจ้าหน้าที่ Login
        ↓
Dashboard
        ↓
ตรวจสอบคำขอ
        ↓
พิจารณาคำขอ
        ↓
อนุมัติ / ไม่อนุมัติ
        ↓
อัปเดตสถานะ
```

---

# ⚠️ หมายเหตุ

ระบบนี้พัฒนาขึ้นในรูปแบบ **Proof of Concept (POC)** เพื่อแสดงแนวทางการพัฒนา Web Application สำหรับบริหารจัดการคำขอทุนการศึกษา

ข้อมูลใน Seed Data เป็นข้อมูลตัวอย่างที่สร้างขึ้นเพื่อใช้สำหรับการทดสอบระบบเท่านั้น

บัญชี

```text
admin / admin123
```

ใช้สำหรับการทดสอบ POC และไม่ควรใช้ Credential ดังกล่าวกับระบบ Production จริง

---
