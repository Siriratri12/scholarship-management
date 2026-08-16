import { Router } from "express";

import {
  getDashboard,
} from "../controllers/dashboard.controller.ts";

import {
  authenticateToken,
} from "../middleware/authMiddlewareV2.ts";

const router = Router();

router.get(
  "/",
  authenticateToken,
  getDashboard,
);

export default router;