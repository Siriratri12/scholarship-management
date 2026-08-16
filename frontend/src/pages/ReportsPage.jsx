import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Download,
  FileBarChart,
  FileText,
  Filter,
  Printer,
  RefreshCw,
  Search,
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
};

const statusLabels = {
  PENDING: "รอพิจารณา",
  APPROVED: "อนุมัติ",
  REJECTED: "ไม่อนุมัติ",
};

export default function ReportsPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    status: "ALL",
    scholarshipType: "ALL",
    startDate: "",
    endDate: "",
  });

  const fetchReportData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/scholarships`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "ไม่สามารถโหลดข้อมูลรายงานได้");
      }

      const resultItems = data.data?.items || data.data || [];

      setItems(resultItems.filter((item) => !item.deletedAt));
    } catch (err) {
      console.error("Reports error:", err);

      setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลรายงาน");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const search = filters.search.trim().toLowerCase();

      const requestNumber = item.requestNumber || item.requestNo || "";

      const matchSearch =
        !search ||
        item.studentName?.toLowerCase().includes(search) ||
        item.studentId?.toLowerCase().includes(search) ||
        requestNumber.toLowerCase().includes(search);

      const matchStatus =
        filters.status === "ALL" || item.status === filters.status;

      const matchType =
        filters.scholarshipType === "ALL" ||
        item.scholarshipType === filters.scholarshipType;

      let matchDate = true;

      if (item.createdAt) {
        const createdDate = new Date(item.createdAt);

        createdDate.setHours(0, 0, 0, 0);

        if (filters.startDate) {
          const start = new Date(`${filters.startDate}T00:00:00`);

          if (createdDate < start) {
            matchDate = false;
          }
        }

        if (filters.endDate) {
          const end = new Date(`${filters.endDate}T23:59:59`);

          if (createdDate > end) {
            matchDate = false;
          }
        }
      }

      return matchSearch && matchStatus && matchType && matchDate;
    });
  }, [items, filters]);

  const summary = useMemo(() => {
    const total = filteredItems.length;

    const pending = filteredItems.filter(
      (item) => item.status === "PENDING",
    ).length;

    const approved = filteredItems.filter(
      (item) => item.status === "APPROVED",
    ).length;

    const rejected = filteredItems.filter(
      (item) => item.status === "REJECTED",
    ).length;

    const totalAmount = filteredItems.reduce(
      (sum, item) => sum + Number(item.requestedAmount || 0),
      0,
    );

    return {
      total,
      pending,
      approved,
      rejected,
      totalAmount,
    };
  }, [filteredItems]);

  const typeSummary = useMemo(() => {
    const result = {};

    filteredItems.forEach((item) => {
      const type = item.scholarshipType || "OTHER";

      if (!result[type]) {
        result[type] = {
          count: 0,
          approved: 0,
          pending: 0,
          rejected: 0,
          amount: 0,
        };
      }

      result[type].count += 1;

      result[type].amount += Number(item.requestedAmount || 0);

      if (item.status === "APPROVED") {
        result[type].approved += 1;
      }

      if (item.status === "PENDING") {
        result[type].pending += 1;
      }

      if (item.status === "REJECTED") {
        result[type].rejected += 1;
      }
    });

    return Object.entries(result).map(([type, data]) => ({
      type,
      ...data,
    }));
  }, [filteredItems]);

  const approvalRate =
    summary.total > 0
      ? Math.round((summary.approved / summary.total) * 100)
      : 0;

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "ALL",
      scholarshipType: "ALL",
      startDate: "",
      endDate: "",
    });
  };

  const handleExportCSV = () => {
    if (filteredItems.length === 0) {
      alert("ไม่มีข้อมูลสำหรับ Export");

      return;
    }

    const headers = [
      "เลขที่คำขอ",
      "รหัสนักศึกษา",
      "ชื่อ-นามสกุล",
      "คณะ",
      "สาขาวิชา",
      "ประเภททุน",
      "จำนวนเงิน",
      "สถานะ",
      "วันที่ยื่น",
    ];

    const rows = filteredItems.map((item) => [
      item.requestNumber || item.requestNo || item.id,
      item.studentId || "",
      item.studentName || "",
      item.faculty || "",
      item.major || "",
      getTypeLabel(item.scholarshipType),
      Number(item.requestedAmount || 0),
      getStatusLabel(item.status),
      formatDate(item.createdAt),
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => {
            const text = String(value ?? "").replace(/"/g, '""');

            return `"${text}"`;
          })
          .join(","),
      )
      .join("\n");

    // BOM ให้ Excel อ่านภาษาไทยถูกต้อง
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `scholarship-report-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <>
        <div className="report-loading">
          <div className="report-spinner" />

          <div>
            <strong>กำลังเตรียมรายงาน</strong>

            <span>กรุณารอสักครู่...</span>
          </div>
        </div>

        <ReportStyles />
      </>
    );
  }

  return (
    <div className="reports-page">
      {/* =========================
          HEADER
      ========================= */}

      <section className="reports-header">
        <div>
          <div className="reports-eyebrow">REPORT & ANALYTICS</div>

          <h1>รายงานข้อมูลทุนการศึกษา</h1>

          <p>
            ค้นหา กรอง และสรุปข้อมูลคำขอทุน
            เพื่อใช้ประกอบการรายงานและวิเคราะห์ข้อมูล
          </p>
        </div>

        <div className="reports-actions">
          <button
            type="button"
            className="report-secondary-button"
            onClick={fetchReportData}
          >
            <RefreshCw size={15} />
            รีเฟรช
          </button>

          <button
            type="button"
            className="report-secondary-button"
            onClick={handlePrint}
          >
            <Printer size={15} />
            พิมพ์
          </button>

          <button
            type="button"
            className="report-export-button"
            onClick={handleExportCSV}
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </section>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="report-error">
          <XCircle size={17} />

          <span>{error}</span>
        </div>
      )}

      {/* =========================
          FILTER PANEL
      ========================= */}

      <section className="report-filter-panel">
        <div className="report-filter-heading">
          <div className="report-filter-icon">
            <Filter size={18} />
          </div>

          <div>
            <h2>ตัวกรองรายงาน</h2>

            <p>เลือกเงื่อนไขเพื่อดูรายงานเฉพาะข้อมูลที่ต้องการ</p>
          </div>
        </div>

        <div className="report-filter-grid">
          <div className="report-field report-search-field">
            <label>ค้นหาคำขอ</label>

            <div className="report-input-icon">
              <Search size={15} />

              <input
                type="text"
                placeholder="ชื่อ, รหัสนักศึกษา หรือเลขที่คำขอ"
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="report-field">
            <label>สถานะ</label>

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
            >
              <option value="ALL">ทุกสถานะ</option>

              <option value="PENDING">รอพิจารณา</option>

              <option value="APPROVED">อนุมัติ</option>

              <option value="REJECTED">ไม่อนุมัติ</option>
            </select>
          </div>

          <div className="report-field">
            <label>ประเภททุน</label>

            <select
              value={filters.scholarshipType}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  scholarshipType: e.target.value,
                }))
              }
            >
              <option value="ALL">ทุกประเภททุน</option>

              {Object.entries(scholarshipTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="report-field">
            <label>วันที่เริ่มต้น</label>

            <div className="report-input-icon">
              <CalendarDays size={15} />

              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="report-field">
            <label>วันที่สิ้นสุด</label>

            <div className="report-input-icon">
              <CalendarDays size={15} />

              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="report-filter-bottom">
          <div>
            แสดงผล <strong>{filteredItems.length}</strong> จาก{" "}
            <strong>{items.length}</strong> รายการ
          </div>

          <button type="button" onClick={handleResetFilters}>
            ล้างตัวกรอง
          </button>
        </div>
      </section>

      {/* =========================
          SUMMARY
      ========================= */}

      <section className="report-summary-grid">
        <ReportCard
          icon={FileText}
          label="คำขอในรายงาน"
          value={summary.total}
          unit="รายการ"
          variant="blue"
        />

        <ReportCard
          icon={CheckCircle2}
          label="อนุมัติ"
          value={summary.approved}
          unit="รายการ"
          variant="green"
        />

        <ReportCard
          icon={XCircle}
          label="ไม่อนุมัติ"
          value={summary.rejected}
          unit="รายการ"
          variant="red"
        />

        <ReportCard
          icon={WalletCards}
          label="ยอดเงินรวม"
          value={summary.totalAmount.toLocaleString()}
          unit="บาท"
          variant="purple"
        />
      </section>

      {/* =========================
          RATE
      ========================= */}

      <section className="report-rate-card">
        <div>
          <span>อัตราการอนุมัติจากข้อมูลที่กรอง</span>

          <strong>{approvalRate}%</strong>
        </div>

        <div className="report-rate-track">
          <div
            className="report-rate-progress"
            style={{
              width: `${approvalRate}%`,
            }}
          />
        </div>

        <small>
          อนุมัติ {summary.approved} จาก {summary.total} รายการ
        </small>
      </section>

      {/* =========================
          TYPE SUMMARY TABLE
      ========================= */}

      <section className="report-panel">
        <div className="report-panel-header">
          <div>
            <span>SUMMARY BY TYPE</span>

            <h2>สรุปข้อมูลแยกตามประเภททุน</h2>

            <p>แสดงจำนวนคำขอ ผลการพิจารณา และยอดเงินรวมในแต่ละประเภท</p>
          </div>

          <FileBarChart size={20} />
        </div>

        {typeSummary.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="report-table-wrap">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>ประเภททุน</th>

                    <th className="center">คำขอ</th>

                    <th className="center">รอพิจารณา</th>

                    <th className="center">อนุมัติ</th>

                    <th className="center">ไม่อนุมัติ</th>

                    <th className="right">ยอดเงินรวม</th>
                  </tr>
                </thead>

                <tbody>
                  {typeSummary.map((item) => (
                    <tr key={item.type}>
                      <td>
                        <div className="report-type-name">
                          <div className="report-type-icon">
                            <WalletCards size={15} />
                          </div>

                          <span>{getTypeLabel(item.type)}</span>
                        </div>
                      </td>

                      <td className="center">{item.count}</td>

                      <td className="center">
                        <StatusNumber value={item.pending} type="pending" />
                      </td>

                      <td className="center">
                        <StatusNumber value={item.approved} type="approved" />
                      </td>

                      <td className="center">
                        <StatusNumber value={item.rejected} type="rejected" />
                      </td>

                      <td className="right report-money">
                        {item.amount.toLocaleString()} บาท
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr>
                    <td>รวมทั้งหมด</td>

                    <td className="center">{summary.total}</td>

                    <td className="center">{summary.pending}</td>

                    <td className="center">{summary.approved}</td>

                    <td className="center">{summary.rejected}</td>

                    <td className="right">
                      {summary.totalAmount.toLocaleString()} บาท
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Mobile */}

            <div className="report-type-mobile-list">
              {typeSummary.map((item) => (
                <article
                  className="report-type-mobile-card"
                  key={`${item.type}-mobile`}
                >
                  <div className="report-type-mobile-heading">
                    <div className="report-type-icon">
                      <WalletCards size={16} />
                    </div>

                    <strong>{getTypeLabel(item.type)}</strong>
                  </div>

                  <div className="report-type-mobile-grid">
                    <MobileValue label="คำขอ" value={`${item.count} รายการ`} />

                    <MobileValue label="รอพิจารณา" value={`${item.pending}`} />

                    <MobileValue label="อนุมัติ" value={`${item.approved}`} />

                    <MobileValue
                      label="ไม่อนุมัติ"
                      value={`${item.rejected}`}
                    />
                  </div>

                  <div className="report-type-mobile-money">
                    <span>ยอดเงินรวม</span>

                    <strong>{item.amount.toLocaleString()} บาท</strong>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {/* =========================
          DETAIL LIST
      ========================= */}

      <section className="report-panel report-detail-panel">
        <div className="report-panel-header">
          <div>
            <span>REPORT DETAILS</span>

            <h2>รายการคำขอในรายงาน</h2>

            <p>รายละเอียดคำขอทั้งหมดตามเงื่อนไขที่เลือก</p>
          </div>

          <FileText size={20} />
        </div>

        {filteredItems.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="report-table-wrap">
            <table className="report-table report-detail-table">
              <thead>
                <tr>
                  <th>เลขที่คำขอ</th>

                  <th>นักศึกษา</th>

                  <th>ประเภททุน</th>

                  <th className="right">จำนวนเงิน</th>

                  <th className="center">สถานะ</th>

                  <th>วันที่ยื่น</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td className="report-request-number">
                      {item.requestNumber || item.requestNo || `#${item.id}`}
                    </td>

                    <td>
                      <div className="report-student">
                        <strong>{item.studentName || "-"}</strong>

                        <span>{item.studentId || "-"}</span>
                      </div>
                    </td>

                    <td>{getTypeLabel(item.scholarshipType)}</td>

                    <td className="right report-money">
                      {Number(item.requestedAmount || 0).toLocaleString()} บาท
                    </td>

                    <td className="center">
                      <StatusBadge status={item.status} />
                    </td>

                    <td>{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ReportStyles />
    </div>
  );
}

/* =========================================================
   Components
========================================================= */

function ReportCard({ icon: Icon, label, value, unit, variant }) {
  return (
    <article className={`report-summary-card ${variant}`}>
      <div className="report-summary-icon">
        <Icon size={19} />
      </div>

      <div>
        <span>{label}</span>

        <div>
          <strong>{value}</strong>

          <small>{unit}</small>
        </div>
      </div>
    </article>
  );
}

function StatusNumber({ value, type }) {
  return <span className={`report-status-number ${type}`}>{value}</span>;
}

function StatusBadge({ status }) {
  return (
    <span
      className={`report-status-badge ${status?.toLowerCase() || "pending"}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}

function MobileValue({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="report-empty">
      <FileBarChart size={28} />

      <strong>ไม่พบข้อมูล</strong>

      <span>ลองเปลี่ยนเงื่อนไขตัวกรองแล้วตรวจสอบอีกครั้ง</span>
    </div>
  );
}

/* =========================================================
   Helpers
========================================================= */

function getTypeLabel(type) {
  return scholarshipTypeLabels[type] || type || "อื่น ๆ";
}

function getStatusLabel(status) {
  return statusLabels[status] || status || "-";
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/* =========================================================
   CSS
========================================================= */

function ReportStyles() {
  return (
    <style>
      {`
        .reports-page {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 6px 8px 40px;
          box-sizing: border-box;
          color: #1e293b;
        }

        /* =========================
           HEADER
        ========================= */

        .reports-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 25px;
          margin-bottom: 22px;
        }

        .reports-eyebrow {
          margin-bottom: 5px;
          color: #2563eb;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .14em;
        }

        .reports-header h1 {
          margin: 0;
          color: #002060;
          font-size: clamp(28px, 3vw, 36px);
        }

        .reports-header p {
          max-width: 650px;
          margin: 7px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.7;
        }

        .reports-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .reports-actions button {
          min-height: 37px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0 12px;
          border-radius: 8px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .report-secondary-button {
          color: #475569;
          background: #ffffff;
          border: 1px solid #d8e1eb;
        }

        .report-export-button {
          color: #ffffff;
          background: #002060;
          border: 1px solid #002060;
        }

        /* =========================
           ERROR
        ========================= */

        .report-error {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          padding: 11px 13px;
          color: #dc2626;
          background: #fff5f5;
          border: 1px solid #fecaca;
          border-radius: 9px;
          font-size: 13px;
        }

        /* =========================
           FILTER
        ========================= */

        .report-filter-panel {
          margin-bottom: 16px;
          padding: 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 4px 14px rgba(15,23,42,.025);
        }

        .report-filter-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 17px;
        }

        .report-filter-icon {
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

        .report-filter-heading h2 {
          margin: 0;
          color: #002060;
          font-size: 16px;
        }

        .report-filter-heading p {
          margin: 2px 0 0;
          color: #94a3b8;
          font-size: 12px;
        }

        .report-filter-grid {
          display: grid;
          grid-template-columns:
            minmax(200px,1.6fr)
            repeat(4,minmax(130px,1fr));
          gap: 12px;
        }

        .report-field label {
          display: block;
          margin-bottom: 5px;
          color: #475569;
          font-size: 12px;
          font-weight: 700;
        }

        .report-field input,
        .report-field select {
          width: 100%;
          height: 39px;
          padding: 0 11px;
          box-sizing: border-box;
          color: #334155;
          background: #f8fafc;
          border: 1px solid #d6e0ea;
          border-radius: 8px;
          outline: none;
          font-family: inherit;
          font-size: 12px;
        }

        .report-field input::placeholder {
          color: #94a3b8;
          font-size: 12px;
        }

        .report-field input:focus,
        .report-field select:focus {
          background: #ffffff;
          border-color: #5b88e5;
          box-shadow: 0 0 0 3px rgba(37,99,235,.07);
        }

        .report-input-icon {
          position: relative;
        }

        .report-input-icon svg {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .report-input-icon input {
          padding-left: 34px;
        }

        .report-filter-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-top: 15px;
          padding-top: 13px;
          color: #94a3b8;
          border-top: 1px solid #f1f5f9;
          font-size: 12px;
        }

        .report-filter-bottom strong {
          color: #002060;
        }

        .report-filter-bottom button {
          padding: 0;
          color: #2563eb;
          background: transparent;
          border: 0;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        /* =========================
           SUMMARY
        ========================= */

        .report-summary-grid {
          display: grid;
          grid-template-columns:
            repeat(4,minmax(0,1fr));
          gap: 12px;
          margin-bottom: 14px;
        }

        .report-summary-card {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .report-summary-icon {
          width: 39px;
          height: 39px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 10px;
        }

        .report-summary-card.blue .report-summary-icon {
          color: #155eef;
          background: #eff4ff;
        }

        .report-summary-card.green .report-summary-icon {
          color: #059669;
          background: #ecfdf5;
        }

        .report-summary-card.red .report-summary-icon {
          color: #dc2626;
          background: #fff1f2;
        }

        .report-summary-card.purple .report-summary-icon {
          color: #7c3aed;
          background: #f5f3ff;
        }

        .report-summary-card > div:last-child {
          min-width: 0;
        }

        .report-summary-card span {
          color: #64748b;
          font-size: 12px;
        }

        .report-summary-card > div:last-child > div {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-top: 3px;
        }

        .report-summary-card strong {
          color: #002060;
          font-size: 24px;
        }

        .report-summary-card small {
          color: #94a3b8;
          font-size: 11px;
        }

        /* =========================
           APPROVAL RATE
        ========================= */

        .report-rate-card {
          display: grid;
          grid-template-columns: auto minmax(150px,1fr) auto;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          padding: 14px 17px;
          color: #ffffff;
          background:
            linear-gradient(
              125deg,
              #002060,
              #07418e
            );
          border-radius: 12px;
        }

        .report-rate-card > div:first-child {
          display: flex;
          align-items: baseline;
          gap: 9px;
        }

        .report-rate-card span {
          color: #c8daf6;
          font-size: 12px;
        }

        .report-rate-card strong {
          font-size: 20px;
        }

        .report-rate-track {
          width: 100%;
          height: 6px;
          overflow: hidden;
          background: rgba(255,255,255,.18);
          border-radius: 999px;
        }

        .report-rate-progress {
          height: 100%;
          background: #ffffff;
          border-radius: inherit;
        }

        .report-rate-card small {
          color: #b8cdf0;
          font-size: 11px;
        }

        /* =========================
           PANEL
        ========================= */

        .report-panel {
          margin-bottom: 16px;
          padding: 21px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 4px 14px rgba(15,23,42,.025);
        }

        .report-panel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          padding-bottom: 15px;
          margin-bottom: 15px;
          border-bottom: 1px solid #f1f5f9;
        }

        .report-panel-header > div > span {
          color: #2563eb;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .12em;
        }

        .report-panel-header h2 {
          margin: 3px 0 0;
          color: #002060;
          font-size: 17px;
        }

        .report-panel-header p {
          margin: 4px 0 0;
          color: #94a3b8;
          font-size: 12px;
        }

        .report-panel-header > svg {
          color: #155eef;
        }

        /* =========================
           TABLE
        ========================= */

        .report-table-wrap {
          overflow-x: auto;
        }

        .report-table {
          width: 100%;
          min-width: 760px;
          border-collapse: collapse;
        }

        .report-table th {
          padding: 10px 12px;
          color: #64748b;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          text-align: left;
          font-size: 11px;
          font-weight: 700;
        }

        .report-table td {
          padding: 11px 12px;
          color: #475569;
          border-bottom: 1px solid #f1f5f9;
          font-size: 12px;
        }

        .report-table tbody tr:hover {
          background: #fbfdff;
        }

        .report-table .center {
          text-align: center;
        }

        .report-table .right {
          text-align: right;
        }

        .report-table tfoot td {
          color: #002060;
          background: #f8fafc;
          font-size: 12px;
          font-weight: 700;
        }

        .report-type-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
        }

        .report-type-icon {
          width: 29px;
          height: 29px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #2563eb;
          background: #eff4ff;
          border-radius: 7px;
        }

        .report-status-number {
          display: inline-flex;
          min-width: 25px;
          min-height: 22px;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
        }

        .report-status-number.pending {
          color: #b45309;
          background: #fffbeb;
        }

        .report-status-number.approved {
          color: #047857;
          background: #ecfdf5;
        }

        .report-status-number.rejected {
          color: #dc2626;
          background: #fff1f2;
        }

        .report-money {
          color: #002060 !important;
          font-weight: 700;
        }

        /* =========================
           DETAIL TABLE
        ========================= */

        .report-request-number {
          color: #002060 !important;
          font-weight: 700;
        }

        .report-student {
          display: flex;
          flex-direction: column;
        }

        .report-student strong {
          color: #334155;
          font-size: 12px;
        }

        .report-student span {
          margin-top: 2px;
          color: #94a3b8;
          font-size: 10px;
        }

        .report-status-badge {
          display: inline-block;
          padding: 4px 7px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
        }

        .report-status-badge.pending {
          color: #b45309;
          background: #fffbeb;
        }

        .report-status-badge.approved {
          color: #047857;
          background: #ecfdf5;
        }

        .report-status-badge.rejected {
          color: #dc2626;
          background: #fff1f2;
        }

        /* =========================
           MOBILE TYPE CARDS
        ========================= */

        .report-type-mobile-list {
          display: none;
        }

        /* =========================
           EMPTY
        ========================= */

        .report-empty {
          min-height: 150px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
        }

        .report-empty svg {
          margin-bottom: 8px;
        }

        .report-empty strong {
          color: #64748b;
          font-size: 13px;
        }

        .report-empty span {
          margin-top: 3px;
          font-size: 11px;
        }

        /* =========================
           LOADING
        ========================= */

        .report-loading {
          min-height: 350px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          color: #64748b;
        }

        .report-loading > div:last-child {
          display: flex;
          flex-direction: column;
        }

        .report-loading strong {
          color: #334155;
          font-size: 14px;
        }

        .report-loading span {
          margin-top: 2px;
          font-size: 11px;
        }

        .report-spinner {
          width: 23px;
          height: 23px;
          border: 3px solid #dbe5f0;
          border-top-color: #155eef;
          border-radius: 50%;
          animation: report-spin .7s linear infinite;
        }

        @keyframes report-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width: 1150px) {
          .report-filter-grid {
            grid-template-columns:
              repeat(2,minmax(0,1fr));
          }

          .report-search-field {
            grid-column: 1 / -1;
          }

          .report-summary-grid {
            grid-template-columns:
              repeat(2,minmax(0,1fr));
          }
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 700px) {
          .reports-page {
            padding: 0 0 30px;
          }

          .reports-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 15px;
          }

          .reports-eyebrow {
            font-size: 10px;
          }

          .reports-header h1 {
            font-size: 27px;
          }

          .reports-header p {
            font-size: 13px;
          }

          .reports-actions {
            width: 100%;
          }

          .reports-actions button {
            flex: 1;
            padding: 0 7px;
            font-size: 12px;
          }

          .report-filter-panel {
            padding: 16px;
          }

          .report-filter-heading h2 {
            font-size: 15px;
          }

          .report-filter-heading p {
            font-size: 11px;
          }

          .report-filter-grid {
            grid-template-columns: 1fr;
          }

          .report-search-field {
            grid-column: auto;
          }

          .report-field label {
            font-size: 12px;
          }

          .report-field input,
          .report-field select {
            height: 43px;
            font-size: 13px;
          }

          .report-field input::placeholder {
            font-size: 12px;
          }

          .report-filter-bottom {
            align-items: flex-start;
            flex-direction: column;
            font-size: 11px;
          }

          .report-filter-bottom button {
            font-size: 11px;
          }

          .report-summary-grid {
            grid-template-columns:
              repeat(2,minmax(0,1fr));
            gap: 9px;
          }

          .report-summary-card {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
            padding: 14px;
          }

          .report-summary-card span {
            font-size: 12px;
          }

          .report-summary-card strong {
            font-size: 22px;
          }

          .report-summary-card small {
            font-size: 10px;
          }

          .report-rate-card {
            grid-template-columns: 1fr;
            gap: 9px;
          }

          .report-rate-card span {
            font-size: 11px;
          }

          .report-rate-card small {
            font-size: 10px;
          }

          .report-panel {
            padding: 16px;
          }

          .report-panel-header > div > span {
            font-size: 9px;
          }

          .report-panel-header h2 {
            font-size: 16px;
          }

          .report-panel-header p {
            font-size: 11px;
            line-height: 1.5;
          }

          /* =========================
             TYPE SUMMARY AS CARDS
          ========================= */

          .report-panel:not(.report-detail-panel)
          .report-table-wrap {
            display: none;
          }

          .report-type-mobile-list {
            display: flex;
            flex-direction: column;
            gap: 9px;
          }

          .report-type-mobile-card {
            padding: 13px;
            background: #f8fafc;
            border: 1px solid #e5ebf2;
            border-radius: 9px;
          }

          .report-type-mobile-heading {
            display: flex;
            align-items: center;
            gap: 9px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e5ebf2;
          }

          .report-type-mobile-heading strong {
            color: #002060;
            font-size: 13px;
          }

          .report-type-mobile-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 11px;
          }

          .report-type-mobile-grid > div {
            display: flex;
            flex-direction: column;
          }

          .report-type-mobile-grid span {
            color: #94a3b8;
            font-size: 10px;
          }

          .report-type-mobile-grid strong {
            margin-top: 2px;
            color: #334155;
            font-size: 12px;
          }

          .report-type-mobile-money {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-top: 11px;
            padding-top: 10px;
            border-top: 1px solid #e5ebf2;
          }

          .report-type-mobile-money span {
            color: #64748b;
            font-size: 11px;
          }

          .report-type-mobile-money strong {
            color: #002060;
            font-size: 13px;
          }

          /* รายการละเอียดให้ scroll ได้ */

          .report-detail-table {
            min-width: 720px;
          }

          .report-table th {
            font-size: 11px;
          }

          .report-table td {
            font-size: 12px;
          }

          .report-student strong {
            font-size: 12px;
          }

          .report-student span {
            font-size: 10px;
          }

          .report-status-badge {
            font-size: 10px;
          }
        }

        /* =========================
           SMALL PHONE
        ========================= */

        @media (max-width: 430px) {
          .reports-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .report-export-button {
            grid-column: 1 / -1;
          }

          .report-summary-grid {
            grid-template-columns: 1fr;
          }

          .report-summary-card {
            align-items: center;
            flex-direction: row;
          }

          .report-summary-card strong {
            font-size: 23px;
          }
        }

        /* =========================
           PRINT
        ========================= */

        @media print {
          .reports-actions,
          .report-filter-panel,
          .report-detail-panel {
            display: none !important;
          }

          .reports-page {
            max-width: none;
            padding: 0;
          }

          .report-panel,
          .report-summary-card,
          .report-rate-card {
            box-shadow: none;
            break-inside: avoid;
          }
        }
      `}
    </style>
  );
}
