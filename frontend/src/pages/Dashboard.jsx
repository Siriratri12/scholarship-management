import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  Banknote,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileText,
  GraduationCap,
  HeartHandshake,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  TrendingUp,
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

const scholarshipTypeIcons = {
  NEEDY: HeartHandshake,
  ACADEMIC: GraduationCap,
  WORK: BriefcaseBusiness,
  EMERGENCY: AlertCircle,
  ACTIVITY: Sparkles,
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalAmount: 0,
    byType: {},
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
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
      const res = await fetch(`${API_URL}/api/dashboard`, {
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
        throw new Error(data.message || "ไม่สามารถโหลดข้อมูล Dashboard ได้");
      }

      const summary = data.data?.summary || {};
      const scholarshipTypes = data.data?.scholarshipTypes || [];

      const byType = {};

      let totalAmount = 0;

      scholarshipTypes.forEach((item) => {
        const type = item.scholarshipType || item.type || "OTHER";

        const count = Number(item.count || 0);

        const amount = Number(item.totalAmount || item.amount || 0);

        byType[type] = {
          count,
          amount,
        };

        totalAmount += amount;
      });

      setStats({
        total: Number(summary.total || 0),
        pending: Number(summary.pending || 0),
        approved: Number(summary.approved || 0),
        rejected: Number(summary.rejected || 0),
        totalAmount,
        byType,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);

      setError(err.message || "เกิดข้อผิดพลาดในการโหลด Dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <DashboardLoading />;
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <div className="dashboard-error-icon">
            <AlertCircle size={21} />
          </div>

          <div className="dashboard-error-content">
            <strong>ไม่สามารถโหลดข้อมูลได้</strong>

            <span>{error}</span>
          </div>

          <button type="button" onClick={fetchDashboardData}>
            <RefreshCw size={15} />
            ลองอีกครั้ง
          </button>
        </div>

        <DashboardStyles />
      </div>
    );
  }

  const typeEntries = Object.entries(stats.byType);

  const maxTypeCount = Math.max(
    ...typeEntries.map(([, value]) => Number(value.count || 0)),
    1,
  );

  const approvedPercent =
    stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

  const considered = stats.approved + stats.rejected;

  const consideredPercent =
    stats.total > 0 ? Math.round((considered / stats.total) * 100) : 0;

  return (
    <div className="dashboard-page">
      {/* =================================
          TOP HERO
      ================================= */}

      <section className="dashboard-hero">
        <div className="dashboard-hero-main">
          <div className="dashboard-hero-icon">
            <BarChart3 size={25} />
          </div>

          <div className="dashboard-hero-copy">
            <span className="dashboard-eyebrow">SCHOLARSHIP MANAGEMENT</span>

            <h1>ภาพรวมระบบทุนการศึกษา</h1>

            <p>
              ติดตามจำนวนคำขอ สถานะการพิจารณา
              และงบประมาณจากข้อมูลคำขอทุนทั้งหมดในระบบ
            </p>
          </div>
        </div>

        <div className="dashboard-hero-metrics">
          <div className="dashboard-hero-metric">
            <div className="dashboard-hero-metric-icon">
              <FileText size={19} />
            </div>

            <div>
              <span>คำขอทั้งหมด</span>

              <strong>{stats.total.toLocaleString()}</strong>

              <small>รายการ</small>
            </div>
          </div>

          <div className="dashboard-hero-divider" />

          <div className="dashboard-hero-metric">
            <div className="dashboard-hero-metric-icon dashboard-hero-metric-money">
              <CircleDollarSign size={20} />
            </div>

            <div>
              <span>ยอดเงินรวม</span>

              <strong>{stats.totalAmount.toLocaleString("th-TH")}</strong>

              <small>บาท</small>
            </div>
          </div>
        </div>
      </section>

      {/* =================================
          SUMMARY
      ================================= */}

      <section className="dashboard-summary-grid">
        <SummaryCard
          icon={FileText}
          title="คำขอทั้งหมด"
          subtitle="Total Requests"
          value={stats.total}
          unit="รายการ"
          variant="blue"
        />

        <SummaryCard
          icon={Clock3}
          title="รอพิจารณา"
          subtitle="Pending"
          value={stats.pending}
          unit="รายการ"
          variant="amber"
        />

        <SummaryCard
          icon={CheckCircle2}
          title="อนุมัติแล้ว"
          subtitle="Approved"
          value={stats.approved}
          unit="รายการ"
          variant="green"
        />

        <SummaryCard
          icon={XCircle}
          title="ไม่อนุมัติ"
          subtitle="Rejected"
          value={stats.rejected}
          unit="รายการ"
          variant="red"
        />
      </section>

      {/* =================================
          STATUS OVERVIEW
      ================================= */}

      <section className="dashboard-status-panel">
        <div className="dashboard-status-left">
          <div className="dashboard-status-heading">
            <div className="dashboard-status-icon">
              <Activity size={20} />
            </div>

            <div>
              <h2>สถานะการดำเนินงาน</h2>

              <p>ภาพรวมการพิจารณาคำขอทุนในระบบ</p>
            </div>
          </div>

          <div className="dashboard-status-progress">
            <div className="dashboard-status-progress-head">
              <span>พิจารณาแล้ว</span>

              <strong>
                {considered} / {stats.total} รายการ
              </strong>
            </div>

            <div className="dashboard-status-track">
              <div
                className="dashboard-status-fill"
                style={{
                  width: `${consideredPercent}%`,
                }}
              />
            </div>

            <div className="dashboard-status-caption">
              ดำเนินการแล้ว {consideredPercent}% ของคำขอทั้งหมด
            </div>
          </div>
        </div>

        <div className="dashboard-status-right">
          <div className="dashboard-rate-card">
            <span>อัตราการอนุมัติ</span>

            <div>
              <TrendingUp size={18} />

              <strong>{approvedPercent}%</strong>
            </div>
          </div>

          <div className="dashboard-rate-card">
            <span>รอพิจารณา</span>

            <div>
              <Clock3 size={18} />

              <strong>{stats.pending}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* =================================
          MAIN PANELS
      ================================= */}

      <section className="dashboard-detail-grid">
        <div className="dashboard-panel">
          <PanelHeader
            icon={BarChart3}
            title="จำนวนคำขอแยกตามประเภททุน"
            description="เปรียบเทียบจำนวนคำขอในแต่ละประเภททุน"
          />

          <div className="dashboard-chart-list">
            {typeEntries.length === 0 ? (
              <EmptyState
                icon={BookOpenCheck}
                message="ยังไม่มีข้อมูลคำขอทุนในระบบ"
              />
            ) : (
              typeEntries.map(([type, item]) => {
                const percentage =
                  (Number(item.count || 0) / maxTypeCount) * 100;

                const Icon = scholarshipTypeIcons[type] || GraduationCap;

                return (
                  <div className="dashboard-chart-item" key={type}>
                    <div className="dashboard-chart-heading">
                      <div className="dashboard-type-name">
                        <div className="dashboard-type-icon">
                          <Icon size={16} />
                        </div>

                        <span>{getTypeLabel(type)}</span>
                      </div>

                      <div className="dashboard-chart-count">
                        <strong>
                          {Number(item.count || 0).toLocaleString()}
                        </strong>

                        <span>รายการ</span>
                      </div>
                    </div>

                    <div className="dashboard-progress-track">
                      <div
                        className="dashboard-progress-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="dashboard-panel-footer">
            <span>รวมคำขอทั้งหมด</span>

            <strong>{stats.total.toLocaleString()} รายการ</strong>
          </div>
        </div>

        <div className="dashboard-panel">
          <PanelHeader
            icon={WalletCards}
            title="ยอดเงินขอรับทุนแยกตามประเภท"
            description="ยอดเงินรวมจากคำขอทุนแต่ละประเภท"
          />

          <div className="dashboard-amount-list">
            {typeEntries.length === 0 ? (
              <EmptyState
                icon={Banknote}
                message="ยังไม่มีข้อมูลยอดเงินในระบบ"
              />
            ) : (
              typeEntries.map(([type, item]) => {
                const Icon = scholarshipTypeIcons[type] || GraduationCap;

                return (
                  <div className="dashboard-amount-row" key={type}>
                    <div className="dashboard-amount-type">
                      <div className="dashboard-amount-type-icon">
                        <Icon size={16} />
                      </div>

                      <div>
                        <strong>{getTypeLabel(type)}</strong>

                        <span>
                          {Number(item.count || 0).toLocaleString()} รายการ
                        </span>
                      </div>
                    </div>

                    <div className="dashboard-amount-value">
                      <strong>
                        {Number(item.amount || 0).toLocaleString("th-TH")}
                      </strong>

                      <span>บาท</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="dashboard-money-summary">
            <div className="dashboard-money-summary-icon">
              <Banknote size={22} />
            </div>

            <div className="dashboard-money-summary-copy">
              <span>ยอดเงินรวมทั้งหมด</span>

              <small>จากคำขอทุนทุกประเภท</small>
            </div>

            <strong>
              {stats.totalAmount.toLocaleString("th-TH")} <span>บาท</span>
            </strong>
          </div>
        </div>
      </section>

      <DashboardStyles />
    </div>
  );
}

/* =========================================
   SUMMARY CARD
========================================= */

function SummaryCard({ icon: Icon, title, subtitle, value, unit, variant }) {
  const variants = {
    blue: {
      color: "#155eef",
      background: "#eff4ff",
      border: "#dbe7ff",
    },

    amber: {
      color: "#d97706",
      background: "#fff8e7",
      border: "#fde8b5",
    },

    green: {
      color: "#059669",
      background: "#ecfdf3",
      border: "#c9f2dc",
    },

    red: {
      color: "#dc2626",
      background: "#fff1f2",
      border: "#ffd7dc",
    },
  };

  const current = variants[variant] || variants.blue;

  return (
    <article className="dashboard-summary-card">
      <div
        className="dashboard-summary-icon"
        style={{
          color: current.color,
          background: current.background,
          borderColor: current.border,
        }}
      >
        <Icon size={20} strokeWidth={2} />
      </div>

      <div className="dashboard-summary-info">
        <div className="dashboard-summary-title">
          <strong>{title}</strong>

          <span>{subtitle}</span>
        </div>

        <div className="dashboard-summary-value">
          <strong
            style={{
              color: current.color,
            }}
          >
            {Number(value).toLocaleString()}
          </strong>

          <span>{unit}</span>
        </div>
      </div>
    </article>
  );
}

/* =========================================
   PANEL HEADER
========================================= */

function PanelHeader({ icon: Icon, title, description }) {
  return (
    <div className="dashboard-panel-header">
      <div className="dashboard-panel-icon">
        <Icon size={19} />
      </div>

      <div>
        <h2>{title}</h2>

        <p>{description}</p>
      </div>
    </div>
  );
}

/* =========================================
   EMPTY
========================================= */

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="dashboard-empty">
      <div>
        <Icon size={27} />
      </div>

      <p>{message}</p>
    </div>
  );
}

/* =========================================
   LOADING
========================================= */

function DashboardLoading() {
  return (
    <>
      <div className="dashboard-loading">
        <LoaderCircle size={26} className="dashboard-loading-icon" />

        <div>
          <strong>กำลังโหลด Dashboard</strong>

          <span>กรุณารอสักครู่...</span>
        </div>
      </div>

      <DashboardStyles />
    </>
  );
}

/* =========================================
   LABEL
========================================= */

function getTypeLabel(type) {
  return scholarshipTypeLabels[type] || type || "อื่น ๆ";
}

/* =========================================
   STYLE
========================================= */

function DashboardStyles() {
  return (
    <style>
      {`
        .dashboard-page {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 4px 6px 36px;
          box-sizing: border-box;
          color: #172033;
        }

        /* =================================
           HERO
        ================================= */

        .dashboard-hero {
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          margin-bottom: 22px;
          padding: 26px 28px;
          background:
            linear-gradient(
              120deg,
              #ffffff 0%,
              #f8fbff 55%,
              #eef5ff 100%
            );
          border: 1px solid #dfe8f4;
          border-radius: 18px;
          box-shadow:
            0 8px 30px rgba(15, 23, 42, 0.045);
        }

        .dashboard-hero::after {
          content: "";
          position: absolute;
          width: 230px;
          height: 230px;
          top: -120px;
          right: -70px;
          border-radius: 50%;
          background: rgba(37, 99, 235, 0.07);
          pointer-events: none;
        }

        .dashboard-hero-main {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .dashboard-hero-icon {
          width: 54px;
          height: 54px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          color: #155eef;
          background: #eaf1ff;
          border: 1px solid #d7e5ff;
        }

        .dashboard-hero-copy {
          min-width: 0;
        }

        .dashboard-eyebrow {
          display: block;
          margin-bottom: 5px;
          color: #2563eb;

          /* เดิม 10px */
          font-size: 12px;

          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .dashboard-hero h1 {
          margin: 0;
          color: #002060;

          /* เดิม 24-31 */
          font-size: clamp(28px, 3vw, 36px);

          line-height: 1.3;
        }

        .dashboard-hero p {
          max-width: 630px;
          margin: 7px 0 0;
          color: #64748b;

          /* เดิม 13px */
          font-size: 15px;

          line-height: 1.7;
        }

        .dashboard-hero-metrics {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 15px 19px;
          background: rgba(255,255,255,0.82);
          border: 1px solid #dbe6f3;
          border-radius: 14px;
          box-shadow:
            0 6px 18px rgba(15,23,42,0.04);
          backdrop-filter: blur(8px);
        }

        .dashboard-hero-metric {
          min-width: 125px;
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .dashboard-hero-metric-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #155eef;
          background: #eff4ff;
          border-radius: 10px;
        }

        .dashboard-hero-metric-money {
          color: #059669;
          background: #ecfdf3;
        }

        .dashboard-hero-metric > div:last-child {
          display: grid;
          grid-template-columns: auto auto;
          align-items: baseline;
          column-gap: 4px;
        }

        .dashboard-hero-metric span {
          grid-column: 1 / -1;
          margin-bottom: 1px;
          color: #94a3b8;

          /* เดิม 10px */
          font-size: 12px;
        }

        .dashboard-hero-metric strong {
          color: #002060;

          /* เดิม 19px */
          font-size: 22px;

          line-height: 1.1;
        }

        .dashboard-hero-metric small {
          color: #64748b;

          /* เดิม 9px */
          font-size: 11px;
        }

        .dashboard-hero-divider {
          width: 1px;
          height: 34px;
          background: #e2e8f0;
        }

        /* =================================
           SUMMARY
        ================================= */

        .dashboard-summary-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 15px;
          margin-bottom: 18px;
        }

        .dashboard-summary-card {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 15px;
          box-shadow:
            0 5px 18px rgba(15,23,42,0.035);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .dashboard-summary-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 9px 25px rgba(15,23,42,0.07);
        }

        .dashboard-summary-icon {
          width: 45px;
          height: 45px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid;
          border-radius: 12px;
        }

        .dashboard-summary-info {
          min-width: 0;
        }

        .dashboard-summary-title {
          display: flex;
          flex-direction: column;
        }

        .dashboard-summary-title strong {
          color: #334155;

          /* เดิม 12px */
          font-size: 14px;
        }

        .dashboard-summary-title span {
          margin-top: 1px;
          color: #94a3b8;

          /* เดิม 9px */
          font-size: 11px;
        }

        .dashboard-summary-value {
          display: flex;
          align-items: baseline;
          gap: 5px;
          margin-top: 5px;
        }

        .dashboard-summary-value strong {
          /* เดิม 26px */
          font-size: 30px;

          line-height: 1;
        }

        .dashboard-summary-value span {
          color: #94a3b8;

          /* เดิม 10px */
          font-size: 12px;
        }

        /* =================================
           STATUS PANEL
        ================================= */

        .dashboard-status-panel {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          gap: 26px;
          margin-bottom: 18px;
          padding: 20px 22px;
          background:
            linear-gradient(
              135deg,
              #002060 0%,
              #063b83 100%
            );
          border-radius: 16px;
          box-shadow:
            0 10px 28px rgba(0,32,96,0.16);
        }

        .dashboard-status-left {
          min-width: 0;
          flex: 1;
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .dashboard-status-heading {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dashboard-status-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          background: rgba(255,255,255,.13);
          border-radius: 12px;
        }

        .dashboard-status-heading h2 {
          margin: 0;
          color: #ffffff;

          /* เดิม 14px */
          font-size: 17px;
        }

        .dashboard-status-heading p {
          margin: 3px 0 0;
          color: #bfdbfe;

          /* เดิม 10px */
          font-size: 12px;
        }

        .dashboard-status-progress {
          width: 100%;
          max-width: 390px;
        }

        .dashboard-status-progress-head {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 7px;
          color: #dbeafe;

          /* เดิม 10px */
          font-size: 12px;
        }

        .dashboard-status-progress-head strong {
          color: #ffffff;

          /* เดิม 11px */
          font-size: 13px;
        }

        .dashboard-status-track {
          width: 100%;
          height: 7px;
          overflow: hidden;
          background: rgba(255,255,255,.15);
          border-radius: 999px;
        }

        .dashboard-status-fill {
          height: 100%;
          background: #ffffff;
          border-radius: inherit;
        }

        .dashboard-status-caption {
          margin-top: 5px;
          color: #93c5fd;

          /* เดิม 9px */
          font-size: 11px;
        }

        .dashboard-status-right {
          flex-shrink: 0;
          display: flex;
          gap: 10px;
        }

        .dashboard-rate-card {
          min-width: 108px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 11px 14px;
          background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 11px;
        }

        .dashboard-rate-card > span {
          color: #bfdbfe;

          /* เดิม 9px */
          font-size: 11px;
        }

        .dashboard-rate-card > div {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          color: #ffffff;
        }

        .dashboard-rate-card strong {
          /* เดิม 18px */
          font-size: 22px;
        }

        /* =================================
           PANELS
        ================================= */

        .dashboard-detail-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1.15fr)
            minmax(0, 0.85fr);
          gap: 18px;
        }

        .dashboard-panel {
          min-width: 0;
          padding: 22px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow:
            0 5px 20px rgba(15,23,42,0.035);
        }

        .dashboard-panel-header {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          padding-bottom: 16px;
          margin-bottom: 19px;
          border-bottom: 1px solid #f1f5f9;
        }

        .dashboard-panel-icon {
          width: 37px;
          height: 37px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #155eef;
          background: #eff4ff;
          border-radius: 10px;
        }

        .dashboard-panel-header h2 {
          margin: 0;
          color: #002060;

          /* เดิม 14px */
          font-size: 17px;
        }

        .dashboard-panel-header p {
          margin: 3px 0 0;
          color: #94a3b8;

          /* เดิม 10px */
          font-size: 12px;

          line-height: 1.5;
        }

        /* =================================
           CHART
        ================================= */

        .dashboard-chart-list {
          display: flex;
          flex-direction: column;
          gap: 19px;
        }

        .dashboard-chart-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 7px;
        }

        .dashboard-type-name {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 9px;
          color: #334155;

          /* เดิม 11px */
          font-size: 13px;

          font-weight: 600;
        }

        .dashboard-type-icon {
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563eb;
          background: #f1f6ff;
          border-radius: 8px;
        }

        .dashboard-chart-count {
          flex-shrink: 0;
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .dashboard-chart-count strong {
          color: #002060;

          /* เดิม 12px */
          font-size: 14px;
        }

        .dashboard-chart-count span {
          color: #94a3b8;

          /* เดิม 9px */
          font-size: 11px;
        }

        .dashboard-progress-track {
          width: 100%;
          height: 7px;
          overflow: hidden;
          background: #edf2f7;
          border-radius: 999px;
        }

        .dashboard-progress-fill {
          min-width: 5px;
          height: 100%;
          background:
            linear-gradient(
              90deg,
              #155eef,
              #60a5fa
            );
          border-radius: inherit;
        }

        .dashboard-panel-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-top: 21px;
          padding: 12px 14px;
          background: #f8fafc;
          border-radius: 9px;
          color: #64748b;

          /* เดิม 10px */
          font-size: 12px;
        }

        .dashboard-panel-footer strong {
          color: #002060;

          /* เดิม 11px */
          font-size: 13px;
        }

        /* =================================
           AMOUNT
        ================================= */

        .dashboard-amount-list {
          display: flex;
          flex-direction: column;
        }

        .dashboard-amount-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 10px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .dashboard-amount-type {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .dashboard-amount-type-icon {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563eb;
          background: #f1f6ff;
          border-radius: 9px;
        }

        .dashboard-amount-type > div:last-child {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .dashboard-amount-type strong {
          overflow: hidden;
          color: #334155;

          /* เดิม 10.5px */
          font-size: 13px;

          line-height: 1.4;
          text-overflow: ellipsis;
        }

        .dashboard-amount-type span {
          margin-top: 1px;
          color: #94a3b8;

          /* เดิม 9px */
          font-size: 11px;
        }

        .dashboard-amount-value {
          flex-shrink: 0;
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .dashboard-amount-value strong {
          color: #002060;

          /* เดิม 12px */
          font-size: 14px;
        }

        .dashboard-amount-value span {
          color: #64748b;

          /* เดิม 9px */
          font-size: 11px;
        }

        .dashboard-money-summary {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-top: 18px;
          padding: 14px;
          background:
            linear-gradient(
              135deg,
              #002060,
              #073b85
            );
          border-radius: 11px;
        }

        .dashboard-money-summary-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          background: rgba(255,255,255,.13);
          border-radius: 10px;
        }

        .dashboard-money-summary-copy {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .dashboard-money-summary-copy span {
          color: #dbeafe;

          /* เดิม 10px */
          font-size: 12px;

          font-weight: 600;
        }

        .dashboard-money-summary-copy small {
          margin-top: 2px;
          color: #93c5fd;

          /* เดิม 8px */
          font-size: 10px;
        }

        .dashboard-money-summary > strong {
          flex-shrink: 0;
          color: #ffffff;

          /* เดิม 17px */
          font-size: 20px;
        }

        .dashboard-money-summary > strong span {
          /* เดิม 9px */
          font-size: 11px;

          font-weight: 500;
          color: #bfdbfe;
        }

        /* =================================
           ERROR / LOADING
        ================================= */

        .dashboard-loading {
          min-height: 320px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          color: #64748b;
        }

        .dashboard-loading-icon {
          color: #155eef;
          animation:
            dashboard-spin
            .8s linear infinite;
        }

        .dashboard-loading > div {
          display: flex;
          flex-direction: column;
        }

        .dashboard-loading strong {
          color: #334155;

          /* เดิม 13px */
          font-size: 15px;
        }

        .dashboard-loading span {
          margin-top: 2px;

          /* เดิม 10px */
          font-size: 12px;
        }

        @keyframes dashboard-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .dashboard-error {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 15px;
          background: #fff4f4;
          border: 1px solid #ffd5d5;
          border-radius: 12px;
        }

        .dashboard-error-icon {
          width: 37px;
          height: 37px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dc2626;
          background: #fee2e2;
          border-radius: 10px;
        }

        .dashboard-error-content {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .dashboard-error-content strong {
          color: #b91c1c;

          /* เดิม 12px */
          font-size: 14px;
        }

        .dashboard-error-content span {
          margin-top: 2px;
          color: #dc2626;

          /* เดิม 10px */
          font-size: 12px;
        }

        .dashboard-error button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 11px;
          color: #ffffff;
          background: #dc2626;
          border: 0;
          border-radius: 8px;
          cursor: pointer;

          /* เดิม 10px */
          font-size: 12px;

          font-weight: 600;
        }

        .dashboard-empty {
          padding: 28px 12px;
          text-align: center;
          color: #94a3b8;
        }

        .dashboard-empty > div {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 8px;
          color: #64748b;
          background: #f8fafc;
          border-radius: 13px;
        }

        .dashboard-empty p {
          margin: 0;

          /* เดิม 10px */
          font-size: 13px;
        }

        /* =================================
           TABLET
        ================================= */

        @media (max-width: 1150px) {
          .dashboard-hero {
            align-items: flex-start;
            flex-direction: column;
          }

          .dashboard-hero-metrics {
            width: 100%;
            box-sizing: border-box;
            justify-content: space-around;
          }

          .dashboard-summary-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .dashboard-status-panel {
            align-items: stretch;
            flex-direction: column;
          }

          .dashboard-status-left {
            justify-content: space-between;
          }

          .dashboard-status-progress {
            max-width: none;
          }

          .dashboard-detail-grid {
            grid-template-columns: 1fr;
          }
        }

        /* =================================
           MOBILE
        ================================= */

        @media (max-width: 700px) {
          .dashboard-page {
            padding: 0 0 28px;
          }

          .dashboard-hero {
            gap: 20px;
            padding: 20px;
            border-radius: 14px;
          }

          .dashboard-hero-main {
            align-items: flex-start;
          }

          .dashboard-hero-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
          }

          .dashboard-eyebrow {
            /* เดิม 8px */
            font-size: 10px;
          }

          .dashboard-hero h1 {
            /* เดิม 21px */
            font-size: 25px;
          }

          .dashboard-hero p {
            /* เดิม 11px */
            font-size: 14px;
          }

          .dashboard-hero-metrics {
            align-items: stretch;
            flex-direction: column;
            gap: 12px;
            padding: 13px;
          }

          .dashboard-hero-divider {
            width: 100%;
            height: 1px;
          }

          .dashboard-hero-metric {
            width: 100%;
          }

          .dashboard-summary-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .dashboard-summary-card {
            align-items: flex-start;
            flex-direction: column;
            gap: 10px;
            padding: 14px;
          }

          .dashboard-summary-icon {
            width: 38px;
            height: 38px;
          }

          .dashboard-summary-title strong {
            font-size: 14px;
          }

          .dashboard-summary-title span {
            font-size: 11px;
          }

          .dashboard-summary-value strong {
            /* เดิม 22px */
            font-size: 27px;
          }

          .dashboard-summary-value span {
            font-size: 12px;
          }

          .dashboard-status-panel {
            padding: 17px;
          }

          .dashboard-status-left {
            align-items: stretch;
            flex-direction: column;
            gap: 17px;
          }

          .dashboard-status-heading h2 {
            font-size: 17px;
          }

          .dashboard-status-heading p {
            font-size: 12px;
          }

          .dashboard-status-progress-head {
            font-size: 12px;
          }

          .dashboard-status-caption {
            font-size: 11px;
          }

          .dashboard-status-right {
            width: 100%;
          }

          .dashboard-rate-card {
            min-width: 0;
            flex: 1;
          }

          .dashboard-rate-card > span {
            font-size: 11px;
          }

          .dashboard-rate-card strong {
            font-size: 21px;
          }

          .dashboard-panel {
            padding: 17px;
            border-radius: 13px;
          }

          .dashboard-panel-header h2 {
            font-size: 16px;
          }

          .dashboard-panel-header p {
            font-size: 12px;
          }

          .dashboard-chart-heading {
            align-items: flex-start;
          }

          .dashboard-type-name {
            /* เดิม 10px */
            font-size: 13px;
          }

          .dashboard-chart-count strong {
            font-size: 14px;
          }

          .dashboard-chart-count span {
            font-size: 11px;
          }

          .dashboard-amount-row {
            align-items: flex-start;
          }

          .dashboard-amount-type strong {
            font-size: 13px;
          }

          .dashboard-amount-type span {
            font-size: 11px;
          }

          .dashboard-amount-value strong {
            font-size: 14px;
          }

          .dashboard-amount-value span {
            font-size: 11px;
          }

          .dashboard-money-summary {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .dashboard-money-summary-copy span {
            font-size: 12px;
          }

          .dashboard-money-summary-copy small {
            font-size: 10px;
          }

          .dashboard-money-summary > strong {
            width: 100%;
            margin-left: 49px;
            font-size: 19px;
          }
        }

        /* =================================
           SMALL PHONE
        ================================= */

        @media (max-width: 430px) {
          .dashboard-summary-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-summary-card {
            align-items: center;
            flex-direction: row;
          }

          .dashboard-summary-value strong {
            /* เดิม 24px */
            font-size: 28px;
          }

          .dashboard-status-right {
            flex-direction: column;
          }

          .dashboard-chart-heading {
            gap: 8px;
          }

          .dashboard-amount-row {
            flex-direction: column;
            gap: 7px;
          }

          .dashboard-amount-value {
            margin-left: 41px;
          }
        }
      `}
    </style>
  );
}
