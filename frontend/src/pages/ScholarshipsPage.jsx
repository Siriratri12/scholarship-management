import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  FilePenLine,
  FileText,
  Filter,
  LoaderCircle,
  Plus,
  Save,
  Search,
  Trash2,
  WalletCards,
  X,
  XCircle,
} from "lucide-react";

import ScholarshipForm from "../components/ScholarshipForm";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const scholarshipTypeOptions = [
  {
    value: "NEEDY",
    label: "ทุนขาดแคลนทุนทรัพย์",
  },
  {
    value: "ACADEMIC",
    label: "ทุนส่งเสริมการศึกษา (เรียนดี)",
  },
  {
    value: "WORK",
    label: "ทุนทำงานพิเศษ (นักศึกษาช่วยงาน)",
  },
  {
    value: "EMERGENCY",
    label: "ทุนฉุกเฉิน/ช่วยเหลือกรณีพิเศษ",
  },
  {
    value: "ACTIVITY",
    label: "ทุนกิจกรรมนักศึกษา",
  },
];

const scholarshipTypeLabels = {
  NEEDY: "ทุนขาดแคลนทุนทรัพย์",
  ACADEMIC: "ทุนส่งเสริมการศึกษา (เรียนดี)",
  WORK: "ทุนทำงานพิเศษ (นักศึกษาช่วยงาน)",
  EMERGENCY: "ทุนฉุกเฉิน/ช่วยเหลือกรณีพิเศษ",
  ACTIVITY: "ทุนกิจกรรมนักศึกษา",
};

export default function ScholarshipsPage() {
  const navigate = useNavigate();

  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [targetItem, setTargetItem] = useState(null);
  const [newStatus, setNewStatus] = useState("APPROVED");
  const [staffNote, setStaffNote] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getToken = () => localStorage.getItem("token");

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  }, [navigate]);

  const fetchScholarships = useCallback(async () => {
    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setLoading(true);
    setPageError("");

    try {
      const params = new URLSearchParams();

      params.set("page", String(currentPage));

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      }

      if (statusFilter !== "ALL") {
        params.set("status", statusFilter);
      }

      if (typeFilter !== "ALL") {
        params.set("type", typeFilter);
      }

      const res = await fetch(
        `${API_URL}/api/scholarships?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "ไม่สามารถโหลดข้อมูลคำขอทุนได้");
      }

      setScholarships(data.data?.items || []);

      setPagination(
        data.data?.pagination || {
          page: currentPage,
          limit: 10,
          total: 0,
          totalPages: 1,
        },
      );
    } catch (err) {
      console.error("Failed to fetch scholarships:", err);

      setScholarships([]);

      setPageError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลคำขอทุน");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, typeFilter, handleUnauthorized]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchScholarships();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchScholarships]);

  const handleOpenForm = (item = null) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedItem(null);
    setIsFormOpen(false);
  };

  const handleOpenDeleteModal = (item) => {
    if (item.status !== "PENDING") {
      setPageError("สามารถลบได้เฉพาะคำขอที่อยู่ในสถานะรอพิจารณาเท่านั้น");
      return;
    }

    setDeleteItem(item);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setDeleteLoading(true);
    setPageError("");

    try {
      const res = await fetch(`${API_URL}/api/scholarships/${deleteItem.id}`, {
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

      setDeleteItem(null);

      if (scholarships.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
        return;
      }

      await fetchScholarships();
    } catch (err) {
      setPageError(err.message || "เกิดข้อผิดพลาดในการลบคำขอทุน");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenStatusModal = (item) => {
    if (item.status !== "PENDING") {
      setPageError("สามารถพิจารณาได้เฉพาะคำขอที่อยู่ในสถานะรอพิจารณาเท่านั้น");
      return;
    }

    setTargetItem(item);
    setNewStatus("APPROVED");
    setStaffNote(item.staffNote || "");
    setIsStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    if (statusLoading) return;

    setIsStatusModalOpen(false);
    setTargetItem(null);
    setNewStatus("APPROVED");
    setStaffNote("");
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();

    if (!targetItem) return;

    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    if (newStatus !== "APPROVED" && newStatus !== "REJECTED") {
      setPageError("กรุณาเลือกผลการพิจารณา");
      return;
    }

    setStatusLoading(true);
    setPageError("");

    try {
      const res = await fetch(
        `${API_URL}/api/scholarships/${targetItem.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            staffNote: staffNote.trim(),
          }),
        },
      );

      const data = await res.json();

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "ไม่สามารถเปลี่ยนสถานะได้");
      }

      handleCloseStatusModal();

      await fetchScholarships();
    } catch (err) {
      setPageError(err.message || "เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setCurrentPage(1);
  };

  const getTypeLabel = (type) => {
    return scholarshipTypeLabels[type] || type || "-";
  };

  return (
    <div className="scholarships-page">
      {/* =========================
          HEADER
      ========================= */}

      <section className="scholarships-header">
        <div className="scholarships-title">
          <span className="scholarships-eyebrow">SCHOLARSHIP REQUESTS</span>

          <h1>จัดการคำขอทุนการศึกษา</h1>

          <p>ค้นหา ตรวจสอบ แก้ไข และพิจารณาคำขอทุนของนักศึกษา</p>

          <div className="scholarships-total">
            <FileText size={13} />
            พบทั้งหมด <strong>{pagination.total}</strong> รายการ
          </div>
        </div>

        <button
          type="button"
          className="scholarship-add-button"
          onClick={() => handleOpenForm(null)}
        >
          <Plus size={17} />
          เพิ่มคำขอทุนใหม่
        </button>
      </section>

      {/* =========================
          ERROR
      ========================= */}

      {pageError && (
        <div className="scholarships-error">
          <AlertCircle size={17} />

          <span>{pageError}</span>

          <button type="button" onClick={() => setPageError("")}>
            <X size={15} />
          </button>
        </div>
      )}

      {/* =========================
          FILTER
      ========================= */}

      <section className="scholarships-filter">
        <div className="scholarships-filter-heading">
          <div className="scholarships-filter-icon">
            <Filter size={17} />
          </div>

          <div>
            <strong>ค้นหาและกรองรายการ</strong>
            <span>เลือกเงื่อนไขเพื่อค้นหาคำขอที่ต้องการ</span>
          </div>
        </div>

        <div className="scholarships-filter-grid">
          <div className="scholarships-search">
            <Search size={16} />

            <input
              type="text"
              placeholder="ค้นหาชื่อ รหัสนักศึกษา หรือเลขที่คำขอ"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">ทุกสถานะ</option>
            <option value="PENDING">รอพิจารณา</option>
            <option value="APPROVED">อนุมัติแล้ว</option>
            <option value="REJECTED">ไม่อนุมัติ</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">ทุกประเภททุน</option>

            {scholarshipTypeOptions.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="scholarships-reset"
            onClick={handleResetFilters}
          >
            ล้างตัวกรอง
          </button>
        </div>
      </section>

      {/* =========================
          TABLE DESKTOP
      ========================= */}

      <section className="scholarships-table-card">
        <div className="scholarships-table-wrapper">
          <table className="scholarships-table">
            <thead>
              <tr>
                <th>เลขที่คำขอ</th>
                <th>นักศึกษา</th>
                <th>ประเภททุน</th>
                <th className="right">จำนวนเงิน</th>
                <th>สถานะ</th>
                <th>วันที่ยื่น</th>
                <th className="center">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="scholarships-empty">
                    <div className="scholarships-loading-row">
                      <LoaderCircle size={20} className="scholarships-spin" />
                      กำลังโหลดข้อมูล...
                    </div>
                  </td>
                </tr>
              ) : scholarships.length === 0 ? (
                <tr>
                  <td colSpan="7" className="scholarships-empty">
                    <FileText size={27} />

                    <strong>ไม่พบข้อมูลคำขอทุน</strong>

                    <span>ลองเปลี่ยนคำค้นหาหรือตัวกรองแล้วตรวจสอบอีกครั้ง</span>
                  </td>
                </tr>
              ) : (
                scholarships.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong className="scholarships-request-number">
                        {item.requestNumber || `#${item.id}`}
                      </strong>
                    </td>

                    <td>
                      <div className="scholarships-student">
                        <strong>{item.studentName || "-"}</strong>

                        <span>{item.studentId || "-"}</span>
                      </div>
                    </td>

                    <td>
                      <div className="scholarships-type">
                        <div>
                          <WalletCards size={15} />
                        </div>

                        <span>{getTypeLabel(item.scholarshipType)}</span>
                      </div>
                    </td>

                    <td className="right scholarships-amount">
                      {Number(item.requestedAmount || 0).toLocaleString(
                        "th-TH",
                      )}{" "}
                      บาท
                    </td>

                    <td>
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="scholarships-date">
                      {formatDate(item.createdAt)}
                    </td>

                    <td>
                      <ActionButtons
                        item={item}
                        onView={() => navigate(`/scholarships/${item.id}`)}
                        onEdit={() => handleOpenForm(item)}
                        onStatus={() => handleOpenStatusModal(item)}
                        onDelete={() => handleOpenDeleteModal(item)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* =========================
            MOBILE CARDS
        ========================= */}

        <div className="scholarships-mobile-list">
          {loading ? (
            <div className="scholarships-mobile-loading">
              <LoaderCircle size={22} className="scholarships-spin" />
              กำลังโหลดข้อมูล...
            </div>
          ) : scholarships.length === 0 ? (
            <div className="scholarships-mobile-empty">
              <FileText size={27} />

              <strong>ไม่พบข้อมูลคำขอทุน</strong>

              <span>ลองเปลี่ยนเงื่อนไขการค้นหา</span>
            </div>
          ) : (
            scholarships.map((item) => (
              <article
                className="scholarship-mobile-card"
                key={`${item.id}-mobile`}
              >
                <div className="scholarship-mobile-header">
                  <div>
                    <span>เลขที่คำขอ</span>

                    <strong>{item.requestNumber || `#${item.id}`}</strong>
                  </div>

                  <StatusBadge status={item.status} />
                </div>

                <div className="scholarship-mobile-student">
                  <strong>{item.studentName || "-"}</strong>

                  <span>รหัสนักศึกษา {item.studentId || "-"}</span>
                </div>

                <div className="scholarship-mobile-details">
                  <div>
                    <span>ประเภททุน</span>

                    <strong>{getTypeLabel(item.scholarshipType)}</strong>
                  </div>

                  <div>
                    <span>จำนวนเงินที่ขอ</span>

                    <strong>
                      {Number(item.requestedAmount || 0).toLocaleString(
                        "th-TH",
                      )}{" "}
                      บาท
                    </strong>
                  </div>

                  <div>
                    <span>วันที่ยื่น</span>

                    <strong>{formatDate(item.createdAt)}</strong>
                  </div>
                </div>

                <div className="scholarship-mobile-actions">
                  <ActionButtons
                    item={item}
                    mobile
                    onView={() => navigate(`/scholarships/${item.id}`)}
                    onEdit={() => handleOpenForm(item)}
                    onStatus={() => handleOpenStatusModal(item)}
                    onDelete={() => handleOpenDeleteModal(item)}
                  />
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* =========================
          PAGINATION
      ========================= */}

      {pagination.totalPages > 1 && (
        <section className="scholarships-pagination">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <ChevronLeft size={16} />
            ก่อนหน้า
          </button>

          <div>
            <span>หน้า</span>

            <strong>{pagination.page}</strong>

            <span>จาก {Math.max(pagination.totalPages, 1)}</span>
          </div>

          <button
            type="button"
            disabled={currentPage >= pagination.totalPages}
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, pagination.totalPages),
              )
            }
          >
            ถัดไป
            <ChevronRight size={16} />
          </button>
        </section>
      )}

      {/* =========================
          ADD / EDIT
      ========================= */}

      {isFormOpen && (
        <ScholarshipForm
          initialData={selectedItem}
          onClose={handleCloseForm}
          onSave={fetchScholarships}
        />
      )}

      {/* =========================
          STATUS MODAL
      ========================= */}

      {isStatusModalOpen && targetItem && (
        <div
          className="scholarships-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !statusLoading) {
              handleCloseStatusModal();
            }
          }}
        >
          <div className="scholarships-status-modal">
            <button
              type="button"
              className="scholarships-modal-close"
              onClick={handleCloseStatusModal}
              disabled={statusLoading}
            >
              <X size={17} />
            </button>

            <div className="scholarships-status-modal-header">
              <div>
                <CheckCircle2 size={21} />
              </div>

              <span>SCHOLARSHIP REVIEW</span>

              <h2>พิจารณาคำขอทุน</h2>

              <p>เลือกผลการพิจารณาและบันทึกหมายเหตุประกอบ</p>
            </div>

            <div className="scholarships-modal-request">
              <div>
                <span>เลขที่คำขอ</span>

                <strong>
                  {targetItem.requestNumber || `#${targetItem.id}`}
                </strong>
              </div>

              <div>
                <span>นักศึกษา</span>

                <strong>{targetItem.studentName}</strong>
              </div>
            </div>

            <form
              className="scholarships-status-form"
              onSubmit={handleStatusSubmit}
            >
              <div>
                <label>ผลการพิจารณา</label>

                <div className="scholarships-decision-grid">
                  <label
                    className={`scholarships-decision approved ${
                      newStatus === "APPROVED" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="APPROVED"
                      checked={newStatus === "APPROVED"}
                      onChange={(e) => setNewStatus(e.target.value)}
                    />

                    <CheckCircle2 size={20} />

                    <div>
                      <strong>อนุมัติ</strong>

                      <span>อนุมัติคำขอทุนนี้</span>
                    </div>
                  </label>

                  <label
                    className={`scholarships-decision rejected ${
                      newStatus === "REJECTED" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="REJECTED"
                      checked={newStatus === "REJECTED"}
                      onChange={(e) => setNewStatus(e.target.value)}
                    />

                    <XCircle size={20} />

                    <div>
                      <strong>ไม่อนุมัติ</strong>

                      <span>ปฏิเสธคำขอทุนนี้</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="statusNote">หมายเหตุประกอบการพิจารณา</label>

                <textarea
                  id="statusNote"
                  rows="4"
                  placeholder="ระบุเหตุผลหรือหมายเหตุเพิ่มเติม (ถ้ามี)"
                  value={staffNote}
                  onChange={(e) => setStaffNote(e.target.value)}
                />
              </div>

              <div className="scholarships-modal-actions">
                <button
                  type="button"
                  className="scholarships-cancel-button"
                  onClick={handleCloseStatusModal}
                  disabled={statusLoading}
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  className="scholarships-save-status"
                  disabled={statusLoading}
                >
                  {statusLoading ? (
                    <>
                      <LoaderCircle size={15} className="scholarships-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      บันทึกผล
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          DELETE MODAL
      ========================= */}

      {deleteItem && (
        <div
          className="scholarships-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deleteLoading) {
              setDeleteItem(null);
            }
          }}
        >
          <div className="scholarships-delete-modal">
            <div className="scholarships-delete-icon">
              <Trash2 size={25} />
            </div>

            <h2>ยืนยันการลบคำขอ</h2>

            <p>คุณต้องการลบคำขอทุนนี้ใช่หรือไม่?</p>

            <div className="scholarships-delete-request">
              <span>เลขที่คำขอ</span>

              <strong>{deleteItem.requestNumber || `#${deleteItem.id}`}</strong>

              <small>{deleteItem.studentName}</small>
            </div>

            <div className="scholarships-soft-delete">
              <AlertCircle size={15} />

              <span>
                ระบบจะดำเนินการแบบ Soft Delete โดยข้อมูลจะยังอยู่ในฐานข้อมูล
                แต่ไม่แสดงในรายการปกติ
              </span>
            </div>

            <div className="scholarships-delete-actions">
              <button
                type="button"
                onClick={() => setDeleteItem(null)}
                disabled={deleteLoading}
              >
                ยกเลิก
              </button>

              <button
                type="button"
                className="danger"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <LoaderCircle size={15} className="scholarships-spin" />
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

      <ScholarshipsStyles />
    </div>
  );
}

/* =========================================================
   ACTION BUTTONS
========================================================= */

function ActionButtons({
  item,
  onView,
  onEdit,
  onStatus,
  onDelete,
  mobile = false,
}) {
  return (
    <div className={`scholarships-actions ${mobile ? "mobile" : ""}`}>
      <button
        type="button"
        className="view"
        onClick={onView}
        title="ดูรายละเอียด"
      >
        <Eye size={14} />
        <span>ดู</span>
      </button>

      <button type="button" className="edit" onClick={onEdit} title="แก้ไข">
        <FilePenLine size={14} />
        <span>แก้ไข</span>
      </button>

      {item.status === "PENDING" && (
        <>
          <button
            type="button"
            className="review"
            onClick={onStatus}
            title="พิจารณา"
          >
            <CheckCircle2 size={14} />
            <span>พิจารณา</span>
          </button>

          <button
            type="button"
            className="delete"
            onClick={onDelete}
            title="ลบ"
          >
            <Trash2 size={14} />
            <span>ลบ</span>
          </button>
        </>
      )}
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const config = {
    PENDING: {
      label: "รอพิจารณา",
      Icon: Clock3,
    },

    APPROVED: {
      label: "อนุมัติแล้ว",
      Icon: CheckCircle2,
    },

    REJECTED: {
      label: "ไม่อนุมัติ",
      Icon: XCircle,
    },
  };

  const current = config[status] || config.PENDING;

  const Icon = current.Icon;

  return (
    <span
      className={`scholarships-status ${status?.toLowerCase() || "pending"}`}
    >
      <Icon size={12} />
      {current.label}
    </span>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   STYLE
========================================================= */

function ScholarshipsStyles() {
  return (
    <style>
      {`
        .scholarships-page {
          width: 100%;
          max-width: 1500px;
          min-height: 100vh;
          margin: 0 auto;
          padding: 8px 10px 45px;
          box-sizing: border-box;
          color: #1e293b;
        }

        /* Header */

        .scholarships-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 21px;
        }

        .scholarships-eyebrow {
          display: block;
          margin-bottom: 4px;
          color: #2563eb;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .14em;
        }

        .scholarships-title h1 {
          margin: 0;
          color: #002060;
          font-size: clamp(25px, 3vw, 33px);
          line-height: 1.25;
        }

        .scholarships-title > p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .scholarships-total {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 7px;
          color: #94a3b8;
          font-size: 12px;
        }

        .scholarships-total strong {
          color: #002060;
        }

        .scholarship-add-button {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 0 15px;
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
            0 7px 17px rgba(0,32,96,.16);
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Error */

        .scholarships-error {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
          padding: 10px 12px;
          color: #dc2626;
          background: #fff4f4;
          border: 1px solid #fecaca;
          border-radius: 8px;
          font-size: 13px;
        }

        .scholarships-error > span {
          flex: 1;
        }

        .scholarships-error button {
          display: flex;
          padding: 2px;
          color: inherit;
          background: transparent;
          border: 0;
          cursor: pointer;
        }

        /* Filter */

        .scholarships-filter {
          margin-bottom: 16px;
          padding: 18px;
          background: #ffffff;
          border: 1px solid #e0e7ef;
          border-radius: 13px;
          box-shadow:
            0 4px 14px rgba(15,23,42,.025);
        }

        .scholarships-filter-heading {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 14px;
        }

        .scholarships-filter-icon {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #155eef;
          background: #eff4ff;
          border-radius: 8px;
        }

        .scholarships-filter-heading > div:last-child {
          display: flex;
          flex-direction: column;
        }

        .scholarships-filter-heading strong {
          color: #002060;
          font-size: 14px;
        }

        .scholarships-filter-heading span {
          margin-top: 2px;
          color: #94a3b8;
          font-size: 12px;
        }

        .scholarships-filter-grid {
          display: grid;
          grid-template-columns:
            minmax(250px,1.7fr)
            minmax(150px,.75fr)
            minmax(190px,1fr)
            auto;
          gap: 10px;
        }

        .scholarships-search {
          position: relative;
        }

        .scholarships-search > svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .scholarships-search input,
        .scholarships-filter-grid select {
          width: 100%;
          height: 40px;
          box-sizing: border-box;
          color: #334155;
          background: #f8fafc;
          border: 1px solid #d5dee8;
          border-radius: 8px;
          outline: none;
          font-family: inherit;
          font-size: 13px;
        }

        .scholarships-search input {
          padding: 0 12px 0 36px;
        }

        .scholarships-filter-grid select {
          padding: 0 10px;
        }

        .scholarships-search input:focus,
        .scholarships-filter-grid select:focus {
          background: #ffffff;
          border-color: #5d88e0;
          box-shadow:
            0 0 0 3px rgba(37,99,235,.07);
        }

        .scholarships-reset {
          min-height: 40px;
          padding: 0 12px;
          color: #64748b;
          background: #ffffff;
          border: 1px solid #d5dee8;
          border-radius: 8px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Table */

        .scholarships-table-card {
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e0e7ef;
          border-radius: 13px;
          box-shadow:
            0 4px 14px rgba(15,23,42,.025);
        }

        .scholarships-table-wrapper {
          overflow-x: auto;
        }

        .scholarships-table {
          width: 100%;
          min-width: 1050px;
          border-collapse: collapse;
        }

        .scholarships-table th {
          padding: 11px 14px;
          color: #64748b;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          text-align: left;
          white-space: nowrap;
          font-size: 12px;
          font-weight: 700;
        }

        .scholarships-table td {
          padding: 13px 14px;
          color: #475569;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
          font-size: 12px;
        }

        .scholarships-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .scholarships-table tbody tr:hover {
          background: #fbfdff;
        }

        .scholarships-table .right {
          text-align: right;
        }

        .scholarships-table .center {
          text-align: center;
        }

        .scholarships-request-number {
          color: #002060;
          font-size: 12px;
        }

        .scholarships-student {
          display: flex;
          flex-direction: column;
        }

        .scholarships-student strong {
          color: #334155;
          font-size: 13px;
        }

        .scholarships-student span {
          margin-top: 2px;
          color: #94a3b8;
          font-size: 11px;
        }

        .scholarships-type {
          display: flex;
          align-items: center;
          gap: 7px;
          max-width: 230px;
        }

        .scholarships-type > div {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563eb;
          background: #eff4ff;
          border-radius: 7px;
        }

        .scholarships-type span {
          color: #475569;
          line-height: 1.45;
          font-size: 12px;
        }

        .scholarships-amount {
          color: #002060 !important;
          white-space: nowrap;
          font-size: 12px;
          font-weight: 700;
        }

        .scholarships-date {
          color: #64748b !important;
          white-space: nowrap;
          font-size: 11px;
        }

        /* Status */

        .scholarships-status {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 8px;
          border-radius: 999px;
          white-space: nowrap;
          font-size: 11px;
          font-weight: 700;
        }

        .scholarships-status.pending {
          color: #b45309;
          background: #fffbeb;
          border: 1px solid #fde7b4;
        }

        .scholarships-status.approved {
          color: #047857;
          background: #ecfdf5;
          border: 1px solid #b7efd3;
        }

        .scholarships-status.rejected {
          color: #dc2626;
          background: #fff1f2;
          border: 1px solid #fecdd3;
        }

        /* Actions */

        .scholarships-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          flex-wrap: wrap;
        }

        .scholarships-actions button {
          min-height: 29px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 0 8px;
          border-radius: 6px;
          font-family: inherit;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .scholarships-actions .view {
          color: #ffffff;
          background: #002060;
          border: 1px solid #002060;
        }

        .scholarships-actions .edit {
          color: #2563eb;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
        }

        .scholarships-actions .review {
          color: #047857;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
        }

        .scholarships-actions .delete {
          color: #dc2626;
          background: #fff1f2;
          border: 1px solid #fecaca;
        }

        /* Empty */

        .scholarships-empty {
          height: 190px;
          text-align: center;
          color: #94a3b8 !important;
        }

        .scholarships-empty > svg {
          display: block;
          margin: 0 auto 8px;
        }

        .scholarships-empty > strong {
          display: block;
          color: #64748b;
          font-size: 14px;
        }

        .scholarships-empty > span {
          display: block;
          margin-top: 3px;
          font-size: 12px;
        }

        .scholarships-loading-row {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
        }

        .scholarships-spin {
          animation:
            scholarships-spin .7s
            linear infinite;
        }

        @keyframes scholarships-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Pagination */

        .scholarships-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 13px;
          margin-top: 20px;
        }

        .scholarships-pagination button {
          min-height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 0 10px;
          color: #ffffff;
          background: #002060;
          border: 0;
          border-radius: 7px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .scholarships-pagination button:disabled {
          color: #94a3b8;
          background: #e2e8f0;
          cursor: not-allowed;
        }

        .scholarships-pagination > div {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #94a3b8;
          font-size: 12px;
        }

        .scholarships-pagination strong {
          min-width: 26px;
          height: 26px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #002060;
          background: #eff4ff;
          border-radius: 6px;
          font-size: 12px;
        }

        /* Mobile list */

        .scholarships-mobile-list {
          display: none;
        }

        /* Modal */

        .scholarships-modal-overlay {
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

        .scholarships-status-modal,
        .scholarships-delete-modal {
          width: 100%;
          max-width: 440px;
          box-sizing: border-box;
          background: #ffffff;
          border-radius: 16px;
          box-shadow:
            0 22px 60px rgba(15,23,42,.25);
        }

        .scholarships-status-modal {
          position: relative;
          padding: 26px;
        }

        .scholarships-modal-close {
          position: absolute;
          top: 13px;
          right: 13px;
          display: flex;
          padding: 5px;
          color: #94a3b8;
          background: transparent;
          border: 0;
          cursor: pointer;
        }

        .scholarships-status-modal-header {
          text-align: center;
        }

        .scholarships-status-modal-header > div {
          width: 49px;
          height: 49px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 10px;
          color: #155eef;
          background: #eff4ff;
          border-radius: 13px;
        }

        .scholarships-status-modal-header > span {
          color: #2563eb;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .13em;
        }

        .scholarships-status-modal-header h2 {
          margin: 3px 0 0;
          color: #002060;
          font-size: 20px;
        }

        .scholarships-status-modal-header p {
          margin: 5px 0 0;
          color: #94a3b8;
          font-size: 12px;
        }

        .scholarships-modal-request {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin: 17px 0;
          padding: 11px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
        }

        .scholarships-modal-request > div {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .scholarships-modal-request span {
          color: #94a3b8;
          font-size: 10px;
        }

        .scholarships-modal-request strong {
          margin-top: 2px;
          overflow: hidden;
          color: #334155;
          text-overflow: ellipsis;
          font-size: 12px;
        }

        .scholarships-status-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .scholarships-status-form > div > label {
          display: block;
          margin-bottom: 6px;
          color: #334155;
          font-size: 12px;
          font-weight: 700;
        }

        .scholarships-decision-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .scholarships-decision {
          display: grid;
          grid-template-columns: auto auto 1fr;
          align-items: center;
          gap: 7px;
          padding: 10px;
          cursor: pointer;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .scholarships-decision input {
          width: 13px;
          height: 13px;
          margin: 0;
        }

        .scholarships-decision.approved svg {
          color: #059669;
        }

        .scholarships-decision.rejected svg {
          color: #dc2626;
        }

        .scholarships-decision.approved.selected {
          background: #f0fdf4;
          border-color: #86efac;
        }

        .scholarships-decision.rejected.selected {
          background: #fff5f5;
          border-color: #fca5a5;
        }

        .scholarships-decision > div {
          display: flex;
          flex-direction: column;
        }

        .scholarships-decision strong {
          color: #334155;
          font-size: 12px;
        }

        .scholarships-decision span {
          margin-top: 1px;
          color: #94a3b8;
          font-size: 10px;
        }

        .scholarships-status-form textarea {
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
          color: #334155;
          background: #f8fafc;
          border: 1px solid #d5dee8;
          border-radius: 8px;
          outline: none;
          resize: vertical;
          font-family: inherit;
          font-size: 13px;
          line-height: 1.6;
        }

        .scholarships-status-form textarea:focus {
          background: #ffffff;
          border-color: #5d88e0;
          box-shadow:
            0 0 0 3px rgba(37,99,235,.07);
        }

        .scholarships-modal-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 2px;
        }

        .scholarships-modal-actions button {
          min-height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          border-radius: 8px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .scholarships-cancel-button {
          color: #475569;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .scholarships-save-status {
          color: #ffffff;
          background: #002060;
          border: 1px solid #002060;
        }

        /* Delete */

        .scholarships-delete-modal {
          max-width: 390px;
          padding: 26px;
          text-align: center;
        }

        .scholarships-delete-icon {
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          color: #dc2626;
          background: #fff1f2;
          border-radius: 50%;
        }

        .scholarships-delete-modal h2 {
          margin: 0;
          color: #1e293b;
          font-size: 20px;
        }

        .scholarships-delete-modal > p {
          margin: 6px 0 14px;
          color: #64748b;
          font-size: 12px;
        }

        .scholarships-delete-request {
          display: flex;
          flex-direction: column;
          padding: 11px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
        }

        .scholarships-delete-request span {
          color: #94a3b8;
          font-size: 10px;
        }

        .scholarships-delete-request strong {
          margin-top: 2px;
          color: #002060;
          font-size: 15px;
        }

        .scholarships-delete-request small {
          margin-top: 3px;
          color: #64748b;
          font-size: 11px;
        }

        .scholarships-soft-delete {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          margin-top: 11px;
          padding: 9px;
          text-align: left;
          color: #475569;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          border-radius: 8px;
          font-size: 11px;
          line-height: 1.55;
        }

        .scholarships-soft-delete svg {
          flex-shrink: 0;
          color: #2563eb;
        }

        .scholarships-delete-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 16px;
        }

        .scholarships-delete-actions button {
          min-height: 37px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          color: #475569;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .scholarships-delete-actions .danger {
          color: #ffffff;
          background: #dc2626;
          border-color: #dc2626;
        }

        /* Tablet */

        @media (max-width: 1100px) {
          .scholarships-filter-grid {
            grid-template-columns: 1fr 1fr;
          }

          .scholarships-search {
            grid-column: 1 / -1;
          }

          .scholarships-reset {
            width: 100%;
          }
        }

        /* Mobile */

        @media (max-width: 760px) {
          .scholarships-page {
            padding: 0 0 30px;
          }

          .scholarships-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 14px;
          }

          .scholarships-title > p {
            font-size: 13px;
            line-height: 1.6;
          }

          .scholarships-total {
            font-size: 11px;
          }

          .scholarship-add-button {
            width: 100%;
            min-height: 44px;
            font-size: 13px;
          }

          .scholarships-filter {
            padding: 15px;
          }

          .scholarships-filter-heading strong {
            font-size: 14px;
          }

          .scholarships-filter-heading span {
            font-size: 11px;
          }

          .scholarships-filter-grid {
            grid-template-columns: 1fr;
          }

          .scholarships-search {
            grid-column: auto;
          }

          .scholarships-search input,
          .scholarships-filter-grid select,
          .scholarships-reset {
            height: 43px;
            font-size: 13px;
          }

          .scholarships-table-wrapper {
            display: none;
          }

          .scholarships-mobile-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 10px;
            background: #f8fafc;
          }

          .scholarship-mobile-card {
            padding: 14px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 11px;
          }

          .scholarship-mobile-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 10px;
            padding-bottom: 11px;
            border-bottom: 1px solid #f1f5f9;
          }

          .scholarship-mobile-header > div {
            display: flex;
            flex-direction: column;
          }

          .scholarship-mobile-header > div > span {
            color: #94a3b8;
            font-size: 10px;
          }

          .scholarship-mobile-header > div > strong {
            margin-top: 2px;
            color: #002060;
            font-size: 13px;
          }

          .scholarship-mobile-student {
            display: flex;
            flex-direction: column;
            margin-top: 12px;
          }

          .scholarship-mobile-student strong {
            color: #334155;
            font-size: 14px;
          }

          .scholarship-mobile-student span {
            margin-top: 2px;
            color: #94a3b8;
            font-size: 11px;
          }

          .scholarship-mobile-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 12px;
          }

          .scholarship-mobile-details > div {
            display: flex;
            flex-direction: column;
          }

          .scholarship-mobile-details span {
            color: #94a3b8;
            font-size: 10px;
          }

          .scholarship-mobile-details strong {
            margin-top: 3px;
            color: #475569;
            font-size: 12px;
            line-height: 1.5;
          }

          .scholarship-mobile-actions {
            padding-top: 12px;
            margin-top: 12px;
            border-top: 1px solid #f1f5f9;
          }

          .scholarships-actions.mobile {
            display: grid;
            grid-template-columns: repeat(2,1fr);
          }

          .scholarships-actions.mobile button {
            min-height: 35px;
            font-size: 12px;
          }

          .scholarships-mobile-loading,
          .scholarships-mobile-empty {
            min-height: 160px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #94a3b8;
            gap: 5px;
          }

          .scholarships-mobile-empty strong {
            color: #64748b;
            font-size: 14px;
          }

          .scholarships-mobile-empty span {
            font-size: 11px;
          }

          .scholarships-pagination {
            gap: 8px;
          }

          .scholarships-pagination button {
            min-height: 37px;
            font-size: 11px;
          }

          .scholarships-pagination > div {
            font-size: 11px;
          }

          .scholarships-pagination strong {
            font-size: 11px;
          }

          .scholarships-status-modal {
            padding: 22px 17px;
          }

          .scholarships-status-modal-header h2 {
            font-size: 20px;
          }

          .scholarships-status-modal-header p {
            font-size: 12px;
          }

          .scholarships-modal-request span {
            font-size: 10px;
          }

          .scholarships-modal-request strong {
            font-size: 12px;
          }

          .scholarships-status-form > div > label {
            font-size: 12px;
          }

          .scholarships-decision-grid {
            grid-template-columns: 1fr;
          }

          .scholarships-decision strong {
            font-size: 12px;
          }

          .scholarships-decision span {
            font-size: 10px;
          }

          .scholarships-status-form textarea {
            font-size: 13px;
          }

          .scholarships-modal-actions button,
          .scholarships-delete-actions button {
            font-size: 12px;
          }
        }

        @media (max-width: 430px) {
          .scholarship-mobile-details {
            grid-template-columns: 1fr;
          }

          .scholarships-modal-request {
            grid-template-columns: 1fr;
          }

          .scholarships-modal-actions,
          .scholarships-delete-actions {
            grid-template-columns: 1fr;
          }

          .scholarships-pagination button span {
            display: none;
          }
        }
      `}
    </style>
  );
}
