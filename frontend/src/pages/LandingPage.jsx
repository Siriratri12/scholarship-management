import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  BriefcaseBusiness,
  CheckCircle2,
  CircleHelp,
  FileCheck2,
  FileText,
  GraduationCap,
  HeartHandshake,
  LogIn,
  Search,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";

import landingBG from "../assets/landingBG.png";
import psuLogo from "../assets/PSU-logo-EN.png";
import "../App.css";

export default function LandingPage() {
  const scholarshipTypes = [
    {
      title: "ทุนขาดแคลนทุนทรัพย์",
      desc: "สำหรับนักศึกษาที่ขาดแคลนทุนทรัพย์และต้องการความช่วยเหลือด้านค่าใช้จ่ายทางการศึกษา",
      icon: HeartHandshake,
    },
    {
      title: "ทุนส่งเสริมการศึกษา (เรียนดี)",
      desc: "สำหรับนักศึกษาที่มีผลการเรียนดี มีความประพฤติดี และมีความตั้งใจในการศึกษา",
      icon: GraduationCap,
    },
    {
      title: "ทุนทำงานพิเศษ (นักศึกษาช่วยงาน)",
      desc: "สำหรับนักศึกษาที่ต้องการทำงานพิเศษภายในมหาวิทยาลัยเพื่อช่วยแบ่งเบาค่าใช้จ่าย",
      icon: BriefcaseBusiness,
    },
    {
      title: "ทุนฉุกเฉิน/ช่วยเหลือกรณีพิเศษ",
      desc: "สำหรับนักศึกษาที่ประสบเหตุฉุกเฉินหรือมีความจำเป็นเร่งด่วนที่ต้องได้รับการช่วยเหลือ",
      icon: ShieldCheck,
    },
    {
      title: "ทุนกิจกรรมนักศึกษา",
      desc: "สำหรับนักศึกษาที่เข้าร่วมกิจกรรมสร้างสรรค์และกิจกรรมที่เป็นประโยชน์ต่อมหาวิทยาลัย",
      icon: Sparkles,
    },
  ];

  const steps = [
    {
      step: "01",
      title: "กรอกข้อมูลคำขอ",
      desc: "กรอกข้อมูลส่วนตัว ข้อมูลการศึกษา และรายละเอียดการขอทุนให้ครบถ้วน",
      icon: FileText,
    },
    {
      step: "02",
      title: "ยืนยัน PDPA",
      desc: "อ่านรายละเอียดและให้ความยินยอมในการเก็บและใช้ข้อมูลส่วนบุคคล",
      icon: ShieldCheck,
    },
    {
      step: "03",
      title: "ส่งคำขอ",
      desc: "ตรวจสอบข้อมูลอีกครั้ง และยืนยันการส่งคำขอทุนเข้าสู่ระบบ",
      icon: FileCheck2,
    },
    {
      step: "04",
      title: "เจ้าหน้าที่พิจารณา",
      desc: "เจ้าหน้าที่ตรวจสอบคำขอ พร้อมอนุมัติหรือไม่อนุมัติและบันทึกหมายเหตุ",
      icon: UserRoundCheck,
    },
  ];

  return (
    <div className="landing-page">
      {/* ================= NAVBAR ================= */}

      <header className="landing-navbar">
        <Link to="/" className="landing-brand">
          <img src={psuLogo} alt="PSU Logo" />

          <div className="landing-brand-copy">
            <strong>Scholarship Management</strong>
            <span>มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตหาดใหญ่</span>
          </div>
        </Link>

        <nav className="landing-nav">
          <Link to="/" className="landing-nav-link active">
            หน้าหลัก
          </Link>

          <Link to="/apply" className="landing-nav-link">
            ยื่นคำขอทุน
          </Link>

          <Link to="/check-status" className="landing-nav-link">
            ตรวจสอบสถานะ
          </Link>

          <Link to="/login" className="landing-staff-button">
            <LogIn size={16} />
            <span>สำหรับเจ้าหน้าที่</span>
          </Link>
        </nav>
      </header>

      {/* ================= HERO ================= */}

      <section
        className="landing-hero"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(248,250,252,0.98) 0%,
              rgba(248,250,252,0.93) 38%,
              rgba(248,250,252,0.45) 72%,
              rgba(248,250,252,0.12) 100%
            ),
            url(${landingBG})
          `,
        }}
      >
        <div className="landing-hero-inner">
          <div className="landing-hero-content">
            <div className="landing-eyebrow">
              <BadgeCheck size={15} />
              SCHOLARSHIP REQUEST MANAGEMENT
            </div>

            <h1>
              ระบบบริหารจัดการ
              <br />
              <span>ทุนการศึกษา</span>
            </h1>

            <p className="landing-hero-org">
              กองพัฒนานักศึกษาและศิษย์เก่าสัมพันธ์
              <br />
              มหาวิทยาลัยสงขลานครินทร์
            </p>

            <p className="landing-hero-description">
              ยื่นคำขอทุนการศึกษาออนไลน์ได้อย่างสะดวก
              ตรวจสอบสถานะคำขอได้ตลอดเวลา
              และช่วยให้เจ้าหน้าที่สามารถบริหารจัดการคำขอทุนได้อย่างเป็นระบบ
            </p>

            <div className="landing-actions">
              <Link to="/apply" className="landing-primary-button">
                <FileText size={17} />
                ยื่นคำขอทุน
                <ArrowRight size={16} />
              </Link>

              <Link to="/check-status" className="landing-outline-button">
                <Search size={17} />
                ตรวจสอบสถานะ
              </Link>
            </div>

            <div className="landing-hero-note">
              <ShieldCheck size={16} />

              <span>
                มีการให้ความยินยอม PDPA และปกป้องข้อมูลส่วนบุคคลของนักศึกษา
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUICK INFO ================= */}

      <section className="landing-quick-wrapper">
        <div className="landing-quick-grid">
          <QuickInfo
            icon={FileText}
            value="ออนไลน์"
            label="ยื่นคำขอได้ทุกที่"
          />

          <QuickInfo icon={Search} value="ติดตามได้" label="ตรวจสอบสถานะคำขอ" />

          <QuickInfo
            icon={ShieldCheck}
            value="PDPA"
            label="คำนึงถึงข้อมูลส่วนบุคคล"
          />

          <QuickInfo
            icon={CheckCircle2}
            value="เป็นระบบ"
            label="ติดตามการพิจารณาได้ชัดเจน"
          />
        </div>
      </section>

      {/* ================= SCHOLARSHIP TYPES ================= */}

      <section className="landing-section landing-types-section">
        <div className="landing-section-heading">
          <span>ประเภททุนการศึกษา</span>

          <h2>ทุนการศึกษาที่เปิดให้ยื่นคำขอ</h2>

          <p>
            นักศึกษาสามารถเลือกประเภททุนที่ตรงกับความต้องการ
            และยื่นคำขอผ่านระบบได้โดยไม่ต้องเข้าสู่ระบบ
          </p>
        </div>

        <div className="landing-scholarship-grid">
          {scholarshipTypes.map((item, index) => {
            const Icon = item.icon;

            return (
              <article className="landing-scholarship-card" key={index}>
                <div className="landing-scholarship-icon">
                  <Icon size={22} />
                </div>

                <div>
                  <h3>{item.title}</h3>

                  <p>{item.desc}</p>
                </div>

                <div className="landing-card-number">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </article>
            );
          })}
        </div>

        <div className="landing-section-cta">
          <Link to="/apply">
            ดูแบบฟอร์มยื่นคำขอ
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ================= STEPS ================= */}

      <section className="landing-section landing-steps-section">
        <div className="landing-section-heading">
          <span>HOW IT WORKS</span>

          <h2>ขั้นตอนการยื่นคำขอทุน</h2>

          <p>
            ระบบออกแบบขั้นตอนให้เข้าใจง่าย
            ตั้งแต่กรอกข้อมูลจนถึงการพิจารณาของเจ้าหน้าที่
          </p>
        </div>

        <div className="landing-steps-grid">
          {steps.map((item, index) => {
            const Icon = item.icon;

            return (
              <article className="landing-step-card" key={index}>
                <div className="landing-step-top">
                  <div className="landing-step-icon">
                    <Icon size={21} />
                  </div>

                  <span>{item.step}</span>
                </div>

                <h3>{item.title}</h3>

                <p>{item.desc}</p>

                {index < steps.length - 1 && (
                  <div className="landing-step-line" />
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* ================= STATUS CTA ================= */}

      <section className="landing-status-section">
        <div className="landing-status-card">
          <div className="landing-status-icon">
            <Search size={27} />
          </div>

          <div className="landing-status-copy">
            <span>ส่งคำขอไปแล้ว?</span>

            <h2>ตรวจสอบสถานะคำขอทุนได้ด้วยตนเอง</h2>

            <p>
              นักศึกษาสามารถกรอกรหัสนักศึกษา
              เพื่อตรวจสอบว่าคำขออยู่ในสถานะรอพิจารณา อนุมัติ หรือไม่อนุมัติ
            </p>
          </div>

          <Link to="/check-status" className="landing-status-button">
            ตรวจสอบสถานะ
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="landing-footer">
        <div className="landing-footer-bottom">
          © 2026 Prince of Songkla University. All Rights Reserved.
        </div>
      </footer>

      <LandingStyles />
    </div>
  );
}

function QuickInfo({ icon: Icon, value, label }) {
  return (
    <div className="landing-quick-item">
      <div className="landing-quick-icon">
        <Icon size={19} />
      </div>

      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function LandingStyles() {
  return (
    <style>
      {`
        .landing-page {
          width: 100%;
          min-height: 100vh;
          margin: 0;
          background: #f8fafc;
          color: #172033;
        }

        /* ===============================
           NAVBAR
        =============================== */

        .landing-navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          min-height: 74px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          padding: 12px clamp(22px, 5vw, 72px);
          box-sizing: border-box;
          background: rgba(255,255,255,.96);
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 2px 12px rgba(15,23,42,.025);
          backdrop-filter: blur(12px);
        }

        .landing-brand {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 14px;
          color: inherit;
          text-decoration: none;
        }

        .landing-brand img {
          width: auto;
          height: 48px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .landing-brand-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          padding-left: 14px;
          border-left: 1px solid #dbe3ec;
        }

        .landing-brand-copy strong {
          color: #002060;
          font-size: 15px;
        }

        .landing-brand-copy span {
          margin-top: 2px;
          color: #94a3b8;
          font-size: 12px;
          white-space: nowrap;
        }

        .landing-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .landing-nav-link {
          padding: 9px 11px;
          color: #64748b;
          border-radius: 7px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: .2s ease;
        }

        .landing-nav-link:hover {
          color: #002060;
          background: #f1f5f9;
        }

        .landing-nav-link.active {
          color: #002060;
        }

        .landing-staff-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-left: 4px;
          padding: 10px 16px;
          color: #ffffff;
          background: #002060;
          border-radius: 8px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          box-shadow: 0 5px 14px rgba(0,32,96,.14);
        }

        /* ===============================
           HERO
        =============================== */

        .landing-hero {
          width: 100%;
          min-height: 570px;
          display: flex;
          align-items: center;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .landing-hero-inner {
          width: min(1400px, 100%);
          margin: 0 auto;
          padding: 65px clamp(28px, 7vw, 110px);
          box-sizing: border-box;
        }

        .landing-hero-content {
          max-width: 650px;
        }

        .landing-eyebrow {
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 16px;
          padding: 7px 11px;
          color: #155eef;
          background: rgba(239,244,255,.92);
          border: 1px solid #dbe7ff;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .1em;
        }

        .landing-hero h1 {
          margin: 0;
          color: #002060;
          font-size: clamp(42px, 5vw, 62px);
          line-height: 1.12;
          letter-spacing: -.02em;
        }

        .landing-hero h1 span {
          color: #155eef;
        }

        .landing-hero-org {
          margin: 20px 0 0;
          color: #334155;
          font-size: 19px;
          font-weight: 700;
          line-height: 1.6;
        }

        .landing-hero-description {
          max-width: 570px;
          margin: 13px 0 0;
          color: #64748b;
          font-size: 16px;
          line-height: 1.8;
        }

        .landing-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 28px;
        }

        .landing-primary-button,
        .landing-outline-button {
          min-height: 45px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 19px;
          border-radius: 9px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
          transition: .2s ease;
        }

        .landing-primary-button {
          color: #ffffff;
          background: #002060;
          box-shadow: 0 8px 18px rgba(0,32,96,.17);
        }

        .landing-primary-button:hover {
          transform: translateY(-2px);
          background: #003184;
        }

        .landing-outline-button {
          color: #002060;
          background: rgba(255,255,255,.9);
          border: 1px solid #b8c9df;
        }

        .landing-outline-button:hover {
          background: #ffffff;
          border-color: #002060;
        }

        .landing-hero-note {
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 20px;
          color: #64748b;
          font-size: 12px;
        }

        .landing-hero-note svg {
          color: #059669;
        }

        /* ===============================
           QUICK INFO
        =============================== */

        .landing-quick-wrapper {
          position: relative;
          z-index: 2;
          width: min(1180px, calc(100% - 48px));
          margin: -37px auto 0;
        }

        .landing-quick-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 12px 35px rgba(15,23,42,.08);
          overflow: hidden;
        }

        .landing-quick-item {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 19px 20px;
          border-right: 1px solid #eef2f7;
        }

        .landing-quick-item:last-child {
          border-right: none;
        }

        .landing-quick-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #155eef;
          background: #eff4ff;
          border-radius: 10px;
        }

        .landing-quick-item > div:last-child {
          display: flex;
          flex-direction: column;
        }

        .landing-quick-item strong {
          color: #002060;
          font-size: 14px;
        }

        .landing-quick-item span {
          margin-top: 2px;
          color: #94a3b8;
          font-size: 11px;
        }

        /* ===============================
           SECTION
        =============================== */

        .landing-section {
          width: 100%;
          padding: 85px clamp(24px, 5vw, 75px);
          box-sizing: border-box;
        }

        .landing-types-section {
          background: #ffffff;
        }

        .landing-section-heading {
          max-width: 650px;
          margin: 0 auto 38px;
          text-align: center;
        }

        .landing-section-heading > span {
          color: #2563eb;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .13em;
        }

        .landing-section-heading h2 {
          margin: 8px 0 0;
          color: #002060;
          font-size: clamp(28px, 3vw, 34px);
        }

        .landing-section-heading p {
          margin: 10px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.7;
        }

        /* ===============================
           SCHOLARSHIP CARDS
        =============================== */

        .landing-scholarship-grid {
          width: min(1350px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(5, minmax(0,1fr));
          gap: 15px;
        }

        .landing-scholarship-card {
          position: relative;
          min-width: 0;
          min-height: 195px;
          overflow: hidden;
          padding: 21px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 5px 18px rgba(15,23,42,.035);
          transition: .2s ease;
        }

        .landing-scholarship-card:hover {
          transform: translateY(-4px);
          border-color: #c9d9ef;
          box-shadow: 0 12px 28px rgba(15,23,42,.08);
        }

        .landing-scholarship-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 17px;
          color: #155eef;
          background: #eff4ff;
          border: 1px solid #dce8ff;
          border-radius: 11px;
        }

        .landing-scholarship-card h3 {
          position: relative;
          z-index: 1;
          margin: 0;
          color: #002060;
          font-size: 15px;
          line-height: 1.55;
        }

        .landing-scholarship-card p {
          position: relative;
          z-index: 1;
          margin: 8px 0 0;
          color: #64748b;
          font-size: 12.5px;
          line-height: 1.65;
        }

        .landing-card-number {
          position: absolute;
          right: 13px;
          bottom: -8px;
          color: #f1f5f9;
          font-size: 46px;
          font-weight: 800;
          pointer-events: none;
        }

        .landing-section-cta {
          margin-top: 27px;
          text-align: center;
        }

        .landing-section-cta a {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #155eef;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }

        /* ===============================
           STEPS
        =============================== */

        .landing-steps-section {
          background: #f5f8fc;
        }

        .landing-steps-grid {
          width: min(1180px,100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .landing-step-card {
          position: relative;
          padding: 23px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
        }

        .landing-step-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .landing-step-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          background: #002060;
          border-radius: 11px;
        }

        .landing-step-top > span {
          color: #dbe3ec;
          font-size: 28px;
          font-weight: 800;
        }

        .landing-step-card h3 {
          margin: 0;
          color: #002060;
          font-size: 16px;
        }

        .landing-step-card p {
          margin: 8px 0 0;
          color: #64748b;
          font-size: 12.5px;
          line-height: 1.7;
        }

        .landing-step-line {
          position: absolute;
          width: 15px;
          height: 2px;
          top: 43px;
          right: -16px;
          background: #bfdbfe;
        }

        /* ===============================
           STATUS CTA
        =============================== */

        .landing-status-section {
          padding: 65px clamp(24px,5vw,75px);
          background: #ffffff;
        }

        .landing-status-card {
          width: min(1100px,100%);
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 27px 30px;
          box-sizing: border-box;
          background:
            linear-gradient(135deg,#eff6ff,#f8fbff);
          border: 1px solid #d7e5ff;
          border-radius: 17px;
        }

        .landing-status-icon {
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #155eef;
          background: #ffffff;
          border-radius: 14px;
          box-shadow: 0 5px 14px rgba(37,99,235,.07);
        }

        .landing-status-copy {
          min-width: 0;
          flex: 1;
        }

        .landing-status-copy > span {
          color: #2563eb;
          font-size: 11px;
          font-weight: 800;
        }

        .landing-status-copy h2 {
          margin: 4px 0 0;
          color: #002060;
          font-size: 23px;
        }

        .landing-status-copy p {
          max-width: 650px;
          margin: 7px 0 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.6;
        }

        .landing-status-button {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 11px 17px;
          color: #ffffff;
          background: #155eef;
          border-radius: 8px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }

        /* ===============================
           STAFF
        =============================== */

        .landing-staff-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          padding: 50px clamp(30px,8vw,120px);
          background: #002060;
        }

        .landing-staff-section > div {
          max-width: 700px;
        }

        .landing-staff-small {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #93c5fd;
          font-size: 11px;
          font-weight: 700;
        }

        .landing-staff-section h2 {
          margin: 8px 0 0;
          color: #ffffff;
          font-size: 26px;
        }

        .landing-staff-section p {
          margin: 8px 0 0;
          color: #bfdbfe;
          font-size: 13px;
          line-height: 1.7;
        }

        .landing-staff-login-button {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 12px 18px;
          color: #002060;
          background: #ffffff;
          border-radius: 8px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }

        /* ===============================
           FOOTER
        =============================== */

        .landing-footer {
          background: #001744;
          color: #ffffff;
        }

        .landing-footer-inner {
          width: min(1300px,100%);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          padding: 32px clamp(25px,5vw,65px);
          box-sizing: border-box;
        }

        .landing-footer-brand {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .landing-footer-brand img {
          height: 42px;
          width: auto;
          filter: brightness(0) invert(1);
          opacity: .92;
        }

        .landing-footer-brand > div {
          display: flex;
          flex-direction: column;
        }

        .landing-footer-brand strong {
          font-size: 13px;
        }

        .landing-footer-brand span {
          max-width: 500px;
          margin-top: 3px;
          color: #93a9cb;
          font-size: 11px;
          line-height: 1.6;
        }

        .landing-footer-links {
          display: flex;
          gap: 18px;
        }

        .landing-footer-links a {
          color: #bfcae0;
          text-decoration: none;
          font-size: 11px;
        }

        .landing-footer-links a:hover {
          color: #ffffff;
        }

        .landing-footer-bottom {
          padding: 14px 20px;
          text-align: center;
          color: #7890b6;
          border-top: 1px solid rgba(255,255,255,.07);
          font-size: 11px;
        }

        /* ===============================
           TABLET
        =============================== */

        @media (max-width: 1100px) {
          .landing-brand-copy {
            display: none;
          }

          .landing-scholarship-grid {
            grid-template-columns:
              repeat(3, minmax(0,1fr));
          }

          .landing-quick-grid {
            grid-template-columns: 1fr 1fr;
          }

          .landing-quick-item:nth-child(2) {
            border-right: none;
          }

          .landing-quick-item:nth-child(-n+2) {
            border-bottom: 1px solid #eef2f7;
          }

          .landing-steps-grid {
            grid-template-columns: 1fr 1fr;
          }

          .landing-step-line {
            display: none;
          }
        }

        /* ===============================
           MOBILE
        =============================== */

        @media (max-width: 760px) {
          .landing-navbar {
            position: relative;
            min-height: auto;
            align-items: flex-start;
            flex-direction: column;
            gap: 13px;
            padding: 13px 18px;
          }

          .landing-brand img {
            height: 42px;
          }

          .landing-nav {
            width: 100%;
            overflow-x: auto;
            gap: 2px;
            padding-bottom: 2px;
          }

          .landing-nav-link {
            flex-shrink: 0;
            padding: 8px 9px;
            font-size: 13px;
          }

          .landing-staff-button {
            flex-shrink: 0;
            padding: 9px 11px;
          }

          .landing-staff-button span {
            font-size: 12px;
          }

          .landing-hero {
            min-height: auto;
            background-position: 65% center;
          }

          .landing-hero-inner {
            padding: 55px 23px 75px;
          }

          .landing-hero-content {
            max-width: 100%;
          }

          .landing-eyebrow {
            font-size: 9px;
          }

          .landing-hero h1 {
            font-size: 39px;
          }

          .landing-hero-org {
            font-size: 16px;
          }

          .landing-hero-description {
            max-width: 90%;
            font-size: 14px;
          }

          .landing-hero-note {
            font-size: 11px;
          }

          .landing-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .landing-primary-button,
          .landing-outline-button {
            width: 100%;
            box-sizing: border-box;
            font-size: 14px;
          }

          .landing-quick-wrapper {
            width: calc(100% - 32px);
            margin-top: -34px;
          }

          .landing-quick-grid {
            grid-template-columns: 1fr 1fr;
          }

          .landing-quick-item {
            padding: 15px;
          }

          .landing-quick-icon {
            width: 34px;
            height: 34px;
          }

          .landing-quick-item strong {
            font-size: 13px;
          }

          .landing-quick-item span {
            font-size: 11px;
          }

          .landing-section {
            padding: 65px 20px;
          }

          .landing-section-heading > span {
            font-size: 10px;
          }

          .landing-section-heading h2 {
            font-size: 27px;
          }

          .landing-section-heading p {
            font-size: 14px;
          }

          .landing-scholarship-grid {
            grid-template-columns: 1fr;
          }

          .landing-scholarship-card {
            min-height: auto;
          }

          .landing-scholarship-card h3 {
            font-size: 16px;
          }

          .landing-scholarship-card p {
            font-size: 13px;
          }

          .landing-section-cta a {
            font-size: 13px;
          }

          .landing-steps-grid {
            grid-template-columns: 1fr;
          }

          .landing-step-card h3 {
            font-size: 16px;
          }

          .landing-step-card p {
            font-size: 13px;
          }

          .landing-status-card {
            align-items: flex-start;
            flex-direction: column;
            padding: 23px;
          }

          .landing-status-copy > span {
            font-size: 11px;
          }

          .landing-status-copy h2 {
            font-size: 22px;
          }

          .landing-status-copy p {
            font-size: 13px;
          }

          .landing-status-button {
            width: 100%;
            box-sizing: border-box;
            justify-content: center;
            font-size: 13px;
          }

          .landing-staff-section {
            align-items: flex-start;
            flex-direction: column;
            padding: 40px 23px;
          }

          .landing-staff-login-button {
            width: 100%;
            box-sizing: border-box;
            justify-content: center;
          }

          .landing-footer-inner {
            align-items: flex-start;
            flex-direction: column;
          }

          .landing-footer-links {
            flex-wrap: wrap;
          }
        }

        /* ===============================
           SMALL PHONE
        =============================== */

        @media (max-width: 430px) {
          .landing-hero h1 {
            font-size: 34px;
          }

          .landing-quick-grid {
            grid-template-columns: 1fr;
          }

          .landing-quick-item {
            border-right: none;
            border-bottom: 1px solid #eef2f7;
          }

          .landing-quick-item:last-child {
            border-bottom: none;
          }

          .landing-status-copy h2 {
            font-size: 21px;
          }

          .landing-staff-section h2 {
            font-size: 22px;
          }
        }
      `}
    </style>
  );
}
