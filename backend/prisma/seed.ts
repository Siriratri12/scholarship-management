import "dotenv/config";

import bcrypt from "bcryptjs";
import pg from "pg";

import { PrismaPg } from "@prisma/adapter-pg";

import {
  PrismaClient,
  ScholarshipStatus,
  ScholarshipType,
  UserRole,
} from "../generated/prisma/client.ts";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const scholarshipData = [
  {
    studentId: "67100001",
    studentName: "กมลชนก ศรีสุข",
    faculty: "คณะวิทยาศาสตร์",
    major: "วิทยาการคอมพิวเตอร์",
    year: 2,
    gpax: 3.12,
    email: "kamonchanok@example.com",
    scholarshipType: "NEEDY",
    requestedAmount: 15000,
    bankAccount: "1234567890",
    reason: "มีความจำเป็นด้านค่าใช้จ่ายในการศึกษา",
    status: "PENDING",
  },
  {
    studentId: "67100002",
    studentName: "ณัฐวุฒิ ใจดี",
    faculty: "คณะวิศวกรรมศาสตร์",
    major: "วิศวกรรมคอมพิวเตอร์",
    year: 3,
    gpax: 3.45,
    email: "nattawut@example.com",
    scholarshipType: "ACADEMIC",
    requestedAmount: 20000,
    bankAccount: "2345678901",
    reason: "มีผลการเรียนดีและต้องการทุนสนับสนุนการศึกษา",
    status: "APPROVED",
  },
  {
    studentId: "67100003",
    studentName: "พิมพ์ชนก แก้วทอง",
    faculty: "คณะมนุษยศาสตร์และสังคมศาสตร์",
    major: "ภาษาอังกฤษ",
    year: 1,
    gpax: 3.01,
    email: "pimchanok@example.com",
    scholarshipType: "NEEDY",
    requestedAmount: 12000,
    bankAccount: "3456789012",
    reason: "ครอบครัวมีรายได้น้อยและมีค่าใช้จ่ายด้านการศึกษา",
    status: "PENDING",
  },
  {
    studentId: "67100004",
    studentName: "ธนภัทร วัฒนะ",
    faculty: "คณะวิศวกรรมศาสตร์",
    major: "วิศวกรรมเครื่องกล",
    year: 4,
    gpax: 2.88,
    email: "thanapat@example.com",
    scholarshipType: "WORK",
    requestedAmount: 10000,
    bankAccount: "4567890123",
    reason: "ต้องการทำงานพิเศษเพื่อช่วยเหลือค่าใช้จ่ายระหว่างเรียน",
    status: "APPROVED",
  },
  {
    studentId: "67100005",
    studentName: "ชลธิชา มณีรัตน์",
    faculty: "คณะวิทยาศาสตร์",
    major: "ชีววิทยา",
    year: 2,
    gpax: 3.25,
    email: "chonlathicha@example.com",
    scholarshipType: "EMERGENCY",
    requestedAmount: 8000,
    bankAccount: "5678901234",
    reason: "มีเหตุฉุกเฉินและมีความจำเป็นต้องใช้เงินเร่งด่วน",
    status: "REJECTED",
  },
  {
    studentId: "67100006",
    studentName: "ศุภกร พรหมรักษา",
    faculty: "คณะศึกษาศาสตร์",
    major: "การศึกษา",
    year: 3,
    gpax: 3.18,
    email: "supakorn@example.com",
    scholarshipType: "ACTIVITY",
    requestedAmount: 7000,
    bankAccount: "6789012345",
    reason: "สนับสนุนค่าใช้จ่ายในการจัดกิจกรรมนักศึกษา",
    status: "APPROVED",
  },
  {
    studentId: "67100007",
    studentName: "นภัสสร ทองคำ",
    faculty: "คณะวิทยาการจัดการ",
    major: "บริหารธุรกิจ",
    year: 2,
    gpax: 2.95,
    email: "napatsorn@example.com",
    scholarshipType: "NEEDY",
    requestedAmount: 15000,
    bankAccount: "7890123456",
    reason: "มีข้อจำกัดด้านค่าใช้จ่ายในครอบครัว",
    status: "PENDING",
  },
  {
    studentId: "67100008",
    studentName: "กิตติพงษ์ สงวนศักดิ์",
    faculty: "คณะเทคโนโลยีและสิ่งแวดล้อม",
    major: "เทคโนโลยีสารสนเทศ",
    year: 4,
    gpax: 3.67,
    email: "kittipong@example.com",
    scholarshipType: "ACADEMIC",
    requestedAmount: 18000,
    bankAccount: "8901234567",
    reason: "มีผลการเรียนดีและต้องการสนับสนุนค่าใช้จ่ายทางการศึกษา",
    status: "APPROVED",
  },
  {
    studentId: "67100009",
    studentName: "สุภัสสรา แสงทอง",
    faculty: "คณะพยาบาลศาสตร์",
    major: "พยาบาลศาสตร์",
    year: 3,
    gpax: 3.21,
    email: "supatsara@example.com",
    scholarshipType: "EMERGENCY",
    requestedAmount: 9000,
    bankAccount: "9012345678",
    reason: "ครอบครัวประสบปัญหาทางการเงินฉุกเฉิน",
    status: "PENDING",
  },
  {
    studentId: "67100010",
    studentName: "วรเมธ ชูช่วย",
    faculty: "คณะวิทยาศาสตร์",
    major: "คณิตศาสตร์",
    year: 2,
    gpax: 2.76,
    email: "woramet@example.com",
    scholarshipType: "WORK",
    requestedAmount: 6000,
    bankAccount: "0123456789",
    reason: "ต้องการทำงานพิเศษระหว่างเรียน",
    status: "REJECTED",
  },
  {
    studentId: "67100011",
    studentName: "อรทัย นวลจันทร์",
    faculty: "คณะศิลปศาสตร์",
    major: "ภาษาไทย",
    year: 1,
    gpax: 3.3,
    email: "orathai@example.com",
    scholarshipType: "ACTIVITY",
    requestedAmount: 5000,
    bankAccount: "1122334455",
    reason: "สนับสนุนกิจกรรมของนักศึกษา",
    status: "APPROVED",
  },
  {
    studentId: "67100012",
    studentName: "ภัทรพล มีสุข",
    faculty: "คณะวิศวกรรมศาสตร์",
    major: "วิศวกรรมไฟฟ้า",
    year: 3,
    gpax: 3.08,
    email: "phattharaphon@example.com",
    scholarshipType: "NEEDY",
    requestedAmount: 14000,
    bankAccount: "2233445566",
    reason: "มีภาระค่าใช้จ่ายด้านการศึกษา",
    status: "PENDING",
  },
  {
    studentId: "67100013",
    studentName: "เมธาวี รุ่งเรือง",
    faculty: "คณะวิทยาศาสตร์",
    major: "เคมี",
    year: 4,
    gpax: 3.82,
    email: "methawi@example.com",
    scholarshipType: "ACADEMIC",
    requestedAmount: 20000,
    bankAccount: "3344556677",
    reason: "มีผลการเรียนดีและต้องการทุนเพื่อศึกษาต่อ",
    status: "APPROVED",
  },
  {
    studentId: "67100014",
    studentName: "รวิภาส อินทร์ทอง",
    faculty: "คณะเศรษฐศาสตร์",
    major: "เศรษฐศาสตร์",
    year: 2,
    gpax: 2.89,
    email: "rawiphat@example.com",
    scholarshipType: "NEEDY",
    requestedAmount: 10000,
    bankAccount: "4455667788",
    reason: "มีความจำเป็นด้านค่าใช้จ่าย",
    status: "REJECTED",
  },
  {
    studentId: "67100015",
    studentName: "ปาริชาติ บุญช่วย",
    faculty: "คณะเภสัชศาสตร์",
    major: "เภสัชศาสตร์",
    year: 5,
    gpax: 3.55,
    email: "parichat@example.com",
    scholarshipType: "EMERGENCY",
    requestedAmount: 11000,
    bankAccount: "5566778899",
    reason: "เกิดเหตุฉุกเฉินภายในครอบครัว",
    status: "PENDING",
  },
  {
    studentId: "67100016",
    studentName: "ธนกร จันทร์ดี",
    faculty: "คณะวิศวกรรมศาสตร์",
    major: "วิศวกรรมโยธา",
    year: 3,
    gpax: 3.1,
    email: "thanakorn@example.com",
    scholarshipType: "WORK",
    requestedAmount: 9000,
    bankAccount: "6677889900",
    reason: "ต้องการหารายได้ระหว่างเรียน",
    status: "APPROVED",
  },
  {
    studentId: "67100017",
    studentName: "กัญญารัตน์ สุวรรณ",
    faculty: "คณะวิทยาการจัดการ",
    major: "การตลาด",
    year: 2,
    gpax: 3.4,
    email: "kanyarat@example.com",
    scholarshipType: "ACTIVITY",
    requestedAmount: 6500,
    bankAccount: "7788990011",
    reason: "สนับสนุนค่าใช้จ่ายในการจัดกิจกรรมนักศึกษา",
    status: "APPROVED",
  },
  {
    studentId: "67100018",
    studentName: "ศรัณย์ พงษ์ศรี",
    faculty: "คณะวิทยาศาสตร์",
    major: "ฟิสิกส์",
    year: 4,
    gpax: 2.68,
    email: "saran@example.com",
    scholarshipType: "NEEDY",
    requestedAmount: 13000,
    bankAccount: "8899001122",
    reason: "มีข้อจำกัดทางการเงิน",
    status: "PENDING",
  },
  {
    studentId: "67100019",
    studentName: "ณิชารีย์ สุขใจ",
    faculty: "คณะศิลปศาสตร์",
    major: "ภาษาอังกฤษ",
    year: 3,
    gpax: 3.62,
    email: "nicharee@example.com",
    scholarshipType: "ACADEMIC",
    requestedAmount: 16000,
    bankAccount: "9900112233",
    reason: "ผลการเรียนดีและมีความตั้งใจศึกษา",
    status: "APPROVED",
  },
  {
    studentId: "67100020",
    studentName: "ชยพล คงมั่น",
    faculty: "คณะเทคโนโลยีและสิ่งแวดล้อม",
    major: "เทคโนโลยีสารสนเทศ",
    year: 1,
    gpax: 2.92,
    email: "chayaphon@example.com",
    scholarshipType: "WORK",
    requestedAmount: 7500,
    bankAccount: "1001223344",
    reason: "ต้องการช่วยแบ่งเบาภาระค่าใช้จ่ายของครอบครัว",
    status: "REJECTED",
  },
  {
    studentId: "67100021",
    studentName: "พัชราภรณ์ ใจงาม",
    faculty: "คณะพยาบาลศาสตร์",
    major: "พยาบาลศาสตร์",
    year: 2,
    gpax: 3.15,
    email: "patcharaporn@example.com",
    scholarshipType: "EMERGENCY",
    requestedAmount: 10000,
    bankAccount: "2112334455",
    reason: "มีเหตุจำเป็นเร่งด่วน",
    status: "PENDING",
  },
  {
    studentId: "67100022",
    studentName: "ธีรภัทร แก้วใส",
    faculty: "คณะวิศวกรรมศาสตร์",
    major: "วิศวกรรมคอมพิวเตอร์",
    year: 4,
    gpax: 3.72,
    email: "teerapat@example.com",
    scholarshipType: "ACADEMIC",
    requestedAmount: 22000,
    bankAccount: "3223445566",
    reason: "มีผลการเรียนดีเด่น",
    status: "APPROVED",
  },
  {
    studentId: "67100023",
    studentName: "มินตรา ศรีทอง",
    faculty: "คณะมนุษยศาสตร์และสังคมศาสตร์",
    major: "สังคมศาสตร์",
    year: 2,
    gpax: 2.84,
    email: "mintra@example.com",
    scholarshipType: "NEEDY",
    requestedAmount: 12500,
    bankAccount: "4334556677",
    reason: "ครอบครัวมีรายได้จำกัด",
    status: "REJECTED",
  },
  {
    studentId: "67100024",
    studentName: "เอกภพ รัตนชัย",
    faculty: "คณะวิทยาศาสตร์",
    major: "วิทยาการคอมพิวเตอร์",
    year: 3,
    gpax: 3.28,
    email: "ekaphop@example.com",
    scholarshipType: "ACTIVITY",
    requestedAmount: 5500,
    bankAccount: "5445667788",
    reason: "สนับสนุนการจัดกิจกรรมของนักศึกษา",
    status: "PENDING",
  },
  {
    studentId: "67100025",
    studentName: "สิริกานต์ พัฒนดี",
    faculty: "คณะวิทยาการจัดการ",
    major: "การจัดการ",
    year: 4,
    gpax: 3.48,
    email: "sirikan@example.com",
    scholarshipType: "NEEDY",
    requestedAmount: 15000,
    bankAccount: "6556778899",
    reason: "ต้องการความช่วยเหลือด้านค่าใช้จ่ายทางการศึกษา",
    status: "APPROVED",
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  // ==================================================
  // ADMIN
  // ==================================================

  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: {
      username: "admin",
    },

    update: {
      passwordHash,
      fullName: "ผู้ดูแลระบบ",
      role: UserRole.ADMIN,
    },

    create: {
      username: "admin",
      passwordHash,
      fullName: "ผู้ดูแลระบบ",
      role: UserRole.ADMIN,
    },
  });

  console.log(`👤 Admin created: ${admin.username}`);

  // ==================================================
  // SCHOLARSHIP REQUESTS
  // ==================================================

  for (let i = 0; i < scholarshipData.length; i++) {
    const item = scholarshipData[i];

    const requestNumber = `SCH-2026-${String(i + 1).padStart(4, "0")}`;

    await prisma.scholarshipRequest.upsert({
      where: {
        requestNumber,
      },

      update: {},

      create: {
        requestNumber,

        studentId: item.studentId,
        studentName: item.studentName,
        faculty: item.faculty,
        major: item.major,

        year: item.year,
        gpax: item.gpax,

        email: item.email,

        scholarshipType: item.scholarshipType as ScholarshipType,

        requestedAmount: item.requestedAmount,

        bankAccount: item.bankAccount,
        reason: item.reason,

        status: item.status as ScholarshipStatus,

        pdpaConsent: true,
        pdpaConsentAt: new Date(),
      },
    });
  }

  console.log(`📋 Scholarship requests: ${scholarshipData.length}`);

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
