import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import psuLogo from "../assets/PSU-logo-EN.png";
import loginBG from "../assets/loginBG2.png";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function LoginPage() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const username = credentials.username.trim();
    const password = credentials.password;

    if (!username) {
      setError("กรุณากรอกชื่อผู้ใช้");
      return;
    }

    if (!password) {
      setError("กรุณากรอกรหัสผ่าน");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,
          password,
        }),
      });

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("ไม่สามารถอ่านข้อมูลตอบกลับจาก Server ได้");
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }

      const token = data.data?.token || data.token;
      const user = data.data?.user || data.user;

      if (!token) {
        throw new Error("Server ไม่ได้ส่ง Token กลับมา");
      }

      // ล้างข้อมูล session เดิมก่อน
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // บันทึก session ใหม่
      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      // Login สำเร็จไป Dashboard
      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("Login error:", err);

      setError(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `
          linear-gradient(
            90deg,
            rgba(248,250,252,0.97) 0%,
            rgba(248,250,252,0.93) 36%,
            rgba(248,250,252,0.50) 68%,
            rgba(248,250,252,0.20) 100%
          ),
          url(${loginBG})
        `,
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="login-header">
        <Link to="/" className="login-brand">
          <img src={psuLogo} alt="PSU Logo" />

          <div className="login-brand-copy">
            <strong>Scholarship Management</strong>

            <span>มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตหาดใหญ่</span>
          </div>
        </Link>

        <Link to="/" className="login-home-link">
          <ArrowLeft size={16} />
          กลับหน้าหลัก
        </Link>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="login-main">
        <div className="login-content">
          {/* =================================================
              LEFT INTRO
          ================================================= */}

          <section className="login-intro">
            <div className="login-intro-badge">
              <ShieldCheck size={16} />
              STAFF ACCESS
            </div>

            <h1>
              ระบบบริหารจัดการ
              <br />
              <span>ทุนการศึกษา</span>
            </h1>

            <p>
              สำหรับเจ้าหน้าที่ผู้ดูแลทุนการศึกษา ใช้สำหรับจัดการคำขอ ค้นหา
              แก้ไข พิจารณาสถานะ และตรวจสอบภาพรวมผ่าน Dashboard
            </p>

            <div className="login-intro-note">
              <ShieldCheck size={18} />

              <div>
                <strong>พื้นที่สำหรับเจ้าหน้าที่</strong>

                <span>กรุณาเข้าสู่ระบบด้วยบัญชีที่ได้รับอนุญาต</span>
              </div>
            </div>
          </section>

          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <section className="login-card">
            <div className="login-card-header">
              <div className="login-lock-icon">
                <LockKeyhole size={27} />
              </div>

              <h2>เข้าสู่ระบบเจ้าหน้าที่</h2>

              <p>กรอกชื่อผู้ใช้และรหัสผ่านเพื่อเข้าใช้งานระบบ</p>
            </div>

            {/* =============================================
                ERROR
            ============================================= */}

            {error && (
              <div className="login-error">
                <div className="login-error-icon">!</div>

                <span>{error}</span>
              </div>
            )}

            {/* =============================================
                FORM
            ============================================= */}

            <form onSubmit={handleLogin} className="login-form" noValidate>
              {/* Username */}

              <div className="login-field">
                <label htmlFor="username">ชื่อผู้ใช้</label>

                <div className="login-input-wrapper">
                  <UserRound size={18} className="login-input-icon" />

                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="กรอกชื่อผู้ใช้"
                    value={credentials.username}
                    disabled={loading}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Password */}

              <div className="login-field">
                <label htmlFor="password">รหัสผ่าน</label>

                <div className="login-input-wrapper">
                  <LockKeyhole size={18} className="login-input-icon" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="กรอกรหัสผ่าน"
                    value={credentials.password}
                    disabled={loading}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />

                  <button
                    type="button"
                    className="login-password-toggle"
                    disabled={loading}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                    title={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}

              <button type="submit" disabled={loading} className="login-submit">
                {loading ? (
                  <>
                    <span className="login-spinner" />
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    เข้าสู่ระบบ
                  </>
                )}
              </button>
            </form>

            {/* =============================================
                DIVIDER
            ============================================= */}

            <div className="login-divider">
              <span />

              <small>ระบบสำหรับเจ้าหน้าที่</small>

              <span />
            </div>

            {/* =============================================
                SECURITY
            ============================================= */}

            <div className="login-security-note">
              <ShieldCheck size={16} />

              <span>ระบบมีการยืนยันตัวตนก่อนเข้าถึงข้อมูลคำขอทุน</span>
            </div>

            <Link to="/" className="login-back-mobile">
              <ArrowLeft size={15} />
              กลับหน้าหลัก
            </Link>
          </section>
        </div>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="login-footer">
        <span>© 2026 Division of Student Development and Alumni</span>

        <span className="login-footer-divider">•</span>

        <span>Prince of Songkla University</span>
      </footer>

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>
        {`
          .login-page {
            width: 100%;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            color: #172033;
          }

          /* =================================
             HEADER
          ================================= */

          .login-header {
            width: 100%;
            min-height: 78px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 25px;
            padding: 13px clamp(24px, 5vw, 70px);
            box-sizing: border-box;
          }

          .login-brand {
            min-width: 0;
            display: flex;
            align-items: center;
            gap: 14px;
            text-decoration: none;
          }

          .login-brand img {
            height: 48px;
            width: auto;
            flex-shrink: 0;
            object-fit: contain;
          }

          .login-brand-copy {
            min-width: 0;
            display: flex;
            flex-direction: column;
            padding-left: 14px;
            border-left: 1px solid #d7e0eb;
          }

          .login-brand-copy strong {
            color: #002060;
            font-size: 15px;
          }

          .login-brand-copy span {
            margin-top: 3px;
            color: #64748b;
            font-size: 12px;
          }

          .login-home-link {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 10px 14px;
            color: #475569;
            background: rgba(255,255,255,.78);
            border: 1px solid #dbe3ec;
            border-radius: 9px;
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            backdrop-filter: blur(8px);
            transition: .2s ease;
          }

          .login-home-link:hover {
            color: #002060;
            background: #ffffff;
            border-color: #bccbdd;
          }

          /* =================================
             MAIN
          ================================= */

          .login-main {
            flex: 1;
            width: 100%;
            display: flex;
            align-items: center;
            padding: 35px clamp(28px, 7vw, 105px) 55px;
            box-sizing: border-box;
          }

          .login-content {
            width: min(1180px, 100%);
            display: grid;
            grid-template-columns:
              minmax(0, 1fr)
              minmax(360px, 430px);
            align-items: center;
            gap: clamp(50px, 9vw, 130px);
            margin: 0 auto;
          }

          /* =================================
             INTRO
          ================================= */

          .login-intro {
            max-width: 580px;
          }

          .login-intro-badge {
            width: fit-content;
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 7px 11px;
            margin-bottom: 14px;
            color: #155eef;
            background: rgba(239,244,255,.9);
            border: 1px solid #dbe7ff;
            border-radius: 999px;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: .12em;
          }

          .login-intro h1 {
            margin: 0;
            color: #002060;
            font-size: clamp(38px, 5vw, 57px);
            line-height: 1.15;
            letter-spacing: -.025em;
          }

          .login-intro h1 span {
            color: #155eef;
          }

          .login-intro > p {
            max-width: 520px;
            margin: 17px 0 0;
            color: #64748b;
            font-size: 15px;
            line-height: 1.85;
          }

          .login-intro-note {
            width: fit-content;
            max-width: 440px;
            display: flex;
            align-items: center;
            gap: 11px;
            margin-top: 24px;
            padding: 13px 16px;
            color: #334155;
            background: rgba(255,255,255,.78);
            border: 1px solid #dbe5ef;
            border-radius: 11px;
            backdrop-filter: blur(8px);
          }

          .login-intro-note > svg {
            flex-shrink: 0;
            color: #059669;
          }

          .login-intro-note > div {
            display: flex;
            flex-direction: column;
          }

          .login-intro-note strong {
            font-size: 13px;
          }

          .login-intro-note span {
            margin-top: 3px;
            color: #64748b;
            font-size: 11px;
          }

          /* =================================
             CARD
          ================================= */

          .login-card {
            width: 100%;
            padding: 36px;
            box-sizing: border-box;
            background: rgba(255,255,255,.97);
            border: 1px solid rgba(219,229,240,.95);
            border-radius: 19px;
            box-shadow:
              0 20px 55px rgba(15,23,42,.12);
            backdrop-filter: blur(14px);
          }

          .login-card-header {
            text-align: center;
            margin-bottom: 26px;
          }

          .login-lock-icon {
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 14px;
            color: #155eef;
            background: #eff4ff;
            border: 1px solid #dbe7ff;
            border-radius: 15px;
          }

          .login-card-header h2 {
            margin: 0;
            color: #002060;
            font-size: 23px;
          }

          .login-card-header p {
            margin: 7px 0 0;
            color: #94a3b8;
            font-size: 13px;
            line-height: 1.6;
          }

          /* =================================
             ERROR
          ================================= */

          .login-error {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 18px;
            padding: 11px 13px;
            color: #dc2626;
            background: #fff3f3;
            border: 1px solid #ffd3d3;
            border-radius: 9px;
            font-size: 13px;
          }

          .login-error-icon {
            width: 24px;
            height: 24px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            background: #ef4444;
            border-radius: 50%;
            font-size: 12px;
            font-weight: 800;
          }

          /* =================================
             FORM
          ================================= */

          .login-form {
            display: flex;
            flex-direction: column;
            gap: 18px;
          }

          .login-field label {
            display: block;
            margin-bottom: 7px;
            color: #334155;
            font-size: 13px;
            font-weight: 700;
          }

          .login-input-wrapper {
            position: relative;
          }

          .login-input-icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            pointer-events: none;
          }

          .login-input-wrapper input {
            width: 100%;
            height: 48px;
            padding: 0 46px 0 43px;
            box-sizing: border-box;
            color: #1e293b;
            background: #f8fafc;
            border: 1px solid #cfd9e5;
            border-radius: 9px;
            outline: none;
            font-family: inherit;
            font-size: 14px;
            transition:
              border-color .2s,
              box-shadow .2s,
              background .2s;
          }

          .login-input-wrapper input::placeholder {
            color: #a8b4c4;
          }

          .login-input-wrapper input:focus {
            background: #ffffff;
            border-color: #4f83e7;
            box-shadow:
              0 0 0 3px rgba(37,99,235,.09);
          }

          .login-input-wrapper input:disabled {
            cursor: not-allowed;
            opacity: .7;
          }

          .login-password-toggle {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            color: #64748b;
            background: transparent;
            border: 0;
            cursor: pointer;
          }

          .login-password-toggle:disabled {
            cursor: not-allowed;
            opacity: .5;
          }

          .login-submit {
            min-height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 4px;
            color: #ffffff;
            background:
              linear-gradient(
                135deg,
                #002060,
                #0a4295
              );
            border: 0;
            border-radius: 9px;
            box-shadow:
              0 7px 16px rgba(0,32,96,.18);
            font-family: inherit;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition:
              transform .2s,
              box-shadow .2s;
          }

          .login-submit:not(:disabled):hover {
            transform: translateY(-1px);
            box-shadow:
              0 10px 20px rgba(0,32,96,.22);
          }

          .login-submit:disabled {
            opacity: .65;
            cursor: not-allowed;
          }

          .login-spinner {
            width: 15px;
            height: 15px;
            border: 2px solid rgba(255,255,255,.4);
            border-top-color: #ffffff;
            border-radius: 50%;
            animation:
              loginSpin .7s
              linear infinite;
          }

          @keyframes loginSpin {
            to {
              transform: rotate(360deg);
            }
          }

          /* =================================
             DIVIDER
          ================================= */

          .login-divider {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 21px 0 15px;
          }

          .login-divider span {
            flex: 1;
            height: 1px;
            background: #e2e8f0;
          }

          .login-divider small {
            flex-shrink: 0;
            color: #a1adbd;
            font-size: 10px;
          }

          .login-security-note {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            color: #94a3b8;
            font-size: 11px;
            text-align: center;
          }

          .login-security-note svg {
            flex-shrink: 0;
            color: #059669;
          }

          .login-back-mobile {
            display: none;
          }

          /* =================================
             FOOTER
          ================================= */

          .login-footer {
            width: 100%;
            min-height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            padding: 12px 20px;
            box-sizing: border-box;
            color: #9cb0cf;
            background: #002060;
            font-size: 11px;
          }

          .login-footer-divider {
            opacity: .5;
          }

          /* =================================
             TABLET
          ================================= */

          @media (max-width: 960px) {
            .login-content {
              grid-template-columns: 1fr;
              gap: 32px;
            }

            .login-intro {
              max-width: 650px;
              text-align: center;
              margin: 0 auto;
            }

            .login-intro-badge,
            .login-intro-note {
              margin-left: auto;
              margin-right: auto;
            }

            .login-intro > p {
              margin-left: auto;
              margin-right: auto;
            }

            .login-card {
              max-width: 460px;
              margin: 0 auto;
            }
          }

          /* =================================
             MOBILE
          ================================= */

          @media (max-width: 650px) {
            .login-page {
              background-position: 68% center;
            }

            .login-header {
              min-height: 65px;
              padding: 11px 18px;
            }

            .login-brand img {
              height: 42px;
            }

            .login-brand-copy {
              display: none;
            }

            .login-home-link {
              padding: 9px 11px;
              font-size: 12px;
            }

            .login-main {
              align-items: flex-start;
              padding: 28px 18px 40px;
            }

            .login-intro {
              display: none;
            }

            .login-card {
              max-width: none;
              padding: 28px 22px;
              border-radius: 16px;
            }

            .login-lock-icon {
              width: 50px;
              height: 50px;
            }

            .login-card-header h2 {
              font-size: 21px;
            }

            .login-card-header p {
              font-size: 12px;
            }

            .login-field label {
              font-size: 13px;
            }

            .login-input-wrapper input {
              height: 49px;
              font-size: 14px;
            }

            .login-submit {
              min-height: 49px;
              font-size: 14px;
            }

            .login-security-note {
              font-size: 10px;
            }

            .login-back-mobile {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              width: 100%;
              margin-top: 19px;
              color: #64748b;
              text-decoration: none;
              font-size: 12px;
              font-weight: 600;
            }

            .login-footer {
              flex-direction: column;
              gap: 2px;
              text-align: center;
              font-size: 9px;
            }

            .login-footer-divider {
              display: none;
            }
          }

          @media (max-width: 380px) {
            .login-header {
              padding: 10px 14px;
            }

            .login-brand img {
              height: 37px;
            }

            .login-home-link {
              padding: 8px 9px;
            }

            .login-main {
              padding-left: 13px;
              padding-right: 13px;
            }

            .login-card {
              padding: 24px 17px;
            }

            .login-card-header h2 {
              font-size: 20px;
            }
          }
        `}
      </style>
    </div>
  );
}
