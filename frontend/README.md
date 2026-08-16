# 🎓 Scholarship Management System

ระบบบริหารจัดการทุนการศึกษา  
กองพัฒนานักศึกษาและศิษย์เก่าสัมพันธ์  
มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตหาดใหญ่

โครงการนี้พัฒนาขึ้นเป็น **Proof of Concept (POC)** สำหรับระบบบริหารจัดการคำขอทุนการศึกษาแบบ Web Application โดยรองรับการยื่นคำขอทุน การจัดการข้อมูลคำขอ การค้นหาและกรองข้อมูล การพิจารณาสถานะ และการแสดงข้อมูลภาพรวมสำหรับเจ้าหน้าที่

---

## 📌 Project Overview

Scholarship Management System เป็นระบบสำหรับช่วยบริหารจัดการข้อมูลคำขอทุนการศึกษา โดยแบ่งการใช้งานออกเป็นส่วนของนักศึกษาและเจ้าหน้าที่

ระบบ Frontend พัฒนาด้วย React และ Vite เชื่อมต่อกับ Backend ผ่าน REST API ส่วน Backend พัฒนาด้วย Node.js, Express และ TypeScript โดยใช้ Prisma ORM สำหรับจัดการข้อมูลในฐานข้อมูล PostgreSQL

ระบบสามารถรันทั้ง Frontend, Backend และ PostgreSQL ผ่าน Docker Compose ได้

---

## ✨ Features

### 👨‍🎓 Student

- ดูข้อมูลและประเภททุนการศึกษา
- ยื่นคำขอทุนการศึกษา
- กรอกข้อมูลส่วนตัวและข้อมูลการศึกษา
- เลือกประเภททุนที่ต้องการสมัคร
- ระบุจำนวนเงินที่ต้องการขอรับทุน
- ให้ความยินยอม PDPA ก่อนส่งคำขอ
- Validation ข้อมูลก่อนบันทึก
- ดูรายละเอียดคำขอทุน
- ตรวจสอบสถานะคำขอทุน

### 👨‍💼 Staff / Administrator

- Login เข้าสู่ระบบเจ้าหน้าที่
- Authentication ด้วย JWT
- Dashboard แสดงภาพรวมข้อมูลคำขอทุน
- ดูรายการคำขอทุน
- ดูรายละเอียดคำขอ
- ค้นหาคำขอทุน
- กรองข้อมูลตามประเภททุน
- กรองข้อมูลตามสถานะ
- Pagination รายการคำขอ
- เพิ่มข้อมูลคำขอ
- แก้ไขข้อมูลคำขอ
- พิจารณาคำขอทุน
- อนุมัติคำขอ
- ไม่อนุมัติคำขอ
- บันทึกหมายเหตุของเจ้าหน้าที่
- Soft Delete ข้อมูลคำขอ
- Audit Log สำหรับบันทึกกิจกรรมที่สำคัญ

---

## 🎓 Scholarship Types

ระบบรองรับทุนการศึกษา 5 ประเภท

| Code        | ประเภททุน                       |
| ----------- | ------------------------------- |
| `NEEDY`     | ทุนขาดแคลนทุนทรัพย์             |
| `ACADEMIC`  | ทุนส่งเสริมการศึกษา (เรียนดี)   |
| `WORK`      | ทุนทำงานพิเศษ (นักศึกษาช่วยงาน) |
| `EMERGENCY` | ทุนฉุกเฉิน / ช่วยเหลือกรณีพิเศษ |
| `ACTIVITY`  | ทุนกิจกรรมนักศึกษา              |

---

## 📋 Scholarship Status

คำขอทุนมีสถานะหลักดังนี้

| Status     | ความหมาย    |
| ---------- | ----------- |
| `PENDING`  | รอพิจารณา   |
| `APPROVED` | อนุมัติแล้ว |
| `REJECTED` | ไม่อนุมัติ  |

---

## 🛠 Technology Stack

### Frontend

- React 19
- Vite
- React Router DOM
- Axios
- Lucide React
- Recharts
- CSS
- Responsive Web Design

### Backend

- Node.js
- Express.js 5
- TypeScript
- Prisma ORM
- Prisma PostgreSQL Adapter
- PostgreSQL Driver (`pg`)
- JSON Web Token (JWT)
- bcryptjs
- CORS
- dotenv

### Database

- PostgreSQL 16
- Prisma ORM
- Prisma Migration / Schema Management
- Seed Data

### Development & Deployment

- Docker
- Docker Compose
- Git
- GitHub
- npm

---

## 🏗 System Architecture

```text
┌───────────────────────────────┐
│          Web Browser          │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│        React + Vite           │
│           Frontend            │
│       localhost:5173          │
└───────────────┬───────────────┘
                │
                │ REST API
                ▼
┌───────────────────────────────┐
│    Node.js + Express + TS     │
│            Backend            │
│       localhost:5000          │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│          Prisma ORM           │
│      @prisma/adapter-pg       │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│        PostgreSQL 16          │
│       Docker Container        │
│       localhost:5433          │
└───────────────────────────────┘
```

---

## 📁 Project Structure

```text
scholarship-management/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── ...
│
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── generated/
│   ├── package.json
│   ├── Dockerfile
│   └── ...
│
├── docker-compose.yml
├── README.md
└── ...
```

---

# 🚀 Installation

สามารถรันระบบได้ 2 วิธี

1. รันด้วย Docker Compose
2. รัน Frontend และ Backend แยกกันสำหรับ Development

---

# 🐳 วิธีที่ 1: Run with Docker Compose

## 1. Clone Repository

```bash
git clone https://github.com/Siriratri12/scholarship-management.git
```

เข้าไปยังโฟลเดอร์โปรเจกต์

```bash
cd scholarship-management
```

---

## 2. Build and Start Containers

จากโฟลเดอร์หลักที่มีไฟล์ `docker-compose.yml`

```bash
docker compose up --build
```

Docker Compose จะสร้างและรัน service หลัก ได้แก่

```text
scholarship-frontend
scholarship-backend
scholarship-postgres
```

---

## 3. Access Application

### Frontend

```text
http://localhost:5173
```

### Backend API

```text
http://localhost:5000
```

### PostgreSQL

```text
Host: localhost
Port: 5433
Database: scholarship_db
Username: postgres
Password: postgres
```

> ภายใน Docker Network ตัว Backend จะเชื่อมต่อ PostgreSQL ผ่าน host ชื่อ `postgres` และ port `5432`

---

## 4. Stop Application

กด

```text
Ctrl + C
```

จากนั้นสามารถหยุด Container ด้วย

```bash
docker compose down
```

หากต้องการลบ PostgreSQL Volume ด้วย

```bash
docker compose down -v
```

> ⚠️ คำสั่ง `docker compose down -v` จะลบข้อมูลในฐานข้อมูลที่เก็บอยู่ใน Docker Volume

---

# 💻 วิธีที่ 2: Run for Development

จำเป็นต้องมี

- Node.js
- npm
- PostgreSQL
- Git

หรือสามารถใช้ PostgreSQL จาก Docker และรัน Frontend / Backend บนเครื่องได้

---

# ⚙️ Backend Setup

เข้า Backend

```bash
cd backend
```

ติดตั้ง Dependencies

```bash
npm install
```

---

## Environment Variables

สร้างไฟล์

```text
backend/.env
```

ตัวอย่าง

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/scholarship_db?schema=public"
JWT_SECRET="scholarship-management-secret-key"
PORT=5000
FRONTEND_URL="http://localhost:5173"
```

> หาก Backend ทำงานอยู่ภายใน Docker ให้ใช้ `postgres:5432` แทน `localhost:5433`

---

## Generate Prisma Client

```bash
npm run prisma:generate
```

หรือ

```bash
npx prisma generate
```

---

## Database Migration

หากเป็นการติดตั้งฐานข้อมูลใหม่ ให้ดำเนินการ Migration ตาม Prisma schema ของโครงการ เช่น

```bash
npx prisma migrate dev
```

หากโปรเจกต์มี Migration ที่สร้างไว้แล้ว สามารถใช้

```bash
npx prisma migrate deploy
```

---

## Seed Database

ระบบมี Seed Script สำหรับสร้างข้อมูลตัวอย่าง

```bash
npm run prisma:seed
```

คำสั่งดังกล่าวจะเรียก

```bash
prisma db seed
```

---

## Start Backend

```bash
npm run dev
```

Backend จะทำงานที่

```text
http://localhost:5000
```

---

# 🎨 Frontend Setup

เปิด Terminal ใหม่แล้วเข้า Frontend

```bash
cd frontend
```

ติดตั้ง Dependencies

```bash
npm install
```

---

## Frontend Environment

สามารถกำหนด API URL ผ่าน Environment Variable

```env
VITE_API_URL=http://localhost:5000
```

---

## Start Frontend

```bash
npm run dev
```

จากนั้นเปิด

```text
http://localhost:5173
```

---

# 🌱 Seed Data

ระบบมีข้อมูลตัวอย่างสำหรับใช้ทดสอบจำนวน **25 คำขอทุน**

Seed Data ถูกออกแบบให้มีหลายประเภททุนและหลายสถานะ เพื่อใช้สำหรับทดสอบฟังก์ชัน เช่น

- Dashboard
- Search
- Filter
- Pagination
- Scholarship Detail
- Edit
- Status Review
- Soft Delete

ตัวอย่างเลขที่คำขอ

```text
SCH-2026-0001
SCH-2026-0002
SCH-2026-0003
...
SCH-2026-0025
```

Seed Script ใช้ Prisma `upsert` กับเลขที่คำขอ เพื่อช่วยป้องกันการสร้างข้อมูลเลขที่คำขอเดิมซ้ำเมื่อ Seed ซ้ำ

---

# 🔐 Test Account

บัญชีสำหรับทดสอบการเข้าสู่ระบบเจ้าหน้าที่

```text
Username: admin
Password: admin123
Role: ADMIN
```

บัญชี Administrator ถูกสร้างจาก Seed Script

รหัสผ่านไม่ได้ถูกบันทึกเป็น Plain Text ในฐานข้อมูล แต่ถูก Hash ด้วย `bcryptjs` ก่อนบันทึก

---

# 🔒 Authentication

ระบบใช้ JSON Web Token (JWT) สำหรับ Authentication

ขั้นตอนโดยสรุป

```text
Staff
  │
  ▼
Login
  │
  ▼
POST /api/auth/login
  │
  ▼
ตรวจสอบ Username / Password
  │
  ▼
สร้าง JWT Token
  │
  ▼
Frontend เก็บ Token
  │
  ▼
ใช้ Token เรียก Protected API
```

เจ้าหน้าที่ต้อง Login ก่อนเข้าถึงหน้าสำหรับจัดการข้อมูลภายในระบบ

---

# 🗄 Database

ระบบใช้ **PostgreSQL 16** เป็นฐานข้อมูลหลัก

การเชื่อมต่อฐานข้อมูลของ Backend ใช้

```text
Prisma ORM
        ↓
@prisma/adapter-pg
        ↓
pg
        ↓
PostgreSQL
```

ตัวอย่างการเชื่อมต่อจาก Backend

```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});
```

ดังนั้นระบบสามารถใช้งาน PostgreSQL ได้โดยตรงโดยไม่จำเป็นต้องใช้ pgAdmin

> pgAdmin เป็นเพียงเครื่องมือ GUI สำหรับดูและจัดการ PostgreSQL ไม่ใช่ตัวฐานข้อมูล

---

# 🐘 PostgreSQL with Docker

ใน `docker-compose.yml` ระบบใช้ PostgreSQL 16

```yaml
postgres:
  image: postgres:16
```

และกำหนดฐานข้อมูล

```text
Database: scholarship_db
Username: postgres
Password: postgres
```

Port Mapping

```text
localhost:5433 → container:5432
```

ข้อมูล PostgreSQL ถูกเก็บไว้ใน Docker Volume

```text
postgres_data
```

ทำให้ข้อมูลยังคงอยู่แม้ Container จะถูกหยุดหรือลบ ตราบใดที่ Volume ไม่ถูกลบ

---

# 🔏 PDPA

ระบบมีการรองรับการให้ความยินยอมในการจัดเก็บและประมวลผลข้อมูลส่วนบุคคล

ข้อมูลที่เกี่ยวข้องประกอบด้วย

```text
pdpaConsent
pdpaConsentAt
```

ผู้สมัครต้องยืนยันการให้ความยินยอมก่อนส่งคำขอทุน

---

# 🗑 Soft Delete

การลบคำขอทุนถูกออกแบบให้รองรับ **Soft Delete**

แนวคิดคือข้อมูลจะไม่ถูกลบออกจากฐานข้อมูลทันที แต่จะถูกกำหนดสถานะหรือวันที่ลบไว้ เพื่อให้สามารถตรวจสอบประวัติข้อมูลย้อนหลังได้

---

# 📝 Audit Log

ระบบมีโครงสร้าง Audit Log สำหรับบันทึกกิจกรรมสำคัญที่เกิดขึ้นภายในระบบ

ตัวอย่างข้อมูลที่สามารถบันทึก ได้แก่

```text
User
Action
Entity
Entity ID
IP Address
Created At
```

ช่วยให้สามารถตรวจสอบย้อนหลังได้ว่าใครดำเนินการกับข้อมูลใดและเมื่อใด

---

# 🔍 Validation

ระบบมีการตรวจสอบข้อมูลก่อนบันทึก เช่น

- ตรวจสอบ Required Fields
- ตรวจสอบรูปแบบ Email
- ตรวจสอบ GPAX ให้อยู่ในช่วงที่กำหนด
- ตรวจสอบจำนวนเงินทุน
- ตรวจสอบข้อมูลนักศึกษา
- ตรวจสอบประเภททุน
- ตรวจสอบ PDPA Consent

Backend มี Validation เพิ่มเติมก่อนบันทึกข้อมูลเข้าสู่ PostgreSQL เพื่อไม่พึ่งพาการตรวจสอบจาก Frontend เพียงอย่างเดียว

---

# 📊 Pagination

รายการคำขอทุนรองรับ Pagination เพื่อให้สามารถจัดการข้อมูลจำนวนมากได้ง่ายขึ้น

ตัวอย่าง

```text
Page 1
1 - 10

Page 2
11 - 20

Page 3
21 - 25
```

---

# 🔎 Search & Filter

เจ้าหน้าที่สามารถค้นหาและกรองข้อมูลคำขอทุนได้ เช่น

```text
Student ID
Student Name
Request Number
Scholarship Type
Status
```

---

# 📱 Responsive Design

Frontend รองรับ Responsive Web Design สำหรับหลายขนาดหน้าจอ

- Desktop
- Tablet
- Mobile

บนหน้าจอขนาดเล็ก รายการข้อมูลสามารถปรับจาก Table เป็น Card Layout เพื่อให้ใช้งานบนโทรศัพท์มือถือได้สะดวกขึ้น

---

# 📦 Backend Scripts

คำสั่งที่กำหนดไว้ใน `backend/package.json`

```bash
npm run dev
npm run start
npm run prisma:generate
npm run prisma:seed
```

รายละเอียด

```text
npm run dev
→ tsx watch src/server.ts

npm run start
→ tsx src/server.ts

npm run prisma:generate
→ prisma generate

npm run prisma:seed
→ prisma db seed
```

---

# 📦 Frontend Scripts

คำสั่งที่กำหนดไว้ใน `frontend/package.json`

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

รายละเอียด

```text
npm run dev
→ Start Vite Development Server

npm run build
→ Build Production Application

npm run lint
→ Run oxlint

npm run preview
→ Preview Production Build
```

---

# 🐳 Docker Services

ระบบประกอบด้วย Docker Services หลัก 3 ส่วน

```text
postgres
│
├── PostgreSQL 16
└── Port 5433:5432

backend
│
├── Node.js
├── Express
├── TypeScript
├── Prisma
└── Port 5000:5000

frontend
│
├── React
├── Vite
└── Port 5173:5173
```

Backend จะรอจน PostgreSQL ผ่าน Health Check ก่อนเริ่มทำงาน

---

# 🧪 Example Development Workflow

เปิดระบบทั้งหมด

```bash
docker compose up --build
```

ตรวจสอบ Container

```bash
docker compose ps
```

ดู Log

```bash
docker compose logs
```

ดู Backend Log

```bash
docker compose logs backend
```

ดู Frontend Log

```bash
docker compose logs frontend
```

ดู PostgreSQL Log

```bash
docker compose logs postgres
```

หยุดระบบ

```bash
docker compose down
```

---

# 📌 Important Notes

### PostgreSQL

ไม่จำเป็นต้องติดตั้งหรือเปิด pgAdmin เพื่อให้ระบบทำงาน หากใช้งาน PostgreSQL ผ่าน Docker

### Docker Volume

ข้อมูลฐานข้อมูลจะถูกเก็บไว้ใน Docker Volume ชื่อ

```text
postgres_data
```

### Environment Variables

ไม่ควร Commit `.env` ที่มี Secret จริงขึ้น Public Repository

ควรสร้าง `.env.example` สำหรับแสดงตัวอย่าง Environment Variables แทน

ตัวอย่าง

```env
DATABASE_URL=
JWT_SECRET=
PORT=5000
FRONTEND_URL=
```

---

# 🛡 Security

ระบบมีแนวทางด้านความปลอดภัยเบื้องต้น ได้แก่

- Password Hashing ด้วย bcryptjs
- JWT Authentication
- Protected API
- Environment Variables
- CORS Configuration
- Backend Validation
- PDPA Consent
- Audit Logging

---

# 📄 License

โครงการนี้จัดทำขึ้นเพื่อใช้เป็นผลงาน **Proof of Concept (POC)** สำหรับการประเมินภาคปฏิบัติ

---

# 👩‍💻 Developer

**Siriratri Utamamunee**

Information and Communication Technology  
Prince of Songkla University

GitHub: Siriratri12

---

## Prince of Songkla University

**Scholarship Management System**

กองพัฒนานักศึกษาและศิษย์เก่าสัมพันธ์  
มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตหาดใหญ่
