import { useState } from "react";
import { Link } from "react-router-dom";

import psuLogo from "../assets/PSU-logo-EN.png";

import "../App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const scholarshipTypeLabels = {
  NEEDY: "ทุนขาดแคลนทุนทรัพย์",

  ACADEMIC: "ทุนส่งเสริมการศึกษา (เรียนดี)",

  WORK: "ทุนทำงานพิเศษ (นักศึกษาช่วยงาน)",

  EMERGENCY: "ทุนฉุกเฉิน/ช่วยเหลือกรณีพิเศษ",

  ACTIVITY: "ทุนกิจกรรมนักศึกษา",
};

export default function CheckStatusPage() {
  const [requestNumber, setRequestNumber] = useState("");

  const [studentId, setStudentId] = useState("");

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);

    if (!requestNumber.trim()) {
      setError("กรุณากรอกเลขที่คำขอ");

      return;
    }

    if (!studentId.trim()) {
      setError("กรุณากรอกรหัสนักศึกษา");

      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams({
        requestNumber: requestNumber.trim(),

        studentId: studentId.trim(),
      });

      const res = await fetch(
        `${API_URL}/api/scholarships/check-status?${params.toString()}`,
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "ไม่พบข้อมูลคำขอทุน");
      }

      setResult(data.data);
    } catch (err) {
      setError(err.message || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setRequestNumber("");
    setStudentId("");
    setResult(null);
    setError("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",

        display: "flex",
        flexDirection: "column",

        background: "#f8fafc",
      }}
    >
      {/* Navbar */}

      <header
        style={{
          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          gap: "20px",

          padding: "15px 5%",

          background: "#ffffff",

          borderBottom: "1px solid #e2e8f0",

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
            alt="PSU"
            style={{
              height: "45px",
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
            ระบบบริหารจัดการทุนการศึกษา
          </span>
        </div>

        <nav
          style={{
            display: "flex",
            gap: "22px",
          }}
        >
          <Link to="/" style={navLink}>
            หน้าหลัก
          </Link>

          <Link to="/apply" style={navLink}>
            ยื่นคำขอทุน
          </Link>

          <Link
            to="/login"
            style={{
              ...navLink,

              color: "#002060",

              fontWeight: "600",
            }}
          >
            สำหรับเจ้าหน้าที่
          </Link>
        </nav>
      </header>

      {/* Content */}

      <main
        style={{
          width: "min(850px, 92%)",

          margin: "45px auto",

          flex: 1,
        }}
      >
        {/* Header */}

        <div
          style={{
            textAlign: "center",

            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "65px",

              height: "65px",

              borderRadius: "50%",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              margin: "0 auto 15px",

              background: "#eff6ff",

              fontSize: "28px",
            }}
          >
            🔎
          </div>

          <h1
            style={{
              color: "#002060",

              fontSize: "28px",

              marginBottom: "8px",
            }}
          >
            ตรวจสอบสถานะคำขอทุน
          </h1>

          <p
            style={{
              color: "#64748b",

              margin: 0,

              fontSize: "14px",
            }}
          >
            กรอกเลขที่คำขอและรหัสนักศึกษา เพื่อตรวจสอบผลการพิจารณา
          </p>
        </div>

        {/* Search Card */}

        <div
          style={{
            background: "#ffffff",

            padding: "30px",

            borderRadius: "14px",

            border: "1px solid #e2e8f0",

            boxShadow: "0 4px 15px rgba(0,0,0,.04)",
          }}
        >
          <form onSubmit={handleSearch}>
            <div className="check-status-grid">
              <div>
                <label style={labelStyle}>เลขที่คำขอ *</label>

                <input
                  value={requestNumber}
                  onChange={(e) => setRequestNumber(e.target.value)}
                  placeholder="เช่น SCH-2026-0001"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>รหัสนักศึกษา *</label>

                <input
                  value={studentId}
                  onChange={(e) =>
                    setStudentId(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="กรอกรหัสนักศึกษา"
                  style={inputStyle}
                />
              </div>
            </div>

            {error && (
              <div
                style={{
                  marginTop: "18px",

                  padding: "12px 15px",

                  background: "#fef2f2",

                  border: "1px solid #fecaca",

                  borderRadius: "8px",

                  color: "#dc2626",

                  fontSize: "13px",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",

                marginTop: "20px",

                padding: "13px",

                border: 0,

                borderRadius: "8px",

                background: "#002060",

                color: "#ffffff",

                fontWeight: "600",

                cursor: loading ? "not-allowed" : "pointer",

                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "กำลังตรวจสอบ..." : "ตรวจสอบสถานะ"}
            </button>
          </form>
        </div>

        {/* Result */}

        {result && (
          <div
            style={{
              marginTop: "25px",

              background: "#ffffff",

              padding: "30px",

              borderRadius: "14px",

              border: "1px solid #e2e8f0",

              boxShadow: "0 4px 15px rgba(0,0,0,.04)",
            }}
          >
            <div
              style={{
                display: "flex",

                justifyContent: "space-between",

                alignItems: "center",

                flexWrap: "wrap",

                gap: "15px",

                paddingBottom: "20px",

                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#64748b",

                    fontSize: "12px",
                  }}
                >
                  เลขที่คำขอ
                </div>

                <strong
                  style={{
                    color: "#002060",

                    fontSize: "18px",
                  }}
                >
                  {result.requestNumber}
                </strong>
              </div>

              <StatusBadge status={result.status} />
            </div>

            <div
              className="check-status-result-grid"
              style={{
                marginTop: "22px",
              }}
            >
              <Info label="ชื่อ - นามสกุล" value={result.studentName} />

              <Info label="รหัสนักศึกษา" value={result.studentId} />

              <Info label="คณะ" value={result.faculty} />

              <Info label="สาขาวิชา" value={result.major} />

              <Info
                label="ประเภททุน"
                value={
                  scholarshipTypeLabels[result.scholarshipType] ||
                  result.scholarshipType
                }
              />

              <Info
                label="จำนวนเงินที่ขอ"
                value={`${Number(
                  result.requestedAmount || 0,
                ).toLocaleString()} บาท`}
              />

              <Info label="เลขที่บัญชี" value={result.bankAccount} />

              <Info
                label="วันที่ยื่น"
                value={
                  result.createdAt
                    ? new Date(result.createdAt).toLocaleString("th-TH")
                    : "-"
                }
              />
            </div>

            {/* Staff Note */}

            {result.staffNote && (
              <div
                style={{
                  marginTop: "22px",

                  padding: "16px",

                  background: "#f8fafc",

                  border: "1px solid #e2e8f0",

                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",

                    color: "#64748b",

                    marginBottom: "5px",
                  }}
                >
                  หมายเหตุจากเจ้าหน้าที่
                </div>

                <div
                  style={{
                    color: "#334155",

                    lineHeight: 1.6,
                  }}
                >
                  {result.staffNote}
                </div>
              </div>
            )}
          </div>
        )}

        <style>
          {`
            .check-status-grid,
            .check-status-result-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 18px;
            }

            @media (max-width: 650px) {
              .check-status-grid,
              .check-status-result-grid {
                grid-template-columns: 1fr;
              }
            }
          `}
        </style>
      </main>

      <footer
        style={{
          background: "#002060",

          color: "#ffffff",

          textAlign: "center",

          padding: "25px",

          fontSize: "13px",
        }}
      >
        © 2026 Prince of Songkla University
      </footer>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    PENDING: {
      text: "⏳ รอพิจารณา",

      color: "#92400e",

      background: "#fef3c7",
    },

    APPROVED: {
      text: "✓ อนุมัติแล้ว",

      color: "#065f46",

      background: "#d1fae5",
    },

    REJECTED: {
      text: "✕ ไม่อนุมัติ",

      color: "#991b1b",

      background: "#fee2e2",
    },
  };

  const item = config[status] || config.PENDING;

  return (
    <span
      style={{
        padding: "8px 14px",

        borderRadius: "999px",

        background: item.background,

        color: item.color,

        fontSize: "13px",

        fontWeight: "600",
      }}
    >
      {item.text}
    </span>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div
        style={{
          fontSize: "12px",

          color: "#64748b",

          marginBottom: "4px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#1e293b",

          fontWeight: "600",

          fontSize: "14px",
        }}
      >
        {value || "-"}
      </div>
    </div>
  );
}

const navLink = {
  textDecoration: "none",
  color: "#64748b",
  fontSize: "14px",
};

const labelStyle = {
  display: "block",
  color: "#1e293b",
  fontSize: "13px",
  fontWeight: "600",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  background: "#f8fafc",
  boxSizing: "border-box",
  outline: "none",
};
