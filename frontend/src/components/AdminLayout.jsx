import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  FileBarChart,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

import "../App.css";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = useMemo(() => {
    try {
      const rawUser = localStorage.getItem("user");
      return rawUser ? JSON.parse(rawUser) : null;
    } catch (error) {
      console.error("Cannot parse user:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        replace: true,
      });
    }
  }, [navigate]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    const confirmed = window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?");

    if (!confirmed) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", {
      replace: true,
    });
  };

  const isActive = (path) => {
    if (path === "/scholarships") {
      return location.pathname.startsWith("/scholarships");
    }

    return location.pathname === path;
  };

  const displayName = user?.fullName || user?.username || "Admin Staff";

  const displayRole =
    user?.role === "ADMIN"
      ? "ผู้ดูแลระบบ"
      : user?.role === "STAFF"
        ? "เจ้าหน้าที่ทุนการศึกษา"
        : "เจ้าหน้าที่";

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      description: "ภาพรวมระบบทุนการศึกษา",
      icon: LayoutDashboard,
    },
    {
      path: "/scholarships",
      label: "คำขอทุน",
      description: "จัดการรายการคำขอทุน",
      icon: FileText,
    },
    {
      path: "/reports",
      label: "รายงาน",
      description: "รายงานและวิเคราะห์ข้อมูล",
      icon: FileBarChart,
    },
  ];

  const menuContent = (
    <>
      <div className="admin-brand">
        <div className="admin-brand-icon">
          <WalletCards size={23} />
        </div>

        <div>
          <strong>Scholarship</strong>
          <span>Management System</span>
        </div>
      </div>

      <div className="admin-menu-label">เมนูหลัก</div>

      <nav className="admin-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-menu-item ${
                isActive(item.path) ? "active" : ""
              }`}
            >
              <div className="admin-menu-icon">
                <Icon size={20} />
              </div>

              <div>
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        {menuContent}

        <div className="admin-user-section">
          <div className="admin-user-card">
            <div className="admin-avatar">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{displayName}</strong>
              <span>{displayRole}</span>
            </div>
          </div>

          <button type="button" className="admin-logout" onClick={handleLogout}>
            <LogOut size={18} />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-mobile-menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>

            <div>
              <span className="admin-topbar-eyebrow">
                SCHOLARSHIP MANAGEMENT
              </span>

              <h1>{getPageTitle(location.pathname)}</h1>
            </div>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-secure">
              <ShieldCheck size={16} />
              Secure Access
            </div>

            <div className="admin-top-user">
              <div>
                <strong>{displayName}</strong>
                <span>{displayRole}</span>
              </div>

              <div className="admin-top-avatar">
                <UserRound size={19} />
              </div>
            </div>
          </div>
        </header>

        <section className="admin-content">
          <Outlet />
        </section>
      </main>

      {mobileMenuOpen && (
        <div
          className="admin-mobile-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setMobileMenuOpen(false);
            }
          }}
        >
          <aside className="admin-mobile-drawer">
            <div className="admin-mobile-drawer-top">
              <span>เมนูระบบ</span>

              <button type="button" onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {menuContent}

            <div className="admin-user-section">
              <div className="admin-user-card">
                <div className="admin-avatar">
                  {displayName.charAt(0).toUpperCase()}
                </div>

                <div>
                  <strong>{displayName}</strong>
                  <span>{displayRole}</span>
                </div>
              </div>

              <button
                type="button"
                className="admin-logout"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                ออกจากระบบ
              </button>
            </div>
          </aside>
        </div>
      )}

      <style>{`
        .admin-layout {
          min-height: 100vh;
          display: flex;
          background: #f5f8fc;
          color: #1e293b;
        }

        .admin-sidebar {
          position: fixed;
          inset: 0 auto 0 0;
          width: 260px;
          padding: 24px 18px;
          box-sizing: border-box;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          z-index: 100;
        }

        .admin-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px 6px 25px;
          border-bottom: 1px solid #eef2f7;
        }

        .admin-brand-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          background: linear-gradient(135deg,#002060,#155eef);
        }

        .admin-brand > div:last-child {
          display: flex;
          flex-direction: column;
        }

        .admin-brand strong {
          font-size: 17px;
          color: #002060;
        }

        .admin-brand span {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 2px;
        }

        .admin-menu-label {
          margin: 24px 10px 10px;
          font-size: 12px;
          color: #94a3b8;
          font-weight: 700;
          letter-spacing: .08em;
        }

        .admin-menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .admin-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 62px;
          padding: 10px 12px;
          border-radius: 11px;
          color: #64748b;
          text-decoration: none;
          transition: .2s;
        }

        .admin-menu-item:hover {
          background: #f8fafc;
          color: #002060;
        }

        .admin-menu-item.active {
          background: #edf4ff;
          color: #002060;
          border: 1px solid #dbeafe;
        }

        .admin-menu-icon {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          flex-shrink: 0;
        }

        .admin-menu-item.active .admin-menu-icon {
          background: #ffffff;
          color: #155eef;
        }

        .admin-menu-item > div:last-child {
          display: flex;
          flex-direction: column;
        }

        .admin-menu-item strong {
          font-size: 14px;
        }

        .admin-menu-item span {
          margin-top: 3px;
          font-size: 12px;
          color: #94a3b8;
        }

        .admin-user-section {
          margin-top: auto;
          padding-top: 18px;
          border-top: 1px solid #eef2f7;
        }

        .admin-user-card {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 10px;
        }

        .admin-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          background: #002060;
          font-size: 16px;
          font-weight: 700;
        }

        .admin-user-card > div:last-child {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .admin-user-card strong {
          font-size: 13px;
          color: #334155;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .admin-user-card span {
          margin-top: 3px;
          font-size: 12px;
          color: #94a3b8;
        }

        .admin-logout {
          width: 100%;
          min-height: 43px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
          border: 1px solid transparent;
          background: transparent;
          color: #dc2626;
          border-radius: 9px;
          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
        }

        .admin-logout:hover {
          background: #fff1f2;
          border-color: #fecdd3;
        }

        .admin-main {
          width: calc(100% - 260px);
          margin-left: 260px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .admin-topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          min-height: 76px;
          padding: 10px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255,255,255,.96);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e2e8f0;
          box-sizing: border-box;
        }

        .admin-topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-topbar-eyebrow {
          display: block;
          font-size: 11px;
          color: #2563eb;
          font-weight: 800;
          letter-spacing: .08em;
          margin-bottom: 2px;
        }

        .admin-topbar h1 {
          margin: 0;
          font-size: 20px;
          color: #002060;
        }

        .admin-topbar-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .admin-secure {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          background: #ecfdf5;
          color: #047857;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .admin-top-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-left: 18px;
          border-left: 1px solid #e2e8f0;
        }

        .admin-top-user > div:first-child {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .admin-top-user strong {
          font-size: 13px;
          color: #334155;
        }

        .admin-top-user span {
          margin-top: 2px;
          font-size: 12px;
          color: #94a3b8;
        }

        .admin-top-avatar {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #eff6ff;
          color: #155eef;
        }

        .admin-content {
          flex: 1;
          width: 100%;
          padding: 30px;
          box-sizing: border-box;
        }

        .admin-mobile-menu {
          display: none;
        }

        .admin-mobile-overlay {
          display: none;
        }

        @media (max-width: 760px) {
          .admin-sidebar {
            display: none;
          }

          .admin-main {
            width: 100%;
            margin-left: 0;
          }

          .admin-mobile-menu {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            background: white;
            border: 1px solid #dbe3ec;
            border-radius: 9px;
            color: #334155;
          }

          .admin-topbar {
            min-height: 66px;
            padding: 10px 15px;
          }

          .admin-topbar-eyebrow,
          .admin-secure,
          .admin-top-user > div:first-child {
            display: none;
          }

          .admin-top-user {
            padding-left: 0;
            border-left: 0;
          }

          .admin-topbar h1 {
            font-size: 17px;
          }

          .admin-content {
            padding: 20px 14px 30px;
          }

          .admin-mobile-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: flex;
            background: rgba(15,23,42,.5);
          }

          .admin-mobile-drawer {
            width: min(310px, 88vw);
            height: 100%;
            padding: 18px;
            box-sizing: border-box;
            background: white;
            display: flex;
            flex-direction: column;
          }

          .admin-mobile-drawer-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }

          .admin-mobile-drawer-top span {
            font-size: 14px;
            font-weight: 700;
            color: #002060;
          }

          .admin-mobile-drawer-top button {
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #e2e8f0;
            border-radius: 9px;
            background: #f8fafc;
          }
        }
      `}</style>
    </div>
  );
}

function getPageTitle(pathname) {
  if (pathname.startsWith("/scholarships/")) {
    return "รายละเอียดคำขอทุน";
  }

  switch (pathname) {
    case "/dashboard":
      return "Dashboard";

    case "/scholarships":
      return "จัดการคำขอทุน";

    case "/reports":
      return "รายงานและวิเคราะห์";

    default:
      return "Scholarship System";
  }
}
