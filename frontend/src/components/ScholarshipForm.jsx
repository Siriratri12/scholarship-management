import { useEffect, useState } from "react";
import {
  AlertCircle,
  Banknote,
  BookOpen,
  Building2,
  CheckCircle2,
  FileText,
  GraduationCap,
  Landmark,
  LoaderCircle,
  Mail,
  Save,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

import "../App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const scholarshipTypeOptions = [
  {
    value: "ทุนขาดแคลนทุนทรัพย์",
    label: "ทุนขาดแคลนทุนทรัพย์",
  },
  {
    value: "ทุนส่งเสริมการศึกษา (เรียนดี)",
    label: "ทุนส่งเสริมการศึกษา (เรียนดี)",
  },
  {
    value: "ทุนทำงานพิเศษ (นักศึกษาช่วยงาน)",
    label: "ทุนทำงานพิเศษ (นักศึกษาช่วยงาน)",
  },
  {
    value: "ทุนฉุกเฉิน/ช่วยเหลือกรณีพิเศษ",
    label: "ทุนฉุกเฉิน/ช่วยเหลือกรณีพิเศษ",
  },
  {
    value: "ทุนกิจกรรมนักศึกษา",
    label: "ทุนกิจกรรมนักศึกษา",
  },
];

export default function ScholarshipForm({ initialData, onClose, onSave }) {
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    faculty: "",
    major: "",
    year: "1",
    gpax: "",
    email: "",
    scholarshipType: "ทุนขาดแคลนทุนทรัพย์",
    requestedAmount: "",
    bankName: "",
    bankAccount: "",
    reason: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(initialData?.id);

  useEffect(() => {
    if (!initialData) {
      setFormData({
        studentId: "",
        studentName: "",
        faculty: "",
        major: "",
        year: "1",
        gpax: "",
        email: "",
        scholarshipType: "ทุนขาดแคลนทุนทรัพย์",
        requestedAmount: "",
        bankName: "",
        bankAccount: "",
        reason: "",
      });

      return;
    }

    setFormData({
      studentId: initialData.studentId || "",
      studentName: initialData.studentName || "",
      faculty: initialData.faculty || "",
      major: initialData.major || "",
      year: String(initialData.year || "1"),

      gpax:
        initialData.gpax !== undefined && initialData.gpax !== null
          ? String(initialData.gpax)
          : "",

      email: initialData.email || "",

      scholarshipType: initialData.scholarshipType || "ทุนขาดแคลนทุนทรัพย์",

      requestedAmount:
        initialData.requestedAmount !== undefined &&
        initialData.requestedAmount !== null
          ? String(initialData.requestedAmount)
          : "",

      bankName: initialData.bankName || "",
      bankAccount: initialData.bankAccount || "",
      reason: initialData.reason || "",
    });
  }, [initialData]);

  const updateField = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    if (!formData.studentId.trim()) {
      return "กรุณากรอกรหัสนักศึกษา";
    }

    if (!/^\d{10}$/.test(formData.studentId.trim())) {
      return "รหัสนักศึกษาต้องเป็นตัวเลข 10 หลัก";
    }

    if (!formData.studentName.trim()) {
      return "กรุณากรอกชื่อ - นามสกุล";
    }

    if (!formData.faculty.trim()) {
      return "กรุณากรอกคณะ";
    }

    if (!formData.major.trim()) {
      return "กรุณากรอกสาขาวิชา";
    }

    const yearNumber = Number(formData.year);

    if (!Number.isInteger(yearNumber) || yearNumber < 1 || yearNumber > 8) {
      return "กรุณาเลือกชั้นปีให้ถูกต้อง";
    }

    if (formData.gpax === "") {
      return "กรุณากรอกเกรดเฉลี่ย (GPAX)";
    }

    const gpaxNumber = Number(formData.gpax);

    if (Number.isNaN(gpaxNumber) || gpaxNumber < 0 || gpaxNumber > 4) {
      return "กรุณากรอกเกรดเฉลี่ย (GPAX) ระหว่าง 0.00 ถึง 4.00";
    }

    if (!formData.email.trim()) {
      return "กรุณากรอกอีเมล";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email.trim())) {
      return "กรุณากรอกรูปแบบอีเมลให้ถูกต้อง เช่น student@psu.ac.th";
    }

    if (formData.requestedAmount === "") {
      return "กรุณากรอกจำนวนเงินที่ขอรับทุน";
    }

    const amountNumber = Number(formData.requestedAmount);

    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      return "จำนวนเงินที่ขอรับทุนต้องมากกว่า 0 บาท";
    }

    if (!formData.bankAccount.trim()) {
      return "กรุณากรอกเลขที่บัญชีธนาคาร";
    }

    if (!/^\d+$/.test(formData.bankAccount.trim())) {
      return "เลขที่บัญชีธนาคารต้องเป็นตัวเลขเท่านั้น";
    }

    if (formData.bankAccount.trim().length < 10) {
      return "กรุณาตรวจสอบเลขที่บัญชีธนาคารให้ถูกต้อง";
    }

    if (!formData.reason.trim()) {
      return "กรุณากรอกเหตุผลความจำเป็นในการขอรับทุน";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      const modal = document.querySelector(".scholarship-form-content");

      modal?.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
      setLoading(false);
      return;
    }

    const url = isEdit
      ? `${API_URL}/api/scholarships/${initialData.id}`
      : `${API_URL}/api/scholarships/staff`;

    const method = isEdit ? "PUT" : "POST";

    try {
      const payload = {
        studentId: formData.studentId.trim(),

        studentName: formData.studentName.trim(),

        faculty: formData.faculty.trim(),

        major: formData.major.trim(),

        year: Number(formData.year),

        gpax: Number(formData.gpax),

        email: formData.email.trim(),

        scholarshipType: formData.scholarshipType,

        requestedAmount: Number(formData.requestedAmount),

        bankAccount: formData.bankAccount.trim(),

        reason: formData.reason.trim(),
      };

      if (!isEdit) {
        payload.pdpaConsent = false;
      }

      const res = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        throw new Error("Session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }

      if (onSave) {
        await onSave();
      }

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Scholarship form error:", err);

      setError(err.message || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");

      const modal = document.querySelector(".scholarship-form-content");

      modal?.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="scholarship-form-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose?.();
        }
      }}
    >
      <div className="scholarship-form-modal">
        {/* HEADER */}

        <header className="scholarship-form-header">
          <div className="scholarship-form-heading">
            <div
              className={`scholarship-form-header-icon ${
                isEdit ? "edit" : "create"
              }`}
            >
              {isEdit ? <FileText size={21} /> : <UserRound size={21} />}
            </div>

            <div>
              <span>
                {isEdit
                  ? "EDIT SCHOLARSHIP REQUEST"
                  : "NEW SCHOLARSHIP REQUEST"}
              </span>

              <h2>{isEdit ? "แก้ไขคำขอทุนการศึกษา" : "เพิ่มคำขอทุนใหม่"}</h2>

              <p>
                {isEdit
                  ? `แก้ไขข้อมูลคำขอ ${
                      initialData?.requestNumber || `#${initialData?.id}`
                    }`
                  : "บันทึกคำขอแทนนักศึกษาโดยเจ้าหน้าที่"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="scholarship-form-close"
            onClick={onClose}
            disabled={loading}
            aria-label="ปิด"
          >
            <X size={19} />
          </button>
        </header>

        {/* CONTENT */}

        <div className="scholarship-form-content">
          {error && (
            <div className="scholarship-form-error">
              <AlertCircle size={18} />

              <div>
                <strong>กรุณาตรวจสอบข้อมูล</strong>

                <span>{error}</span>
              </div>
            </div>
          )}

          {isEdit && initialData?.status && (
            <div className="scholarship-form-status">
              <div>
                {initialData.status === "APPROVED" ? (
                  <CheckCircle2 size={17} />
                ) : initialData.status === "REJECTED" ? (
                  <AlertCircle size={17} />
                ) : (
                  <FileText size={17} />
                )}

                <span>สถานะคำขอปัจจุบัน</span>
              </div>

              <StatusBadge status={initialData.status} />
            </div>
          )}

          <form id="scholarship-admin-form" onSubmit={handleSubmit}>
            {/* STUDENT */}

            <FormSection
              icon={UserRound}
              title="ข้อมูลนักศึกษา"
              description="ข้อมูลส่วนตัวและข้อมูลการศึกษาของผู้ยื่นคำขอ"
            >
              <div className="scholarship-form-grid">
                <FormField
                  label="รหัสนักศึกษา"
                  required
                  icon={FileText}
                  placeholder="เช่น 6510110001"
                  value={formData.studentId}
                  maxLength={10}
                  inputMode="numeric"
                  onChange={(value) =>
                    updateField("studentId", value.replace(/\D/g, ""))
                  }
                />

                <FormField
                  label="ชื่อ - นามสกุล"
                  required
                  icon={UserRound}
                  placeholder="นายสมชาย เรียนดี"
                  value={formData.studentName}
                  onChange={(value) => updateField("studentName", value)}
                />

                <FormField
                  label="คณะ"
                  required
                  icon={Building2}
                  placeholder="เช่น คณะวิศวกรรมศาสตร์"
                  value={formData.faculty}
                  onChange={(value) => updateField("faculty", value)}
                />

                <FormField
                  label="สาขาวิชา"
                  required
                  icon={BookOpen}
                  placeholder="เช่น วิศวกรรมคอมพิวเตอร์"
                  value={formData.major}
                  onChange={(value) => updateField("major", value)}
                />

                <div className="scholarship-form-field">
                  <FormLabel required>ชั้นปี</FormLabel>

                  <div className="scholarship-input-wrapper">
                    <GraduationCap size={15} />

                    <select
                      value={formData.year}
                      onChange={(e) => updateField("year", e.target.value)}
                    >
                      <option value="1">ชั้นปีที่ 1</option>

                      <option value="2">ชั้นปีที่ 2</option>

                      <option value="3">ชั้นปีที่ 3</option>

                      <option value="4">ชั้นปีที่ 4</option>

                      <option value="5">ชั้นปีที่ 5</option>

                      <option value="6">ชั้นปีที่ 6</option>
                    </select>
                  </div>
                </div>

                <FormField
                  label="GPAX"
                  required
                  icon={GraduationCap}
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  placeholder="เช่น 3.25"
                  value={formData.gpax}
                  helper="ค่าระหว่าง 0.00 - 4.00"
                  onChange={(value) => updateField("gpax", value)}
                />

                <div className="scholarship-form-full">
                  <FormField
                    label="อีเมลติดต่อ"
                    required
                    icon={Mail}
                    type="email"
                    placeholder="student@psu.ac.th"
                    value={formData.email}
                    onChange={(value) => updateField("email", value)}
                  />
                </div>
              </div>
            </FormSection>

            {/* SCHOLARSHIP */}

            <FormSection
              icon={WalletCards}
              title="ข้อมูลทุนการศึกษา"
              description="ประเภททุนและจำนวนเงินที่นักศึกษาต้องการขอรับ"
            >
              <div className="scholarship-form-grid">
                <div className="scholarship-form-field">
                  <FormLabel required>ประเภททุน</FormLabel>

                  <div className="scholarship-input-wrapper">
                    <WalletCards size={15} />

                    <select
                      value={formData.scholarshipType}
                      onChange={(e) =>
                        updateField("scholarshipType", e.target.value)
                      }
                    >
                      {scholarshipTypeOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <FormField
                  label="จำนวนเงินที่ขอรับ"
                  required
                  icon={Banknote}
                  type="number"
                  min="1"
                  placeholder="เช่น 5000"
                  value={formData.requestedAmount}
                  suffix="บาท"
                  onChange={(value) => updateField("requestedAmount", value)}
                />
              </div>

              <div className="scholarship-form-reason">
                <FormLabel required>เหตุผลความจำเป็นในการขอรับทุน</FormLabel>

                <textarea
                  rows="4"
                  maxLength={1000}
                  placeholder="อธิบายเหตุผลความจำเป็นในการขอรับทุน..."
                  value={formData.reason}
                  onChange={(e) => updateField("reason", e.target.value)}
                />

                <div className="scholarship-character-count">
                  {formData.reason.length}
                  /1000
                </div>
              </div>
            </FormSection>

            {/* BANK */}

            <FormSection
              icon={Landmark}
              title="ข้อมูลบัญชีธนาคาร"
              description="ข้อมูลบัญชีสำหรับรับเงินทุนการศึกษา"
            >
              <div className="scholarship-form-grid">
                <FormField
                  label="ธนาคาร"
                  icon={Building2}
                  placeholder="เช่น ธนาคารกรุงไทย"
                  value={formData.bankName}
                  onChange={(value) => updateField("bankName", value)}
                />

                <FormField
                  label="เลขที่บัญชีธนาคาร"
                  required
                  icon={Landmark}
                  placeholder="กรอกเลขที่บัญชี"
                  value={formData.bankAccount}
                  inputMode="numeric"
                  maxLength={15}
                  onChange={(value) =>
                    updateField("bankAccount", value.replace(/\D/g, ""))
                  }
                />
              </div>

              <div className="scholarship-bank-notice">
                <AlertCircle size={14} />

                <span>
                  ชื่อธนาคารเป็นข้อมูลประกอบบนหน้าฟอร์มในเวอร์ชัน POC
                  และยังไม่ได้จัดเก็บในฐานข้อมูล
                </span>
              </div>
            </FormSection>

            {!isEdit && (
              <div className="scholarship-staff-notice">
                <div>
                  <FileText size={17} />
                </div>

                <div>
                  <strong>การรับเรื่องแทนนักศึกษา</strong>

                  <p>
                    รายการนี้จะถูกสร้างโดยบัญชีเจ้าหน้าที่
                    และบันทึกเข้าสู่ระบบในสถานะ “รอพิจารณา”
                  </p>
                </div>
              </div>
            )}

            {isEdit && initialData?.status && (
              <div className="scholarship-edit-note">
                <AlertCircle size={15} />

                <span>
                  การแก้ไขข้อมูลในหน้านี้ไม่เปลี่ยนสถานะคำขอ
                  หากต้องการอนุมัติหรือไม่อนุมัติ ให้ใช้เมนู “พิจารณา”
                  ในหน้ารายการคำขอ
                </span>
              </div>
            )}
          </form>
        </div>

        {/* FOOTER */}

        <footer className="scholarship-form-footer">
          <button
            type="button"
            className="scholarship-form-cancel"
            onClick={onClose}
            disabled={loading}
          >
            ยกเลิก
          </button>

          <button
            type="submit"
            form="scholarship-admin-form"
            className="scholarship-form-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle size={16} className="scholarship-form-spinner" />
                กำลังบันทึก...
              </>
            ) : (
              <>
                <Save size={16} />

                {isEdit ? "บันทึกการเปลี่ยนแปลง" : "บันทึกคำขอ"}
              </>
            )}
          </button>
        </footer>
      </div>

      <ScholarshipFormStyles />
    </div>
  );
}

function FormSection({ icon: Icon, title, description, children }) {
  return (
    <section className="scholarship-form-section">
      <div className="scholarship-form-section-heading">
        <div>
          <Icon size={17} />
        </div>

        <span>
          <strong>{title}</strong>

          <small>{description}</small>
        </span>
      </div>

      <div className="scholarship-form-section-content">{children}</div>
    </section>
  );
}

function FormLabel({ children, required }) {
  return (
    <label className="scholarship-form-label">
      {children}

      {required && <span>*</span>}
    </label>
  );
}

function FormField({
  label,
  required = false,
  icon: Icon,
  value,
  onChange,
  type = "text",
  placeholder,
  step,
  min,
  max,
  maxLength,
  inputMode,
  helper,
  suffix,
}) {
  return (
    <div className="scholarship-form-field">
      <FormLabel required={required}>{label}</FormLabel>

      <div className="scholarship-input-wrapper">
        {Icon && <Icon size={15} />}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          step={step}
          min={min}
          max={max}
          maxLength={maxLength}
          inputMode={inputMode}
          onChange={(e) => onChange(e.target.value)}
        />

        {suffix && <span className="scholarship-input-suffix">{suffix}</span>}
      </div>

      {helper && <small className="scholarship-form-helper">{helper}</small>}
    </div>
  );
}

function StatusBadge({ status }) {
  const statusConfig = {
    PENDING: {
      label: "รอพิจารณา",
      className: "pending",
    },

    APPROVED: {
      label: "อนุมัติแล้ว",
      className: "approved",
    },

    REJECTED: {
      label: "ไม่อนุมัติ",
      className: "rejected",
    },
  };

  const current = statusConfig[status] || statusConfig.PENDING;

  return (
    <span className={`scholarship-form-status-badge ${current.className}`}>
      {current.label}
    </span>
  );
}

function ScholarshipFormStyles() {
  return (
    <style>
      {`
        .scholarship-form-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          box-sizing: border-box;
          background: rgba(15, 23, 42, .55);
          backdrop-filter: blur(5px);
        }

        .scholarship-form-modal {
          width: 100%;
          max-width: 800px;
          max-height: 94vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid rgba(255,255,255,.65);
          border-radius: 17px;
          box-shadow:
            0 24px 70px rgba(15,23,42,.25);
        }

        /* =========================
           HEADER
        ========================= */

        .scholarship-form-header {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 20px 24px;
          border-bottom: 1px solid #e8edf3;
          background:
            linear-gradient(
              135deg,
              #ffffff,
              #f8fbff
            );
        }

        .scholarship-form-heading {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .scholarship-form-header-icon {
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
        }

        .scholarship-form-header-icon.create {
          color: #155eef;
          background: #eff4ff;
        }

        .scholarship-form-header-icon.edit {
          color: #7c3aed;
          background: #f5f3ff;
        }

        .scholarship-form-heading > div:last-child {
          min-width: 0;
        }

        .scholarship-form-heading
        > div:last-child
        > span {
          display: block;
          margin-bottom: 3px;
          color: #2563eb;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .12em;
        }

        .scholarship-form-heading h2 {
          margin: 0;
          color: #002060;
          font-size: 18px;
          line-height: 1.35;
        }

        .scholarship-form-heading p {
          margin: 4px 0 0;
          color: #94a3b8;
          font-size: 12px;
        }

        .scholarship-form-close {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          color: #64748b;
          background: #ffffff;
          border: 1px solid #dce4ed;
          border-radius: 8px;
          cursor: pointer;
        }

        .scholarship-form-close:hover {
          color: #dc2626;
          background: #fff5f5;
          border-color: #fecaca;
        }

        /* =========================
           CONTENT
        ========================= */

        .scholarship-form-content {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 20px 24px;
          background: #f8fafc;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        /* Error */

        .scholarship-form-error {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-bottom: 15px;
          padding: 12px 14px;
          color: #dc2626;
          background: #fff5f5;
          border: 1px solid #fecaca;
          border-radius: 9px;
        }

        .scholarship-form-error svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .scholarship-form-error > div {
          display: flex;
          flex-direction: column;
        }

        .scholarship-form-error strong {
          font-size: 13px;
        }

        .scholarship-form-error span {
          margin-top: 3px;
          font-size: 12px;
          line-height: 1.5;
        }

        /* Status */

        .scholarship-form-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 15px;
          padding: 12px 14px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
        }

        .scholarship-form-status > div {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #64748b;
          font-size: 12px;
        }

        .scholarship-form-status-badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 10px;
          border-radius: 999px;
          white-space: nowrap;
          font-size: 11px;
          font-weight: 700;
        }

        .scholarship-form-status-badge.pending {
          color: #b45309;
          background: #fffbeb;
          border: 1px solid #fde7b4;
        }

        .scholarship-form-status-badge.approved {
          color: #047857;
          background: #ecfdf5;
          border: 1px solid #b7efd3;
        }

        .scholarship-form-status-badge.rejected {
          color: #dc2626;
          background: #fff1f2;
          border: 1px solid #fecdd3;
        }

        /* =========================
           SECTIONS
        ========================= */

        .scholarship-form-section {
          margin-bottom: 14px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e1e8f0;
          border-radius: 12px;
          box-shadow:
            0 2px 8px rgba(15,23,42,.02);
        }

        .scholarship-form-section-heading {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 14px 15px;
          background:
            linear-gradient(
              90deg,
              #fbfdff,
              #ffffff
            );
          border-bottom: 1px solid #edf1f5;
        }

        .scholarship-form-section-heading
        > div {
          width: 31px;
          height: 31px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #155eef;
          background: #eff4ff;
          border-radius: 8px;
        }

        .scholarship-form-section-heading
        > span {
          display: flex;
          flex-direction: column;
        }

        .scholarship-form-section-heading strong {
          color: #002060;
          font-size: 13px;
        }

        .scholarship-form-section-heading small {
          margin-top: 2px;
          color: #94a3b8;
          font-size: 11px;
        }

        .scholarship-form-section-content {
          padding: 16px;
        }

        /* =========================
           GRID
        ========================= */

        .scholarship-form-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .scholarship-form-full {
          grid-column: 1 / -1;
        }

        /* =========================
           FIELD
        ========================= */

        .scholarship-form-field {
          min-width: 0;
        }

        .scholarship-form-label {
          display: block;
          margin-bottom: 6px;
          color: #475569;
          font-size: 12px;
          font-weight: 700;
        }

        .scholarship-form-label > span {
          margin-left: 3px;
          color: #dc2626;
        }

        .scholarship-input-wrapper {
          position: relative;
          min-width: 0;
        }

        .scholarship-input-wrapper > svg {
          position: absolute;
          left: 11px;
          top: 50%;
          z-index: 1;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .scholarship-input-wrapper input,
        .scholarship-input-wrapper select {
          width: 100%;
          height: 41px;
          padding: 0 11px 0 34px;
          box-sizing: border-box;
          color: #334155;
          background: #f8fafc;
          border: 1px solid #d7e0ea;
          border-radius: 8px;
          outline: none;
          font-family: inherit;
          font-size: 12px;
          transition:
            border-color .2s,
            background .2s,
            box-shadow .2s;
        }

        .scholarship-input-wrapper select {
          cursor: pointer;
        }

        .scholarship-input-wrapper
        input:focus,
        .scholarship-input-wrapper
        select:focus {
          background: #ffffff;
          border-color: #5d88e0;
          box-shadow:
            0 0 0 3px
            rgba(37,99,235,.07);
        }

        .scholarship-input-wrapper
        input::placeholder {
          color: #a8b3c2;
        }

        .scholarship-input-wrapper
        input[type="number"] {
          padding-right: 42px;
        }

        .scholarship-input-suffix {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 10px;
          pointer-events: none;
        }

        .scholarship-form-helper {
          display: block;
          margin-top: 5px;
          color: #94a3b8;
          font-size: 10px;
        }

        /* =========================
           REASON
        ========================= */

        .scholarship-form-reason {
          position: relative;
          margin-top: 14px;
        }

        .scholarship-form-reason textarea {
          width: 100%;
          min-height: 100px;
          padding: 11px 12px 26px;
          box-sizing: border-box;
          color: #334155;
          background: #f8fafc;
          border: 1px solid #d7e0ea;
          border-radius: 8px;
          outline: none;
          resize: vertical;
          font-family: inherit;
          font-size: 12px;
          line-height: 1.65;
        }

        .scholarship-form-reason
        textarea:focus {
          background: #ffffff;
          border-color: #5d88e0;
          box-shadow:
            0 0 0 3px
            rgba(37,99,235,.07);
        }

        .scholarship-character-count {
          position: absolute;
          right: 10px;
          bottom: 8px;
          color: #94a3b8;
          font-size: 9px;
        }

        /* Bank notice */

        .scholarship-bank-notice {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          margin-top: 12px;
          padding: 10px 11px;
          color: #64748b;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 7px;
          font-size: 10.5px;
          line-height: 1.6;
        }

        .scholarship-bank-notice svg {
          flex-shrink: 0;
          color: #64748b;
        }

        /* Staff notice */

        .scholarship-staff-notice {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          color: #475569;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          border-radius: 9px;
        }

        .scholarship-staff-notice > div:first-child {
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563eb;
          background: #ffffff;
          border-radius: 7px;
        }

        .scholarship-staff-notice
        > div:last-child {
          display: flex;
          flex-direction: column;
        }

        .scholarship-staff-notice strong {
          color: #1e40af;
          font-size: 12px;
        }

        .scholarship-staff-notice p {
          margin: 3px 0 0;
          font-size: 10.5px;
          line-height: 1.6;
        }

        /* Edit Notice */

        .scholarship-edit-note {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 11px 12px;
          color: #92400e;
          background: #fffbeb;
          border: 1px solid #fde7b4;
          border-radius: 8px;
          font-size: 10.5px;
          line-height: 1.6;
        }

        .scholarship-edit-note svg {
          flex-shrink: 0;
        }

        /* =========================
           FOOTER
        ========================= */

        .scholarship-form-footer {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 9px;
          padding: 14px 24px;
          background: #ffffff;
          border-top: 1px solid #e8edf3;
        }

        .scholarship-form-footer button {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0 16px;
          border-radius: 8px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .scholarship-form-cancel {
          color: #475569;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .scholarship-form-submit {
          min-width: 155px;
          color: #ffffff;
          background:
            linear-gradient(
              135deg,
              #002060,
              #0a4295
            );
          border: 1px solid #002060;
          box-shadow:
            0 5px 14px
            rgba(0,32,96,.14);
        }

        .scholarship-form-footer
        button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .scholarship-form-spinner {
          animation:
            scholarship-form-spin
            .7s linear infinite;
        }

        @keyframes scholarship-form-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width: 850px) {
          .scholarship-form-modal {
            max-width: 690px;
          }
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 650px) {
          .scholarship-form-overlay {
            align-items: stretch;
            padding: 0;
          }

          .scholarship-form-modal {
            max-width: none;
            max-height: none;
            height: 100dvh;
            border-radius: 0;
          }

          .scholarship-form-header {
            padding: 15px 14px;
          }

          .scholarship-form-header-icon {
            width: 38px;
            height: 38px;
          }

          .scholarship-form-heading {
            gap: 9px;
          }

          .scholarship-form-heading
          > div:last-child
          > span {
            font-size: 9px;
          }

          .scholarship-form-heading h2 {
            font-size: 16px;
          }

          .scholarship-form-heading p {
            max-width: 230px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 11px;
          }

          .scholarship-form-content {
            padding: 13px;
          }

          .scholarship-form-section-content {
            padding: 13px;
          }

          .scholarship-form-section-heading strong {
            font-size: 13px;
          }

          .scholarship-form-section-heading small {
            font-size: 10px;
          }

          .scholarship-form-grid {
            grid-template-columns: 1fr;
          }

          .scholarship-form-full {
            grid-column: auto;
          }

          .scholarship-input-wrapper input,
          .scholarship-input-wrapper select {
            height: 44px;
            font-size: 13px;
          }

          .scholarship-form-label {
            font-size: 12px;
          }

          .scholarship-form-helper {
            font-size: 10px;
          }

          .scholarship-form-reason textarea {
            font-size: 13px;
          }

          .scholarship-bank-notice {
            font-size: 10.5px;
          }

          .scholarship-edit-note {
            font-size: 10.5px;
          }

          .scholarship-staff-notice strong {
            font-size: 12px;
          }

          .scholarship-staff-notice p {
            font-size: 10.5px;
          }

          .scholarship-form-footer {
            padding:
              11px 13px
              calc(
                11px +
                env(safe-area-inset-bottom)
              );
          }

          .scholarship-form-footer button {
            min-height: 43px;
            font-size: 12px;
          }

          .scholarship-form-cancel {
            flex: .7;
          }

          .scholarship-form-submit {
            flex: 1.3;
            min-width: 0;
          }
        }

        @media (max-width: 380px) {
          .scholarship-form-heading
          > div:last-child
          > span {
            display: none;
          }

          .scholarship-form-heading h2 {
            font-size: 15px;
          }

          .scholarship-form-heading p {
            font-size: 10px;
          }
        }
      `}
    </style>
  );
}
