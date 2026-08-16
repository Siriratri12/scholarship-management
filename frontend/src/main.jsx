import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

// หน้าสาธารณะ
import LandingPage from "./pages/LandingPage.jsx";
import ScholarshipForm from "./components/ScholarshipForm.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CheckStatusPage from "./pages/CheckStatusPage.jsx";

// Layout และหน้า Admin
import AdminLayout from "./components/AdminLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ScholarshipsPage from "./pages/ScholarshipsPage.jsx";
import ScholarshipDetail from "./pages/ScholarshipDetail.jsx";
import ApplyPage from "./pages/ApplyPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/check-status" element={<CheckStatusPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* หน้าฝั่งเจ้าหน้าที่ */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          <Route path="/scholarships/:id" element={<ScholarshipDetail />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
