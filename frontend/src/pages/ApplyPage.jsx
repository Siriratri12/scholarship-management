import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import psuLogo from "../assets/PSU-logo-EN.png";
import "../App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
  
export default function ApplyPage() {
  const navigate = useNavigate();

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
    pdpaConsent: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [successPopup, setSuccessPopup] = useState({
    open: false,
    requestNumber: "",
  });

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

    if (
      !Number.isInteger(yearNumber) ||
      yearNumber < 1 ||
      yearNumber > 8
    ) {
      return "กรุณาเลือกชั้นปีให้ถูกต้อง";
    }

    if (formData.gpax === "") {
      return "กรุณากรอกเกรดเฉลี่ยสะสม (GPAX)";
    }

    const gpaxNum = Number(formData.gpax);

    if (
      Number.isNaN(gpaxNum) ||
      gpaxNum < 0 ||
      gpaxNum > 4
    ) {
      return "กรุณากรอกเกรดเฉลี่ย (GPAX) ระหว่าง 0.00 ถึง 4.00 ให้ถูกต้อง";
    }

    if (!/^\d(\.\d{1,2})?$/.test(String(formData.gpax))) {
      return "GPAX สามารถมีทศนิยมได้ไม่เกิน 2 ตำแหน่ง เช่น 3.25";
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

    const amountNum = Number(formData.requestedAmount);

    if (
      Number.isNaN(amountNum) ||
      amountNum <= 0
    ) {
      return "จำนวนเงินที่ขอต้องเป็นตัวเลขที่มากกว่า 0 เท่านั้น";
    }

    if (!formData.bankName.trim()) {
      return "กรุณากรอกชื่อธนาคาร";
    }

    if (!formData.bankAccount.trim()) {
      return "กรุณากรอกเลขที่บัญชีธนาคาร";
    }

    if (!/^\d+$/.test(formData.bankAccount.trim())) {
      return "เลขที่บัญชีธนาคารต้องเป็นตัวเลขเท่านั้น";
    }

    if (!formData.reason.trim()) {
      return "กรุณากรอกเหตุผลความจำเป็นในการขอรับทุน";
    }

    if (!formData.pdpaConsent) {
      return "กรุณายอมรับข้อตกลงการเก็บและใช้ข้อมูลส่วนบุคคล (PDPA Consent)";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setError("");
    setLoading(true);

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
        pdpaConsent: formData.pdpaConsent,
      };

      const res = await fetch(
        `${API_URL}/api/scholarships`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(
          data.message ||
            "เกิดข้อผิดพลาดในการส่งคำขอทุน",
        );

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return;
      }

      setSuccessPopup({
        open: true,
        requestNumber:
          data.data?.requestNumber || "",
      });

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
        pdpaConsent: false,
      });
    } catch (err) {
      console.error("Submit scholarship error:", err);

      setError(
        "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#f8fafc",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 50px",
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <img
            src={psuLogo}
            alt="PSU Logo"
            style={{
              height: "45px",
              width: "auto",
            }}
          />

          <span
            style={{
              fontSize: "13px",
              color: "#64748b",
              borderLeft: "1px solid #cbd5e1",
              paddingLeft: "15px",
            }}
          >
            ระบบยื่นคำขอทุนการศึกษาออนไลน์
            มหาวิทยาลัยสงขลานครินทร์
          </span>
        </div>

        <nav
          style={{
            display: "flex",
            gap: "25px",
            alignItems: "center",
          }}
        >
          <Link to="/" style={navStyle}>
            หน้าหลัก
          </Link>

          <Link
            to="/check-status"
            style={navStyle}
          >
            ตรวจสอบสถานะ
          </Link>

          <Link
            to="/login"
            style={{
              ...navStyle,
              color: "#002060",
            }}
          >
            สำหรับเจ้าหน้าที่
          </Link>
        </nav>
      </header>

      {/* Main */}

      <div
        style={{
          maxWidth: "850px",
          width: "90%",
          margin: "40px auto",
          background: "#ffffff",
          padding: "45px",
          borderRadius: "16px",
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.05)",
          textAlign: "left",
          boxSizing: "border-box",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              color: "#002060",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            ยื่นคำขอรับทุนการศึกษา
          </h2>

          <p
            style={{
              fontSize: "14px",
              color: "#64748b",
              margin: 0,
            }}
          >
            กองพัฒนานักศึกษาและศิษย์เก่าสัมพันธ์
            มหาวิทยาลัยสงขลานครินทร์
          </p>
        </div>

        {/* Validation Message */}

        {error && (
          <div
            style={{
              color: "#ef4444",
              background:
                "rgba(239,68,68,0.1)",
              padding: "12px 15px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "13px",
              border:
                "1px solid rgba(239,68,68,0.2)",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div className="apply-grid">
            <Field
              label="รหัสนักศึกษา *"
              placeholder="เช่น 6510110001"
              value={formData.studentId}
              maxLength={10}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  studentId:
                    value.replace(/\D/g, ""),
                })
              }
            />

            <Field
              label="ชื่อ - นามสกุล *"
              placeholder="นายสมชาย เรียนดี"
              value={formData.studentName}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  studentName: value,
                })
              }
            />
          </div>

          <div className="apply-grid">
            <Field
              label="คณะ *"
              placeholder="เช่น วิศวกรรมศาสตร์"
              value={formData.faculty}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  faculty: value,
                })
              }
            />

            <Field
              label="สาขาวิชา *"
              placeholder="เช่น วิทยาการคอมพิวเตอร์"
              value={formData.major}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  major: value,
                })
              }
            />
          </div>

          <div className="apply-grid">
            <div>
              <Label>ชั้นปี *</Label>

              <select
                value={formData.year}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    year: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option value="1">ปี 1</option>
                <option value="2">ปี 2</option>
                <option value="3">ปี 3</option>
                <option value="4">ปี 4</option>
                <option value="5">ปี 5</option>
                <option value="6">ปี 6</option>
              </select>
            </div>

            <div>
              <Label>
                GPAX (เกรดเฉลี่ยสะสม) *
              </Label>

              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                placeholder="เช่น 3.25"
                value={formData.gpax}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gpax: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <div
                style={{
                  marginTop: "5px",
                  fontSize: "11px",
                  color: "#94a3b8",
                }}
              >
                กรอกค่า GPAX ระหว่าง 0.00 - 4.00
              </div>
            </div>
          </div>

          <div className="apply-grid">
            <Field
              label="อีเมลติดต่อ *"
              type="email"
              placeholder="student@psu.ac.th"
              value={formData.email}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  email: value,
                })
              }
            />

            <div>
              <Label>ประเภททุนที่ขอ *</Label>

              <select
                value={formData.scholarshipType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scholarshipType:
                      e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option value="ทุนขาดแคลนทุนทรัพย์">
                  ทุนขาดแคลนทุนทรัพย์
                </option>

                <option value="ทุนส่งเสริมการศึกษา (เรียนดี)">
                  ทุนส่งเสริมการศึกษา (เรียนดี)
                </option>

                <option value="ทุนทำงานพิเศษ (นักศึกษาช่วยงาน)">
                  ทุนทำงานพิเศษ (นักศึกษาช่วยงาน)
                </option>

                <option value="ทุนฉุกเฉิน/ช่วยเหลือกรณีพิเศษ">
                  ทุนฉุกเฉิน/ช่วยเหลือกรณีพิเศษ
                </option>

                <option value="ทุนกิจกรรมนักศึกษา">
                  ทุนกิจกรรมนักศึกษา
                </option>
              </select>
            </div>
          </div>

          <div className="apply-grid">
            <Field
              label="จำนวนเงินที่ขอรับ (บาท) *"
              type="number"
              min="1"
              placeholder="เช่น 5000"
              value={formData.requestedAmount}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  requestedAmount: value,
                })
              }
            />

            <Field
              label="ธนาคาร *"
              placeholder="เช่น ธนาคารกรุงไทย"
              value={formData.bankName}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  bankName: value,
                })
              }
            />
          </div>

          <Field
            label="เลขที่บัญชีธนาคาร *"
            placeholder="เลขที่บัญชีสำหรับรับเงินโอน"
            value={formData.bankAccount}
            onChange={(value) =>
              setFormData({
                ...formData,
                bankAccount:
                  value.replace(/\D/g, ""),
              })
            }
          />

          <div>
            <Label>
              เหตุผลความจำเป็นในการขอรับทุน *
            </Label>

            <textarea
              rows="4"
              placeholder="ระบุเหตุผลความจำเป็น..."
              value={formData.reason}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reason: e.target.value,
                })
              }
              style={{
                ...inputStyle,
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>

          {/* PDPA */}

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              marginTop: "5px",
              background: "#f8fafc",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <input
              type="checkbox"
              id="pdpa"
              checked={formData.pdpaConsent}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pdpaConsent:
                    e.target.checked,
                })
              }
              style={{
                marginTop: "3px",
                width: "16px",
                height: "16px",
                cursor: "pointer",
              }}
            />

            <label
              htmlFor="pdpa"
              style={{
                fontSize: "13px",
                color: "#334155",
                lineHeight: "1.5",
                cursor: "pointer",
              }}
            >
              ข้าพเจ้ายินยอมให้เก็บรวบรวม ใช้
              และประมวลผลข้อมูลส่วนบุคคล
              เพื่อประกอบการพิจารณาทุนการศึกษา
              ตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล
              (PDPA)
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px",
              background: "#002060",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "16px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              marginTop: "15px",
              boxShadow:
                "0 4px 6px rgba(0,32,96,0.15)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "กำลังส่งคำขอ..."
              : "ส่งคำขอทุนการศึกษา"}
          </button>
        </form>
      </div>

      <style>
        {`
          .apply-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          @media (max-width: 700px) {
            .apply-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <footer
        style={{
          background: "#002060",
          color: "#ffffff",
          padding: "30px 5%",
          textAlign: "center",
          marginTop: "auto",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "13px",
          }}
        >
          © 2026 Prince of Songkla University.
          All Rights Reserved.
        </p>
      </footer>

      {/* Success Popup */}

      {successPopup.open && (
        <SuccessPopup
          requestNumber={
            successPopup.requestNumber
          }
          onBackHome={() => {
            setSuccessPopup({
              open: false,
              requestNumber: "",
            });

            navigate("/");
          }}
          onCheckStatus={() => {
            setSuccessPopup({
              open: false,
              requestNumber: "",
            });

            navigate("/check-status");
          }}
        />
      )}
    </div>
  );
}

function Label({ children }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "13px",
        fontWeight: "600",
        color: "#1e293b",
        marginBottom: "6px",
      }}
    >
      {children}
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  step,
  min,
  max,
  maxLength,
}) {
  return (
    <div>
      <Label>{label}</Label>

      <input
        type={type}
        step={step}
        min={min}
        max={max}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={inputStyle}
      />
    </div>
  );
}

function SuccessPopup({
  requestNumber,
  onBackHome,
  onCheckStatus,
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(15, 23, 42, 0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "#ffffff",
          borderRadius: "18px",
          padding: "34px",
          textAlign: "center",
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.25)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "65px",
            height: "65px",
            margin: "0 auto 18px",
            borderRadius: "50%",
            background: "#dcfce7",
            color: "#16a34a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            fontWeight: "bold",
          }}
        >
          ✓
        </div>

        <h3
          style={{
            color: "#002060",
            fontSize: "22px",
            margin: "0 0 10px",
          }}
        >
          ยื่นคำขอทุนสำเร็จ
        </h3>

        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
            lineHeight: 1.7,
            margin: "0 0 20px",
          }}
        >
          ระบบได้บันทึกคำขอของคุณเรียบร้อยแล้ว
          <br />
          สถานะปัจจุบันคือ{" "}
          <strong
            style={{
              color: "#d97706",
            }}
          >
            รอพิจารณา
          </strong>
        </p>

        <div
          style={{
            background: "#f8fafc",
            border:
              "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              color: "#64748b",
              fontSize: "12px",
              marginBottom: "5px",
            }}
          >
            เลขที่คำขอ
          </div>

          <div
            style={{
              color: "#002060",
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            {requestNumber || "-"}
          </div>
        </div>

        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "20px",
            color: "#1e40af",
            fontSize: "12px",
            lineHeight: 1.6,
          }}
        >
          กรุณาจดเลขที่คำขอไว้เป็นหลักฐาน
          และสามารถตรวจสอบสถานะคำขอได้จากเมนู
          “ตรวจสอบสถานะ”
        </div>

        <button
          type="button"
          onClick={onCheckStatus}
          style={{
            width: "100%",
            padding: "12px",
            background: "#002060",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "14px",
            marginBottom: "10px",
          }}
        >
          🔎 ตรวจสอบสถานะคำขอ
        </button>

        <button
          type="button"
          onClick={onBackHome}
          style={{
            width: "100%",
            padding: "11px",
            background: "#ffffff",
            color: "#334155",
            border:
              "1px solid #cbd5e1",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          กลับหน้าหลัก
        </button>
      </div>
    </div>
  );
}

const navStyle = {
  textDecoration: "none",
  color: "#64748b",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
  fontSize: "14px",
  background: "#f8fafc",
  outline: "none",
};