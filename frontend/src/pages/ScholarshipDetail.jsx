import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Banknote,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileText,
  GraduationCap,
  Landmark,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
  WalletCards,
  XCircle,
} from "lucide-react";

import "../App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const scholarshipTypeLabels = {
  NEEDY: "ทุนขาดแคลนทุนทรัพย์",
  ACADEMIC: "ทุนส่งเสริมการศึกษา (เรียนดี)",
  WORK: "ทุนทำงานพิเศษ (นักศึกษาช่วยงาน)",
  EMERGENCY: "ทุนฉุกเฉิน/ช่วยเหลือกรณีพิเศษ",
  ACTIVITY: "ทุนกิจกรรมนักศึกษา",

  ทุนขาดแคลนทุนทรัพย์: "ทุนขาดแคลนทุนทรัพย์",
  "ทุนส่งเสริมการศึกษา (เรียนดี)": "ทุนส่งเสริมการศึกษา (เรียนดี)",
  "ทุนทำงานพิเศษ (นักศึกษาช่วยงาน)": "ทุนทำงานพิเศษ (นักศึกษาช่วยงาน)",
  "ทุนฉุกเฉิน/ช่วยเหลือกรณีพิเศษ": "ทุนฉุกเฉิน/ช่วยเหลือกรณีพิเศษ",
  ทุนกิจกรรมนักศึกษา: "ทุนกิจกรรมนักศึกษา",
};

export default function ScholarshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("APPROVED");
  const [staffNote, setStaffNote] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getToken = () => localStorage.getItem("token");

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  }, [navigate]);

  // =========================================================
  // โหลดรายละเอียด
  // =========================================================

  const fetchDetail = useCallback(async () => {
    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/scholarships/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "ไม่พบข้อมูลคำขอทุน");
      }

      setRequest(data.data);

      setStaffNote(data.data.staffNote || "");

      if (data.data.status === "PENDING") {
        setStatus("APPROVED");
      } else {
        setStatus(data.data.status);
      }
    } catch (err) {
      console.error("Fetch scholarship detail error:", err);

      setError(err.message || "ไม่สามารถโหลดรายละเอียดคำขอทุนได้");

      setRequest(null);
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized, id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // =========================================================
  // พิจารณาสถานะ
  // =========================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!request) return;

    if (request.status !== "PENDING") {
      setError("คำขอนี้ได้รับการพิจารณาแล้ว ไม่สามารถเปลี่ยนสถานะซ้ำได้");
      return;
    }

    if (status !== "APPROVED" && status !== "REJECTED") {
      setError("กรุณาเลือกผลการพิจารณา");
      return;
    }

    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/scholarships/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          staffNote: staffNote.trim(),
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "ไม่สามารถอัปเดตสถานะได้");
      }

      setMessage(
        status === "APPROVED"
          ? "อนุมัติคำขอทุนสำเร็จ"
          : "บันทึกผลไม่อนุมัติสำเร็จ",
      );

      await fetchDetail();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error("Update scholarship status error:", err);

      setError(err.message || "เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // ลบ
  // =========================================================

  const handleDelete = async () => {
    if (!request) return;

    if (request.status !== "PENDING") {
      setShowDeleteModal(false);

      setError("สามารถลบได้เฉพาะคำขอที่อยู่ในสถานะรอพิจารณาเท่านั้น");

      return;
    }

    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setDeleting(true);

    try {
      const res = await fetch(`${API_URL}/api/scholarships/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "ไม่สามารถลบข้อมูลได้");
      }

      setShowDeleteModal(false);

      navigate("/scholarships", {
        replace: true,
      });
    } catch (err) {
      setShowDeleteModal(false);

      setError(err.message || "เกิดข้อผิดพลาดในการลบคำขอทุน");
    } finally {
      setDeleting(false);
    }
  };

  // =========================================================
  // Loading
  // =========================================================

  if (loading) {
    return (
      <>
        <div className="detail-loading">
          <LoaderCircle className="detail-spinner" size={28} />

          <div>
            <strong>กำลังโหลดรายละเอียดคำขอ</strong>
            <span>กรุณารอสักครู่...</span>
          </div>
        </div>

        <DetailStyles />
      </>
    );
  }

  // =========================================================
  // Not Found
  // =========================================================

  if (!request) {
    return (
      <>
        <div className="detail-not-found">
          <div className="detail-not-found-icon">
            <AlertCircle size={26} />
          </div>

          <h2>ไม่พบข้อมูลคำขอทุน</h2>

          <p>
            {error ||
              "ไม่พบข้อมูลคำขอทุนที่ต้องการ กรุณาตรวจสอบและลองใหม่อีกครั้ง"}
          </p>

          <Link to="/scholarships">
            <ArrowLeft size={15} />
            กลับหน้ารายการคำขอ
          </Link>
        </div>

        <DetailStyles />
      </>
    );
  }

  const isPending = request.status === "PENDING";

  return (
    <div className="detail-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="detail-header">
        <div className="detail-header-left">
          <Link
            to="/scholarships"
            className="detail-back-icon"
            aria-label="กลับหน้ารายการคำขอ"
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <span className="detail-eyebrow">SCHOLARSHIP REQUEST</span>

            <h1>รายละเอียดคำขอทุนการศึกษา</h1>

            <div className="detail-request-number">
              เลขที่คำขอ
              <strong>{request.requestNumber || `#${request.id}`}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {message && (
        <div className="detail-message success">
          <CheckCircle2 size={18} />

          <div>
            <strong>ดำเนินการสำเร็จ</strong>
            <span>{message}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="detail-message error">
          <AlertCircle size={18} />

          <div>
            <strong>เกิดข้อผิดพลาด</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* =====================================================
          STATUS HERO
      ===================================================== */}

      <section className="detail-status-card">
        <div className="detail-status-main">
          <div
            className={`detail-status-icon ${request.status?.toLowerCase()}`}
          >
            {request.status === "APPROVED" ? (
              <CheckCircle2 size={23} />
            ) : request.status === "REJECTED" ? (
              <XCircle size={23} />
            ) : (
              <Clock3 size={23} />
            )}
          </div>

          <div>
            <span>สถานะปัจจุบัน</span>

            <StatusBadge status={request.status} />
          </div>
        </div>

        <div className="detail-status-divider" />

        <div className="detail-status-meta">
          <div>
            <CalendarDays size={16} />

            <span>
              <small>วันที่ยื่นคำขอ</small>
              <strong>{formatDateTime(request.createdAt)}</strong>
            </span>
          </div>

          <div>
            <FileText size={16} />

            <span>
              <small>เลขที่คำขอ</small>
              <strong>{request.requestNumber || `#${request.id}`}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          GRID
      ===================================================== */}

      <div className="detail-main-grid">
        <div className="detail-main-left">
          {/* Student */}

          <DetailSection
            icon={UserRound}
            title="ข้อมูลนักศึกษา"
            subtitle="ข้อมูลผู้ยื่นคำขอทุนการศึกษา"
          >
            <Info
              icon={FileText}
              label="รหัสนักศึกษา"
              value={request.studentId}
            />

            <Info
              icon={UserRound}
              label="ชื่อ - นามสกุล"
              value={request.studentName}
            />

            <Info icon={GraduationCap} label="คณะ" value={request.faculty} />

            <Info icon={BookOpen} label="สาขาวิชา" value={request.major} />

            <Info
              icon={GraduationCap}
              label="ชั้นปี"
              value={request.year ? `ชั้นปีที่ ${request.year}` : "-"}
            />

            <Info
              icon={BadgeCheck}
              label="GPAX"
              value={formatGPAX(request.gpax)}
            />

            <Info icon={Mail} label="อีเมล" value={request.email} fullWidth />
          </DetailSection>

          {/* Scholarship */}

          <DetailSection
            icon={WalletCards}
            title="ข้อมูลคำขอทุนการศึกษา"
            subtitle="รายละเอียดทุนและจำนวนเงินที่นักศึกษาขอรับ"
          >
            <Info
              icon={GraduationCap}
              label="ประเภททุน"
              value={getScholarshipLabel(request.scholarshipType)}
            />

            <Info
              icon={CircleDollarSign}
              label="จำนวนเงินที่ขอรับ"
              value={`${Number(request.requestedAmount || 0).toLocaleString(
                "th-TH",
              )} บาท`}
              highlight
            />

            <div className="detail-info full-width">
              <div className="detail-info-icon">
                <Landmark size={16} />
              </div>

              <div>
                <span className="detail-info-label">เลขที่บัญชีธนาคาร</span>

                <div className="detail-bank-row">
                  <strong>{maskBankAccount(request.bankAccount)}</strong>

                  <span>
                    <LockKeyhole size={11} />
                    Data Masking
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-reason full-width">
              <div className="detail-reason-title">
                <FileText size={16} />
                เหตุผลความจำเป็นในการขอรับทุน
              </div>

              <p>{request.reason || "-"}</p>
            </div>
          </DetailSection>

          {/* PDPA */}

          <DetailSection
            icon={ShieldCheck}
            title="การให้ความยินยอม PDPA"
            subtitle="ข้อมูลการให้ความยินยอมในการเก็บและใช้ข้อมูลส่วนบุคคล"
          >
            <Info
              icon={ShieldCheck}
              label="สถานะความยินยอม"
              value={
                request.pdpaConsent
                  ? "ให้ความยินยอมแล้ว"
                  : "ไม่ได้ให้ความยินยอม"
              }
              valueColor={request.pdpaConsent ? "#059669" : "#dc2626"}
            />

            <Info
              icon={CalendarDays}
              label="วันที่ให้ความยินยอม"
              value={formatDateTime(request.pdpaConsentAt)}
            />
          </DetailSection>
        </div>

        {/* =================================================
            RIGHT PANEL
        ================================================= */}

        <aside className="detail-side">
          {isPending ? (
            <form className="detail-decision-card" onSubmit={handleUpdate}>
              <div className="detail-decision-header">
                <div className="detail-decision-icon">
                  <BadgeCheck size={20} />
                </div>

                <div>
                  <h2>พิจารณาคำขอทุน</h2>
                  <p>เลือกผลการพิจารณาและบันทึกหมายเหตุ</p>
                </div>
              </div>

              <div className="detail-notice">
                <AlertCircle size={15} />

                <span>
                  เมื่อบันทึกผลแล้ว จะไม่สามารถเปลี่ยนสถานะคำขอนี้ซ้ำได้
                </span>
              </div>

              <div className="detail-field">
                <label>ผลการพิจารณา</label>

                <div className="detail-decision-options">
                  <label
                    className={`detail-decision-option approved ${
                      status === "APPROVED" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="APPROVED"
                      checked={status === "APPROVED"}
                      onChange={(e) => setStatus(e.target.value)}
                    />

                    <CheckCircle2 size={19} />

                    <div>
                      <strong>อนุมัติ</strong>
                      <span>อนุมัติคำขอทุนนี้</span>
                    </div>
                  </label>

                  <label
                    className={`detail-decision-option rejected ${
                      status === "REJECTED" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="REJECTED"
                      checked={status === "REJECTED"}
                      onChange={(e) => setStatus(e.target.value)}
                    />

                    <XCircle size={19} />

                    <div>
                      <strong>ไม่อนุมัติ</strong>
                      <span>ปฏิเสธคำขอทุนนี้</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="detail-field">
                <label htmlFor="staffNote">หมายเหตุเจ้าหน้าที่</label>

                <textarea
                  id="staffNote"
                  rows="5"
                  value={staffNote}
                  onChange={(e) => setStaffNote(e.target.value)}
                  placeholder="ระบุหมายเหตุหรือเหตุผลประกอบการพิจารณา (ถ้ามี)"
                />
              </div>

              <button
                type="submit"
                className="detail-save-button"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <LoaderCircle size={16} className="detail-button-spinner" />
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    บันทึกผลการพิจารณา
                  </>
                )}
              </button>

              <div className="detail-delete-divider">
                <span />
                <small>หรือ</small>
                <span />
              </div>

              <button
                type="button"
                className="detail-delete-button"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 size={15} />
                ลบคำขอนี้
              </button>

              <p className="detail-delete-note">
                สามารถลบได้เฉพาะคำขอที่ยังอยู่ในสถานะ “รอพิจารณา”
              </p>
            </form>
          ) : (
            <div className="detail-result-card">
              <div
                className={`detail-result-icon ${request.status?.toLowerCase()}`}
              >
                {request.status === "APPROVED" ? (
                  <CheckCircle2 size={25} />
                ) : (
                  <XCircle size={25} />
                )}
              </div>

              <span>ผลการพิจารณา</span>

              <h2>
                {request.status === "APPROVED"
                  ? "อนุมัติคำขอทุน"
                  : "ไม่อนุมัติคำขอทุน"}
              </h2>

              <StatusBadge status={request.status} />

              <div className="detail-result-note">
                <span>หมายเหตุเจ้าหน้าที่</span>

                <p>{request.staffNote || "ไม่มีหมายเหตุเพิ่มเติม"}</p>
              </div>

              <div className="detail-result-lock">
                <LockKeyhole size={13} />
                คำขอนี้ได้รับการพิจารณาเรียบร้อยแล้ว
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {showDeleteModal && (
        <div
          className="detail-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deleting) {
              setShowDeleteModal(false);
            }
          }}
        >
          <div className="detail-delete-modal">
            <div className="detail-modal-danger-icon">
              <Trash2 size={25} />
            </div>

            <h2>ยืนยันการลบคำขอ</h2>

            <p>คุณต้องการลบคำขอทุนนี้ใช่หรือไม่?</p>

            <div className="detail-modal-request">
              <span>เลขที่คำขอ</span>

              <strong>{request.requestNumber || `#${request.id}`}</strong>

              <small>{request.studentName}</small>
            </div>

            <div className="detail-soft-delete-note">
              <ShieldCheck size={16} />

              <div>
                <strong>Soft Delete</strong>

                <span>
                  ข้อมูลจะไม่ถูกลบออกจากฐานข้อมูลจริง แต่จะถูกซ่อนจากรายการปกติ
                  พร้อมบันทึกวันและเวลาที่ลบ
                </span>
              </div>
            </div>

            <div className="detail-modal-actions">
              <button
                type="button"
                className="detail-modal-cancel"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
              >
                ยกเลิก
              </button>

              <button
                type="button"
                className="detail-modal-delete"
                disabled={deleting}
                onClick={handleDelete}
              >
                {deleting ? (
                  <>
                    <LoaderCircle size={15} className="detail-button-spinner" />
                    กำลังลบ...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    ยืนยันลบ
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <DetailStyles />
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function DetailSection({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="detail-section">
      <div className="detail-section-header">
        <div className="detail-section-icon">
          <Icon size={18} />
        </div>

        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="detail-info-grid">{children}</div>
    </section>
  );
}

function Info({
  icon: Icon,
  label,
  value,
  fullWidth = false,
  highlight = false,
  valueColor,
}) {
  return (
    <div className={`detail-info ${fullWidth ? "full-width" : ""}`}>
      {Icon && (
        <div className="detail-info-icon">
          <Icon size={16} />
        </div>
      )}

      <div>
        <span className="detail-info-label">{label}</span>

        <strong
          className={highlight ? "highlight" : ""}
          style={
            valueColor
              ? {
                  color: valueColor,
                }
              : undefined
          }
        >
          {value ?? "-"}
        </strong>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    PENDING: {
      text: "รอพิจารณา",
      icon: Clock3,
    },

    APPROVED: {
      text: "อนุมัติแล้ว",
      icon: CheckCircle2,
    },

    REJECTED: {
      text: "ไม่อนุมัติ",
      icon: XCircle,
    },
  };

  const current = config[status] || config.PENDING;

  const Icon = current.icon;

  return (
    <span
      className={`detail-status-badge ${status?.toLowerCase() || "pending"}`}
    >
      <Icon size={13} />
      {current.text}
    </span>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getScholarshipLabel(type) {
  return scholarshipTypeLabels[type] || type || "-";
}

function maskBankAccount(account) {
  if (!account) return "-";

  const value = String(account).replace(/\s/g, "");

  if (value.length <= 4) {
    return "*".repeat(value.length);
  }

  const visible = value.slice(-4);

  return `${"*".repeat(value.length - 4)}${visible}`;
}

function formatDateTime(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatGPAX(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return value;
  }

  return number.toFixed(2);
}

/* =========================================================
   STYLE
========================================================= */

function DetailStyles() {
  return (
    <style>
      {`
        .detail-page {
          width: 100%;
          max-width: 1260px;
          margin: 0 auto;
          padding: 6px 12px 45px;
          box-sizing: border-box;
          color: #1e293b;
        }

        /* ======================================
           Header
        ====================================== */

        .detail-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 21px;
        }

        .detail-header-left {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .detail-back-icon {
          width: 39px;
          height: 39px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #475569;
          background: #ffffff;
          border: 1px solid #dce4ed;
          border-radius: 10px;
          text-decoration: none;
          transition: .2s;
        }

        .detail-back-icon:hover {
          color: #002060;
          border-color: #b8c7d9;
          background: #f8fafc;
        }

        .detail-eyebrow {
          display: block;
          margin-bottom: 3px;
          color: #2563eb;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .14em;
        }

        .detail-header h1 {
          margin: 0;
          color: #002060;
          font-size: clamp(25px, 3vw, 32px);
          line-height: 1.3;
        }

        .detail-request-number {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 5px;
          color: #94a3b8;
          font-size: 12px;
        }

        .detail-request-number strong {
          color: #475569;
        }

        .detail-back-button {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 37px;
          padding: 0 13px;
          color: #475569;
          background: #ffffff;
          border: 1px solid #dce4ed;
          border-radius: 8px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
        }

        /* ======================================
           Messages
        ====================================== */

        .detail-message {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-bottom: 16px;
          padding: 11px 13px;
          border-radius: 9px;
        }

        .detail-message svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .detail-message > div {
          display: flex;
          flex-direction: column;
        }

        .detail-message strong {
          font-size: 13px;
        }

        .detail-message span {
          margin-top: 2px;
          font-size: 11px;
        }

        .detail-message.success {
          color: #047857;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
        }

        .detail-message.error {
          color: #dc2626;
          background: #fff4f4;
          border: 1px solid #fecaca;
        }

        /* ======================================
           Status Card
        ====================================== */

        .detail-status-card {
          display: flex;
          align-items: center;
          gap: 23px;
          margin-bottom: 18px;
          padding: 18px 21px;
          background: #ffffff;
          border: 1px solid #dfe7ef;
          border-radius: 14px;
          box-shadow: 0 4px 14px rgba(15,23,42,.025);
        }

        .detail-status-main {
          min-width: 180px;
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .detail-status-icon {
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
        }

        .detail-status-icon.pending {
          color: #d97706;
          background: #fff8e7;
        }

        .detail-status-icon.approved {
          color: #059669;
          background: #ecfdf5;
        }

        .detail-status-icon.rejected {
          color: #dc2626;
          background: #fff1f2;
        }

        .detail-status-main > div:last-child {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 5px;
        }

        .detail-status-main > div:last-child > span:first-child {
          color: #94a3b8;
          font-size: 11px;
        }

        .detail-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
        }

        .detail-status-badge.pending {
          color: #b45309;
          background: #fffbeb;
          border: 1px solid #fde7b4;
        }

        .detail-status-badge.approved {
          color: #047857;
          background: #ecfdf5;
          border: 1px solid #b7efd3;
        }

        .detail-status-badge.rejected {
          color: #dc2626;
          background: #fff1f2;
          border: 1px solid #fecdd3;
        }

        .detail-status-divider {
          width: 1px;
          height: 42px;
          background: #e2e8f0;
        }

        .detail-status-meta {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 35px;
        }

        .detail-status-meta > div {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .detail-status-meta svg {
          flex-shrink: 0;
          color: #64748b;
        }

        .detail-status-meta span {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .detail-status-meta small {
          color: #94a3b8;
          font-size: 10px;
        }

        .detail-status-meta strong {
          margin-top: 2px;
          color: #334155;
          font-size: 12px;
        }

        /* ======================================
           Layout
        ====================================== */

        .detail-main-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(280px, 330px);
          align-items: start;
          gap: 18px;
        }

        .detail-main-left {
          min-width: 0;
        }

        .detail-side {
          position: sticky;
          top: 90px;
          min-width: 0;
        }

        /* ======================================
           Sections
        ====================================== */

        .detail-section {
          margin-bottom: 16px;
          padding: 21px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 4px 14px rgba(15,23,42,.02);
        }

        .detail-section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 14px;
          margin-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .detail-section-icon {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #155eef;
          background: #eff4ff;
          border-radius: 9px;
        }

        .detail-section-header h2 {
          margin: 0;
          color: #002060;
          font-size: 16px;
        }

        .detail-section-header p {
          margin: 2px 0 0;
          color: #94a3b8;
          font-size: 11px;
        }

        .detail-info-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 12px;
        }

        .detail-info {
          min-width: 0;
          display: flex;
          align-items: flex-start;
          gap: 9px;
          padding: 12px;
          background: #f8fafc;
          border: 1px solid #edf1f5;
          border-radius: 9px;
        }

        .detail-info.full-width {
          grid-column: 1 / -1;
        }

        .detail-info-icon {
          width: 29px;
          height: 29px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 7px;
        }

        .detail-info > div:last-child {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .detail-info-label {
          color: #94a3b8;
          font-size: 10px;
        }

        .detail-info strong {
          margin-top: 3px;
          color: #334155;
          font-size: 12px;
          line-height: 1.45;
          word-break: break-word;
        }

        .detail-info strong.highlight {
          color: #002060;
          font-size: 14px;
        }

        .detail-bank-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 3px;
          flex-wrap: wrap;
        }

        .detail-bank-row strong {
          margin: 0;
          letter-spacing: .06em;
        }

        .detail-bank-row > span {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 3px 6px;
          color: #059669;
          background: #ecfdf5;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 700;
        }

        .detail-reason {
          padding: 13px;
          background: #f8fafc;
          border: 1px solid #edf1f5;
          border-radius: 9px;
        }

        .detail-reason-title {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
        }

        .detail-reason p {
          margin: 8px 0 0;
          color: #475569;
          font-size: 12px;
          line-height: 1.8;
          white-space: pre-wrap;
        }

        /* ======================================
           Decision Card
        ====================================== */

        .detail-decision-card,
        .detail-result-card {
          padding: 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 5px 18px rgba(15,23,42,.035);
        }

        .detail-decision-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 14px;
          margin-bottom: 14px;
          border-bottom: 1px solid #f1f5f9;
        }

        .detail-decision-icon {
          width: 37px;
          height: 37px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #155eef;
          background: #eff4ff;
          border-radius: 9px;
        }

        .detail-decision-header h2 {
          margin: 0;
          color: #002060;
          font-size: 15px;
        }

        .detail-decision-header p {
          margin: 2px 0 0;
          color: #94a3b8;
          font-size: 10px;
        }

        .detail-notice {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          margin-bottom: 16px;
          padding: 9px 10px;
          color: #b45309;
          background: #fffbeb;
          border: 1px solid #fde7b4;
          border-radius: 8px;
          font-size: 10px;
          line-height: 1.5;
        }

        .detail-notice svg {
          flex-shrink: 0;
        }

        .detail-field {
          margin-bottom: 15px;
        }

        .detail-field > label {
          display: block;
          margin-bottom: 6px;
          color: #334155;
          font-size: 11px;
          font-weight: 700;
        }

        .detail-field textarea {
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
          color: #334155;
          background: #f8fafc;
          border: 1px solid #d8e1eb;
          border-radius: 8px;
          outline: none;
          resize: vertical;
          font-family: inherit;
          font-size: 12px;
          line-height: 1.6;
        }

        .detail-field textarea:focus {
          background: #ffffff;
          border-color: #5a87e2;
          box-shadow: 0 0 0 3px rgba(37,99,235,.07);
        }

        .detail-decision-options {
          display: grid;
          grid-template-columns: 1fr;
          gap: 7px;
        }

        .detail-decision-option {
          position: relative;
          display: grid;
          grid-template-columns: auto auto 1fr;
          align-items: center;
          gap: 8px;
          padding: 10px;
          cursor: pointer;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          transition: .2s;
        }

        .detail-decision-option input {
          width: 13px;
          height: 13px;
          margin: 0;
        }

        .detail-decision-option > div {
          display: flex;
          flex-direction: column;
        }

        .detail-decision-option strong {
          color: #334155;
          font-size: 12px;
        }

        .detail-decision-option span {
          margin-top: 1px;
          color: #94a3b8;
          font-size: 10px;
        }

        .detail-decision-option.approved svg {
          color: #059669;
        }

        .detail-decision-option.rejected svg {
          color: #dc2626;
        }

        .detail-decision-option.approved.selected {
          background: #f0fdf4;
          border-color: #86efac;
        }

        .detail-decision-option.rejected.selected {
          background: #fff5f5;
          border-color: #fca5a5;
        }

        .detail-save-button {
          width: 100%;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #ffffff;
          background: #002060;
          border: 0;
          border-radius: 8px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .detail-save-button:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .detail-delete-divider {
          display: flex;
          align-items: center;
          gap: 7px;
          margin: 15px 0 10px;
        }

        .detail-delete-divider span {
          flex: 1;
          height: 1px;
          background: #edf1f5;
        }

        .detail-delete-divider small {
          color: #a0acba;
          font-size: 9px;
        }

        .detail-delete-button {
          width: 100%;
          min-height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #dc2626;
          background: #ffffff;
          border: 1px solid #fecaca;
          border-radius: 8px;
          font-family: inherit;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .detail-delete-button:hover {
          background: #fff5f5;
        }

        .detail-delete-note {
          margin: 7px 0 0;
          color: #94a3b8;
          text-align: center;
          font-size: 9px;
          line-height: 1.5;
        }

        /* ======================================
           Result
        ====================================== */

        .detail-result-card {
          text-align: center;
        }

        .detail-result-icon {
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          border-radius: 50%;
        }

        .detail-result-icon.approved {
          color: #059669;
          background: #ecfdf5;
        }

        .detail-result-icon.rejected {
          color: #dc2626;
          background: #fff1f2;
        }

        .detail-result-card > span {
          color: #94a3b8;
          font-size: 10px;
        }

        .detail-result-card h2 {
          margin: 5px 0 9px;
          color: #002060;
          font-size: 17px;
        }

        .detail-result-note {
          margin-top: 18px;
          padding: 12px;
          text-align: left;
          background: #f8fafc;
          border: 1px solid #edf1f5;
          border-radius: 8px;
        }

        .detail-result-note span {
          color: #94a3b8;
          font-size: 10px;
        }

        .detail-result-note p {
          margin: 4px 0 0;
          color: #475569;
          font-size: 11px;
          line-height: 1.6;
        }

        .detail-result-lock {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          margin-top: 13px;
          color: #94a3b8;
          font-size: 10px;
        }

        /* ======================================
           Delete Modal
        ====================================== */

        .detail-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          box-sizing: border-box;
          background: rgba(15,23,42,.55);
          backdrop-filter: blur(4px);
        }

        .detail-delete-modal {
          width: 100%;
          max-width: 390px;
          padding: 27px;
          box-sizing: border-box;
          text-align: center;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 22px 60px rgba(15,23,42,.25);
        }

        .detail-modal-danger-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 13px;
          color: #dc2626;
          background: #fff1f2;
          border-radius: 50%;
        }

        .detail-delete-modal h2 {
          margin: 0;
          color: #1e293b;
          font-size: 20px;
        }

        .detail-delete-modal > p {
          margin: 6px 0 15px;
          color: #64748b;
          font-size: 12px;
        }

        .detail-modal-request {
          display: flex;
          flex-direction: column;
          padding: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
        }

        .detail-modal-request span {
          color: #94a3b8;
          font-size: 10px;
        }

        .detail-modal-request strong {
          margin-top: 2px;
          color: #002060;
          font-size: 16px;
        }

        .detail-modal-request small {
          margin-top: 3px;
          color: #64748b;
          font-size: 11px;
        }

        .detail-soft-delete-note {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 12px;
          padding: 10px;
          text-align: left;
          color: #475569;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          border-radius: 8px;
        }

        .detail-soft-delete-note svg {
          flex-shrink: 0;
          color: #2563eb;
        }

        .detail-soft-delete-note > div {
          display: flex;
          flex-direction: column;
        }

        .detail-soft-delete-note strong {
          color: #1e40af;
          font-size: 11px;
        }

        .detail-soft-delete-note span {
          margin-top: 2px;
          color: #64748b;
          font-size: 10px;
          line-height: 1.55;
        }

        .detail-modal-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-top: 17px;
        }

        .detail-modal-actions button {
          min-height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          border-radius: 8px;
          font-family: inherit;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .detail-modal-cancel {
          color: #475569;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .detail-modal-delete {
          color: #ffffff;
          background: #dc2626;
          border: 1px solid #dc2626;
        }

        .detail-modal-actions button:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        /* ======================================
           Loading / Not Found
        ====================================== */

        .detail-loading {
          min-height: 350px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          color: #64748b;
        }

        .detail-spinner,
        .detail-button-spinner {
          animation: detail-spin .75s linear infinite;
        }

        .detail-spinner {
          color: #155eef;
        }

        .detail-loading > div {
          display: flex;
          flex-direction: column;
        }

        .detail-loading strong {
          color: #334155;
          font-size: 14px;
        }

        .detail-loading span {
          margin-top: 2px;
          font-size: 11px;
        }

        @keyframes detail-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .detail-not-found {
          min-height: 380px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px;
          text-align: center;
          box-sizing: border-box;
        }

        .detail-not-found-icon {
          width: 55px;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dc2626;
          background: #fff1f2;
          border-radius: 50%;
        }

        .detail-not-found h2 {
          margin: 13px 0 0;
          color: #002060;
          font-size: 21px;
        }

        .detail-not-found p {
          max-width: 450px;
          margin: 7px 0 17px;
          color: #64748b;
          font-size: 12px;
          line-height: 1.6;
        }

        .detail-not-found a {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #ffffff;
          background: #002060;
          padding: 9px 13px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
        }

        /* ======================================
           Tablet
        ====================================== */

        @media (max-width: 1000px) {
          .detail-main-grid {
            grid-template-columns: 1fr;
          }

          .detail-side {
            position: static;
          }

          .detail-decision-options {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* ======================================
           Mobile
        ====================================== */

        @media (max-width: 700px) {
          .detail-page {
            padding: 0 0 30px;
          }

          .detail-header {
            align-items: flex-start;
          }

          .detail-header-left {
            align-items: flex-start;
          }

          .detail-eyebrow {
            font-size: 10px;
          }

          .detail-header h1 {
            font-size: 23px;
          }

          .detail-request-number {
            font-size: 11px;
          }

          .detail-back-button {
            display: none;
          }

          .detail-message strong {
            font-size: 13px;
          }

          .detail-message span {
            font-size: 11px;
          }

          .detail-status-card {
            align-items: flex-start;
            flex-direction: column;
            gap: 14px;
            padding: 16px;
          }

          .detail-status-main {
            min-width: 0;
          }

          .detail-status-divider {
            width: 100%;
            height: 1px;
          }

          .detail-status-meta {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 13px;
          }

          .detail-status-meta small {
            font-size: 10px;
          }

          .detail-status-meta strong {
            font-size: 12px;
          }

          .detail-section {
            padding: 16px;
            border-radius: 12px;
          }

          .detail-section-header h2 {
            font-size: 16px;
          }

          .detail-section-header p {
            font-size: 11px;
          }

          .detail-info-grid {
            grid-template-columns: 1fr;
          }

          .detail-info.full-width {
            grid-column: auto;
          }

          .detail-reason.full-width {
            grid-column: auto;
          }

          .detail-info-label {
            font-size: 11px;
          }

          .detail-info strong {
            font-size: 13px;
          }

          .detail-info strong.highlight {
            font-size: 15px;
          }

          .detail-bank-row > span {
            font-size: 9px;
          }

          .detail-reason-title {
            font-size: 11px;
          }

          .detail-reason p {
            font-size: 13px;
          }

          .detail-decision-card,
          .detail-result-card {
            padding: 17px;
          }

          .detail-decision-header h2 {
            font-size: 16px;
          }

          .detail-decision-header p {
            font-size: 11px;
          }

          .detail-notice {
            font-size: 11px;
          }

          .detail-field > label {
            font-size: 12px;
          }

          .detail-field textarea {
            font-size: 13px;
          }

          .detail-decision-options {
            grid-template-columns: 1fr;
          }

          .detail-decision-option strong {
            font-size: 13px;
          }

          .detail-decision-option span {
            font-size: 11px;
          }

          .detail-save-button {
            min-height: 44px;
            font-size: 13px;
          }

          .detail-delete-button {
            min-height: 40px;
            font-size: 12px;
          }

          .detail-delete-note {
            font-size: 10px;
          }

          .detail-delete-modal {
            padding: 23px 18px;
          }

          .detail-modal-actions button {
            font-size: 12px;
          }
        }

        @media (max-width: 430px) {
          .detail-status-meta {
            grid-template-columns: 1fr;
          }

          .detail-modal-actions {
            grid-template-columns: 1fr;
          }
        }
      `}
    </style>
  );
}
