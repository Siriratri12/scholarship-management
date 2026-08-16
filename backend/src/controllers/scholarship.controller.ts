import type { Request, Response } from "express";

import { prisma } from "../config/database.ts";

import {
  ScholarshipStatus,
  ScholarshipType,
} from "../../generated/prisma/client.ts";

import type { AuthRequest } from "../middleware/authMiddlewareV2.ts";

const typeMap: Record<string, ScholarshipType> = {
  NEEDY: ScholarshipType.NEEDY,
  ACADEMIC: ScholarshipType.ACADEMIC,
  WORK: ScholarshipType.WORK,
  EMERGENCY: ScholarshipType.EMERGENCY,
  ACTIVITY: ScholarshipType.ACTIVITY,

  ทุนขาดแคลนทุนทรัพย์: ScholarshipType.NEEDY,
  "ทุนส่งเสริมการศึกษา (เรียนดี)": ScholarshipType.ACADEMIC,
  "ทุนทำงานพิเศษ (นักศึกษาช่วยงาน)": ScholarshipType.WORK,
  "ทุนฉุกเฉิน/ช่วยเหลือกรณีพิเศษ": ScholarshipType.EMERGENCY,
  ทุนกิจกรรมนักศึกษา: ScholarshipType.ACTIVITY,
};

function parseType(value: unknown) {
  return typeMap[String(value ?? "").trim()] ?? null;
}

function validate(body: any) {
  const studentId = String(body.studentId ?? "").trim();
  const studentName = String(body.studentName ?? "").trim();
  const faculty = String(body.faculty ?? "").trim();
  const major = String(body.major ?? "").trim();
  const email = String(body.email ?? "").trim();
  const bankAccount = String(body.bankAccount ?? "").trim();
  const reason = String(body.reason ?? "").trim();

  const year = Number(body.year);
  const gpax = Number(body.gpax);
  const requestedAmount = Number(body.requestedAmount);
  const scholarshipType = parseType(body.scholarshipType);

  if (
    !studentId ||
    !studentName ||
    !faculty ||
    !major ||
    !email ||
    !bankAccount ||
    !reason ||
    !scholarshipType
  ) {
    return {
      error: "กรุณากรอกข้อมูลให้ครบถ้วน",
    };
  }

  if (!Number.isInteger(year) || year < 1 || year > 8) {
    return {
      error: "ชั้นปีไม่ถูกต้อง",
    };
  }

  if (Number.isNaN(gpax) || gpax < 0 || gpax > 4) {
    return {
      error: "GPAX ต้องอยู่ระหว่าง 0 - 4",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      error: "รูปแบบอีเมลไม่ถูกต้อง",
    };
  }

  if (Number.isNaN(requestedAmount) || requestedAmount <= 0) {
    return {
      error: "จำนวนเงินต้องมากกว่า 0",
    };
  }

  return {
    data: {
      studentId,
      studentName,
      faculty,
      major,
      year,
      gpax,
      email,
      scholarshipType,
      requestedAmount,
      bankAccount,
      reason,
    },
  };
}

async function generateRequestNumber() {
  const last = await prisma.scholarshipRequest.findFirst({
    orderBy: {
      id: "desc",
    },
    select: {
      id: true,
    },
  });

  const next = (last?.id ?? 0) + 1;

  return `SCH-${new Date().getFullYear()}-${String(next).padStart(5, "0")}`;
}

export async function createScholarship(req: Request, res: Response) {
  try {
    if (req.body.pdpaConsent !== true) {
      return res.status(400).json({
        success: false,
        message: "กรุณายอมรับ PDPA",
      });
    }

    const result = validate(req.body);

    if ("error" in result) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    const requestNumber = await generateRequestNumber();

    const scholarship = await prisma.scholarshipRequest.create({
      data: {
        ...result.data!,
        requestNumber,
        pdpaConsent: true,
        pdpaConsentAt: new Date(),
        status: ScholarshipStatus.PENDING,
      },
    });

    return res.status(201).json({
      success: true,
      message: "ส่งคำขอทุนสำเร็จ",
      data: scholarship,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "ไม่สามารถสร้างคำขอทุนได้",
    });
  }
}

export async function createScholarshipByStaff(
  req: AuthRequest,
  res: Response,
) {
  try {
    const result = validate(req.body);

    if ("error" in result) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    const requestNumber = await generateRequestNumber();

    const scholarship = await prisma.scholarshipRequest.create({
      data: {
        ...result.data!,
        requestNumber,
        pdpaConsent: req.body.pdpaConsent === true,
        pdpaConsentAt: req.body.pdpaConsent === true ? new Date() : null,
        status: ScholarshipStatus.PENDING,
      },
    });

    return res.status(201).json({
      success: true,
      message: "เพิ่มคำขอทุนสำเร็จ",
      data: scholarship,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "ไม่สามารถเพิ่มคำขอทุนได้",
    });
  }
}

export async function getScholarships(req: AuthRequest, res: Response) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = 10;

    const search = String(req.query.search ?? "").trim();

    const status = String(req.query.status ?? "")
      .trim()
      .toUpperCase();

    const type = String(req.query.scholarshipType ?? req.query.type ?? "")
      .trim()
      .toUpperCase();

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        {
          requestNumber: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          studentId: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          studentName: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (
      Object.values(ScholarshipStatus).includes(status as ScholarshipStatus)
    ) {
      where.status = status;
    }

    if (Object.values(ScholarshipType).includes(type as ScholarshipType)) {
      where.scholarshipType = type;
    }

    const [items, total] = await Promise.all([
      prisma.scholarshipRequest.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.scholarshipRequest.count({
        where,
      }),
    ]);

    return res.json({
      success: true,
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "ไม่สามารถโหลดรายการได้",
    });
  }
}

export async function getScholarshipById(req: AuthRequest, res: Response) {
  try {
    const id = Number(req.params.id);

    const scholarship = await prisma.scholarshipRequest.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบคำขอทุน",
      });
    }

    return res.json({
      success: true,
      data: scholarship,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "ไม่สามารถโหลดข้อมูลได้",
    });
  }
}

export async function updateScholarship(req: AuthRequest, res: Response) {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.scholarshipRequest.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบคำขอทุน",
      });
    }

    const result = validate(req.body);

    if ("error" in result) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    const updated = await prisma.scholarshipRequest.update({
      where: {
        id,
      },
      data: result.data!,
    });

    return res.json({
      success: true,
      message: "แก้ไขสำเร็จ",
      data: updated,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "ไม่สามารถแก้ไขได้",
    });
  }
}

export async function updateScholarshipStatus(req: AuthRequest, res: Response) {
  try {
    const id = Number(req.params.id);

    const status = String(req.body.status ?? "")
      .trim()
      .toUpperCase();

    if (
      status !== ScholarshipStatus.APPROVED &&
      status !== ScholarshipStatus.REJECTED
    ) {
      return res.status(400).json({
        success: false,
        message: "สถานะไม่ถูกต้อง",
      });
    }

    const existing = await prisma.scholarshipRequest.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบคำขอทุน",
      });
    }

    if (existing.status !== ScholarshipStatus.PENDING) {
      return res.status(400).json({
        success: false,
        message: "พิจารณาได้เฉพาะคำขอรอพิจารณา",
      });
    }

    const updated = await prisma.scholarshipRequest.update({
      where: {
        id,
      },
      data: {
        status: status as ScholarshipStatus,
        staffNote: req.body.staffNote ?? null,
      },
    });

    return res.json({
      success: true,
      message: "เปลี่ยนสถานะสำเร็จ",
      data: updated,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "ไม่สามารถเปลี่ยนสถานะได้",
    });
  }
}

export async function deleteScholarship(req: AuthRequest, res: Response) {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.scholarshipRequest.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบคำขอทุน",
      });
    }

    if (existing.status !== ScholarshipStatus.PENDING) {
      return res.status(400).json({
        success: false,
        message: "ลบได้เฉพาะคำขอรอพิจารณา",
      });
    }

    await prisma.scholarshipRequest.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return res.json({
      success: true,
      message: "ลบคำขอทุนสำเร็จ",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "ไม่สามารถลบได้",
    });
  }
}

// ======================================================
// PUBLIC: Student ตรวจสอบสถานะคำขอทุน
// ======================================================

export async function checkScholarshipStatus(req: Request, res: Response) {
  try {
    const requestNumber =
      typeof req.query.requestNumber === "string"
        ? req.query.requestNumber.trim()
        : "";

    const studentId =
      typeof req.query.studentId === "string" ? req.query.studentId.trim() : "";

    if (!requestNumber || !studentId) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุเลขที่คำขอและรหัสนักศึกษา",
      });
    }

    const scholarship = await prisma.scholarshipRequest.findFirst({
      where: {
        requestNumber,
        studentId,
        deletedAt: null,
      },

      select: {
        id: true,
        requestNumber: true,

        studentId: true,
        studentName: true,

        faculty: true,
        major: true,

        scholarshipType: true,
        requestedAmount: true,

        bankAccount: true,

        status: true,
        staffNote: true,

        createdAt: true,
        updatedAt: true,
      },
    });

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบคำขอทุน กรุณาตรวจสอบเลขที่คำขอและรหัสนักศึกษาอีกครั้ง",
      });
    }

    // Data Masking
    const bankAccount = scholarship.bankAccount || "";

    const maskedBankAccount =
      bankAccount.length > 4
        ? `${"*".repeat(bankAccount.length - 4)}${bankAccount.slice(-4)}`
        : "****";

    return res.status(200).json({
      success: true,

      data: {
        ...scholarship,

        requestedAmount: Number(scholarship.requestedAmount),

        bankAccount: maskedBankAccount,
      },
    });
  } catch (error) {
    console.error("Check scholarship status error:", error);

    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการตรวจสอบสถานะคำขอ",
    });
  }
}
