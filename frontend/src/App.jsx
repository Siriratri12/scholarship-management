import { useState } from "react";
import "./App.css";

function App() {
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
    bankAccount: "",
    reason: "",
    pdpaConsent: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const scholarshipTypes = [
    "ทุนขาดแคลนทุนทรัพย์",
    "ทุนส่งเสริมการศึกษา (เรียนดี)",
    "ทุนทำงานพิเศษ (นักศึกษาช่วยงาน)",
    "ทุนฉุกเฉิน/ช่วยเหลือกรณีพิเศษ",
    "ทุนกิจกรรมนักศึกษา",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("http://localhost:5000/api/scholarships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          year: Number(formData.year),
          gpax: Number(formData.gpax),
          requestedAmount: Number(formData.requestedAmount),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "เกิดข้อผิดพลาดในการส่งคำขอทุน");
      }

      setMessage({
        text: `ส่งคำขอทุนสำเร็จ! เลขที่คำขอของคุณคือ: ${result.data.requestNumber}`,
        type: "success",
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
        bankAccount: "",
        reason: "",
        pdpaConsent: false,
      });
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "32px 20px",
        textAlign: "left",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", margin: "0 0 8px" }}>
          ยื่นคำขอรับทุนการศึกษา
        </h1>
        <p style={{ color: "var(--text)" }}>
          กองพัฒนานักศึกษาและศิษย์เก่าสัมพันธ์ มหาวิทยาลัยสงขลานครินทร์
        </p>
      </header>

      {message.text && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "20px",
            borderRadius: "6px",
            background:
              message.type === "success"
                ? "rgba(16, 185, 129, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
            color: message.type === "success" ? "#10b981" : "#ef4444",
            border: `1px solid ${message.type === "success" ? "#10b981" : "#ef4444"}`,
          }}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
              }}
            >
              รหัสนักศึกษา *
            </label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
              placeholder="เช่น 6510110001"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                background: "var(--code-bg)",
                color: "var(--text-h)",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
              }}
            >
              ชื่อ-นามสกุล *
            </label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              required
              placeholder="นายสมชาย เรียนดี"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                background: "var(--code-bg)",
                color: "var(--text-h)",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
              }}
            >
              คณะ *
            </label>
            <input
              type="text"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              required
              placeholder="เช่น วิศวกรรมศาสตร์"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                background: "var(--code-bg)",
                color: "var(--text-h)",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
              }}
            >
              สาขาวิชา *
            </label>
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleChange}
              required
              placeholder="เช่น วิทยาการคอมพิวเตอร์"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                background: "var(--code-bg)",
                color: "var(--text-h)",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
              }}
            >
              ชั้นปี *
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                background: "var(--code-bg)",
                color: "var(--text-h)",
              }}
            >
              <option value="1">ปี 1</option>
              <option value="2">ปี 2</option>
              <option value="3">ปี 3</option>
              <option value="4">ปี 4 ขึ้นไป</option>
            </select>
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
              }}
            >
              GPAX (เกรดเฉลี่ยสะสม) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="4"
              name="gpax"
              value={formData.gpax}
              onChange={handleChange}
              required
              placeholder="เช่น 3.25"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                background: "var(--code-bg)",
                color: "var(--text-h)",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
              }}
            >
              อีเมลติดต่อ *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="student@psu.ac.th"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                background: "var(--code-bg)",
                color: "var(--text-h)",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
              }}
            >
              ประเภททุนที่ขอ *
            </label>
            <select
              name="scholarshipType"
              value={formData.scholarshipType}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                background: "var(--code-bg)",
                color: "var(--text-h)",
              }}
            >
              {scholarshipTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
              }}
            >
              จำนวนเงินที่ขอรับ (บาท) *
            </label>
            <input
              type="number"
              name="requestedAmount"
              value={formData.requestedAmount}
              onChange={handleChange}
              required
              placeholder="เช่น 5000"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                background: "var(--code-bg)",
                color: "var(--text-h)",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
              }}
            >
              เลขบัญชีธนาคาร *
            </label>
            <input
              type="text"
              name="bankAccount"
              value={formData.bankAccount}
              onChange={handleChange}
              required
              placeholder="เลขที่บัญชีสำหรับรับเงินโอน"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                background: "var(--code-bg)",
                color: "var(--text-h)",
              }}
            />
          </div>
        </div>

        <div>
          <label
            style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}
          >
            เหตุผลความจำเป็นในการขอรับทุน *
          </label>
          <textarea
            name="reason"
            rows="4"
            value={formData.reason}
            onChange={handleChange}
            required
            placeholder="ระบุเหตุผลความจำเป็น..."
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid var(--border)",
              background: "var(--code-bg)",
              color: "var(--text-h)",
              resize: "vertical",
            }}
          ></textarea>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            name="pdpaConsent"
            checked={formData.pdpaConsent}
            onChange={handleChange}
            required
            id="pdpa"
            style={{ width: "18px", height: "18px" }}
          />
          <label htmlFor="pdpa" style={{ cursor: "pointer", fontSize: "15px" }}>
            ข้าพเจ้ายินยอมให้เก็บรวบรวม ใช้
            และเปิดเผยข้อมูลส่วนบุคคลตามนโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px",
            borderRadius: "4px",
            border: "none",
            background: "var(--accent)",
            color: "#fff",
            fontWeight: "600",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "กำลังส่งข้อมูล..." : "ส่งคำขอทุนการศึกษา"}
        </button>
      </form>
    </div>
  );
}

export default App;
