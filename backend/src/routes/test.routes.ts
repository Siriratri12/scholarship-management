import { Router } from "express";
import {
  authenticateToken,
  AuthRequest,
} from "../middleware/auth.middleware.ts";

const router = Router();

router.get("/protected", authenticateToken, (req: AuthRequest, res) => {
  res.json({
    success: true,
    message: "คุณมีสิทธิ์เข้าถึง API นี้",
    user: req.user,
  });
});

export default router;
