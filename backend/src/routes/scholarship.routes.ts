import { Router } from "express";

import {
  checkScholarshipStatus,
  createScholarship,
  createScholarshipByStaff,
  deleteScholarship,
  getScholarshipById,
  getScholarships,
  updateScholarship,
  updateScholarshipStatus,
} from "../controllers/scholarship.controller.ts";

import { authenticateToken } from "../middleware/authMiddlewareV2.ts";

const router = Router();

// นักศึกษายื่นคำขอ - Public
router.post("/", createScholarship);

//ตรวจสอบคำขอ
router.get("/check-status", checkScholarshipStatus);

// เจ้าหน้าที่ดูรายการ
router.get("/", authenticateToken, getScholarships);

// เจ้าหน้าที่เพิ่มคำขอ
router.post("/staff", authenticateToken, createScholarshipByStaff);

// รายละเอียด
router.get("/:id", authenticateToken, getScholarshipById);

// แก้ไข
router.put("/:id", authenticateToken, updateScholarship);

// อนุมัติ / ไม่อนุมัติ
router.patch("/:id/status", authenticateToken, updateScholarshipStatus);

// Soft Delete
router.delete("/:id", authenticateToken, deleteScholarship);

export default router;
