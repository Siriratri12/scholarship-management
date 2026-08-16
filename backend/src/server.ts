import "dotenv/config";

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.ts";
import scholarshipRoutes from "./routes/scholarship.routes.ts";
import dashboardRoutes from "./routes/dashboard.routes.ts";

const app = express();

const PORT = Number(process.env.PORT) || 5000;

// =========================================================
// CORS
// =========================================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://scholarship-management-azure.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // อนุญาต request ที่ไม่มี origin เช่น Postman / server-to-server
      if (!origin) {
        return callback(null, true);
      }

      // อนุญาต localhost และ production domain
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // อนุญาต Vercel deployment / preview URL
      if (
        origin.startsWith("https://scholarship-management-") &&
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      console.warn("Blocked by CORS:", origin);

      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// รองรับ preflight request
app.options("*", cors());

// =========================================================
// BODY PARSER
// =========================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// =========================================================
// HEALTH CHECK
// =========================================================

app.get("/api/health", (_req, res) => {
  return res.json({
    success: true,
    message: "Scholarship Management API is running",
  });
});

// =========================================================
// ROUTES
// =========================================================

app.use("/api/auth", authRoutes);

app.use("/api/scholarships", scholarshipRoutes);

app.use("/api/dashboard", dashboardRoutes);

// =========================================================
// 404
// =========================================================

app.use((_req, res) => {
  return res.status(404).json({
    success: false,
    message: "ไม่พบ API Endpoint",
  });
});

// =========================================================
// START SERVER
// =========================================================

app.listen(PORT, () => {
  console.log("");
  console.log("==========================================");
  console.log("🎓 Scholarship Management System");
  console.log(`🚀 API Server: http://localhost:${PORT}`);
  console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
  console.log("==========================================");
  console.log("");
});
