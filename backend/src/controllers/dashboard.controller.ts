import type { Response } from "express";

import { prisma } from "../config/database.ts";

import { ScholarshipStatus } from "../../generated/prisma/client.ts";

import type { AuthRequest } from "../middleware/authMiddlewareV2.ts";

export async function getDashboard(_req: AuthRequest, res: Response) {
  try {
    const baseWhere = {
      deletedAt: null,
    };

    const [total, pending, approved, rejected, byType] = await Promise.all([
      prisma.scholarshipRequest.count({
        where: baseWhere,
      }),

      prisma.scholarshipRequest.count({
        where: {
          ...baseWhere,
          status: ScholarshipStatus.PENDING,
        },
      }),

      prisma.scholarshipRequest.count({
        where: {
          ...baseWhere,
          status: ScholarshipStatus.APPROVED,
        },
      }),

      prisma.scholarshipRequest.count({
        where: {
          ...baseWhere,
          status: ScholarshipStatus.REJECTED,
        },
      }),

      prisma.scholarshipRequest.groupBy({
        by: ["scholarshipType"],

        where: baseWhere,

        _count: {
          _all: true,
        },

        _sum: {
          requestedAmount: true,
        },
      }),
    ]);

    const scholarshipTypes = byType.map((item: (typeof byType)[number]) => ({
      scholarshipType: item.scholarshipType,

      count: item._count._all,

      totalAmount: Number(item._sum.requestedAmount ?? 0),
    }));

    return res.status(200).json({
      success: true,

      data: {
        summary: {
          total,
          pending,
          approved,
          rejected,
        },

        scholarshipTypes,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "ไม่สามารถโหลด Dashboard ได้",
    });
  }
}
