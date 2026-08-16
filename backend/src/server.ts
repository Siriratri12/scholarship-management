import "dotenv/config";

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.ts";
import scholarshipRoutes from "./routes/scholarship.routes.ts";
import dashboardRoutes from "./routes/dashboard.routes.ts";

const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.get("/api/health", (_req, res) => {
  return res.json({
    success: true,
    message: "Scholarship Management API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/scholarships", scholarshipRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use((_req, res) => {
  return res.status(404).json({
    success: false,
    message: "ไม่พบ API Endpoint",
  });
});

app.listen(PORT, () => {
  console.log("");
  console.log("==========================================");
  console.log("🎓 Scholarship Management System");
  console.log(`🚀 API Server: http://localhost:${PORT}`);
  console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
  console.log("==========================================");
  console.log("");
});
