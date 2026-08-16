import { Router } from "express";

import { getMe, login } from "../controllers/auth.controller.ts";

import { authenticateToken } from "../middleware/authMiddlewareV2.ts";

const router = Router();

router.post("/login", login);

router.get("/me", authenticateToken, getMe);

export default router;
