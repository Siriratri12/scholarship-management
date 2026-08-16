import { useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

  const [message, setMessage] = useState({
    text: "",
    type: "",
  });

  const scholarshipTypes = [
    "ทุนขาดแคลนทุนทรัพย์",
    "ทุนส่งเสริมการศึกษา (เรียนดี)",
    "ทุนทำงานพิเศษ (นักศึกษาช่วยงาน)",
    "ทุนฉุกเฉิน/ช่วยเหลือกรณีพิเศษ",
    "ทุนกิจกรรมนักศึกษา",
  ];

  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (message.text) {
      setMessage({
        text: "",
        type: "",
      });
    }
  };

  // =========================================================
  // HANDLE SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setMessage({
      text: "",
      type: "",
    });

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

      console.log("API URL:", API_URL);
      console.log("Submitting payload:", payload);

      const response = await fetch(`${API_URL}/api/scholarships`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const result = await response.json();

      console.log("API response:", result);

      if (!response.ok || !result.success) {
        throw new Error(result.message || "เกิดข้อผิดพลาดในการส่งคำขอทุน");
      }

      setMessage({
        text: `ส่งคำขอทุนสำเร็จ! เลขที่คำขอของคุณคือ: ${
          result.data?.requestNumber || "-"
        }`,
        type: "success",
      });

      // Reset form
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
      console.error("Submit scholarship error:", error);

      setMessage({
        text: error.message || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
        type: "error",
      });
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
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        style={{
          textAlign: "center",
          marginBottom: "32px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            margin: "0 0 8px",
          }}
        >
          ยื่นคำขอรับทุนการศึกษา
        </h1>

        <p
          style={{
            color: "var(--text)",
          }}
        >
          กองพัฒนานักศึกษาและศิษย์เก่าสัมพันธ์ มหาวิทยาลัยสงขลานครินทร์
        </p>
      </header>

      {/* =====================================================
          MESSAGE
      ===================================================== */}

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

            border: `1px solid ${
              message.type === "success" ? "#10b981" : "#ef4444"
            }`,
          }}
        >
          {message.text}
        </div>
      )}

      {/* =====================================================
          FORM
      ===================================================== */}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Student ID + Name */}

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
              style={inputStyle}
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
              style={inputStyle}
            />
          </div>
        </div>

        {/* Faculty + Major */}

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
              style={inputStyle}
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
              style={inputStyle}
            />
          </div>
        </div>

        {/* Year + GPAX */}

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
              required
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
              style={inputStyle}
            />
          </div>
        </div>

        {/* Email + Scholarship Type */}

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
              style={inputStyle}
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
              required
              style={inputStyle}
            >
              {scholarshipTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount + Bank Account */}

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
              min="1"
              name="requestedAmount"
              value={formData.requestedAmount}
              onChange={handleChange}
              required
              placeholder="เช่น 5000"
              style={inputStyle}
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
              style={inputStyle}
            />
          </div>
        </div>

        {/* Reason */}

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "500",
            }}
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
              ...inputStyle,
              height: "auto",
              resize: "vertical",
            }}
          />
        </div>

        {/* PDPA */}

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <input
            type="checkbox"
            name="pdpaConsent"
            checked={formData.pdpaConsent}
            onChange={handleChange}
            required
            id="pdpa"
            style={{
              width: "18px",
              height: "18px",
              marginTop: "2px",
            }}
          />

          <label
            htmlFor="pdpa"
            style={{
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            ข้าพเจ้ายินยอมให้เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคล
            เพื่อประกอบการพิจารณาทุนการศึกษา ตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล
            (PDPA)
          </label>
        </div>

        {/* Submit */}

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

// =========================================================
// SHARED INPUT STYLE
// =========================================================

const inputStyle = {
  width: "100%",

  padding: "10px",

  boxSizing: "border-box",

  borderRadius: "4px",

  border: "1px solid var(--border)",

  background: "var(--code-bg)",

  color: "var(--text-h)",
};

export default App;
