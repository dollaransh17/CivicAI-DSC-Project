import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const statuses = ["raised", "assigned", "in progress", "resolved"];

export default function TrackPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("civicai_token");
        if (!token) {
          setError("Please sign in to view your issues.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/users/my-issues", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.detail || "Failed to fetch issues");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setReports(data);
      } catch {
        setError("Could not connect to server. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getStatusIndex = (status) => statuses.indexOf(status);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#030712",
        color: "#fff",
        fontFamily: "'Inter',system-ui,sans-serif",
        padding: "120px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          top: -200,
          left: -200,
          background: "#0ea5e9",
          opacity: 0.25,
          filter: "blur(120px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          bottom: -200,
          right: -200,
          background: "#7c3aed",
          opacity: 0.2,
          filter: "blur(120px)",
        }}
      />

      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            marginBottom: 40,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "8px 16px",
            borderRadius: 12,
            color: "#94a3b8",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: "40px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 80px rgba(14,165,233,0.08)",
          }}
        >
          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              marginBottom: 20,
              letterSpacing: "-0.02em",
            }}
          >
            Track My Issues
          </h1>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10,
              padding: '12px 16px',
              color: '#ef4444',
              fontSize: 14,
              marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          {loading && (
            <p style={{ color: "#94a3b8" }}>Loading your issues...</p>
          )}

          {!loading && !error && reports.length === 0 && (
            <>
              <p style={{ color: "#94a3b8", marginBottom: 24 }}>
                No reports found. Submit an issue first.
              </p>

              <button
                onClick={() => navigate("/report")}
                style={{
                  padding: "14px 22px",
                  borderRadius: 14,
                  border: "none",
                  background: "linear-gradient(135deg,#0ea5e9,#0369a1)",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(14,165,233,0.35)",
                }}
              >
                Report an Issue
              </button>
            </>
          )}

          {reports.map((report) => (
            <div
              key={report._id}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 18,
                padding: "28px",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 12 }}>
                <h3 style={{ fontSize: 20, fontWeight: 700 }}>
                  {report.title}
                </h3>
                <span
                  style={{
                    padding: "4px 14px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    background:
                      report.status === "resolved"
                        ? "rgba(52,211,153,0.15)"
                        : report.status === "assigned"
                        ? "rgba(14,165,233,0.15)"
                        : "rgba(245,158,11,0.15)",
                    color:
                      report.status === "resolved"
                        ? "#34d399"
                        : report.status === "assigned"
                        ? "#38bdf8"
                        : "#f59e0b",
                    border: `1px solid ${
                      report.status === "resolved"
                        ? "rgba(52,211,153,0.3)"
                        : report.status === "assigned"
                        ? "rgba(14,165,233,0.3)"
                        : "rgba(245,158,11,0.3)"
                    }`,
                  }}
                >
                  {report.status}
                </span>
              </div>

              <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 12 }}>
                {report.description}
              </p>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13, color: "#64748b", marginBottom: 16 }}>
                <span>📁 {report.department}</span>
                {report.ai_department && report.ai_department !== report.department && (
                  <span>🤖 AI: {report.ai_department}</span>
                )}
                {report.priority && (
                  <span style={{
                    color: report.priority === "high" ? "#ef4444" : report.priority === "medium" ? "#f59e0b" : "#34d399"
                  }}>
                    ⚡ {report.priority} priority
                  </span>
                )}
                {report.created_at && (
                  <span>🕐 {new Date(report.created_at).toLocaleDateString()}</span>
                )}
              </div>

              {report.image_id && (
                <img
                  src={`/api/users/image/${report.image_id}`}
                  alt="issue"
                  style={{
                    width: "100%",
                    maxHeight: 260,
                    objectFit: "cover",
                    borderRadius: 16,
                    marginBottom: 20,
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
              )}

              <div style={{ marginTop: 12 }}>
                <h4 style={{ marginBottom: 14, fontSize: 14, color: "#94a3b8" }}>Progress</h4>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {statuses.map((s, i) => {
                    const active = i <= getStatusIndex(report.status);
                    return (
                      <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: active ? "#0ea5e9" : "#374151",
                            boxShadow: active ? "0 0 10px rgba(14,165,233,0.6)" : "none",
                            flexShrink: 0,
                          }}
                        />
                        <div style={{
                          flex: 1,
                          height: 2,
                          background: i < statuses.length - 1
                            ? (i < getStatusIndex(report.status) ? "#0ea5e9" : "#374151")
                            : "transparent",
                          marginLeft: 4,
                        }} />
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  {statuses.map((s) => (
                    <span key={s} style={{ fontSize: 10, color: "#64748b", textTransform: "capitalize" }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}