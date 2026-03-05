import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const statuses = ["submitted", "assigned", "in progress", "resolved"];

export default function TrackPage() {
  const [report, setReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const reports = JSON.parse(localStorage.getItem("reports") || "[]");
    if (reports.length > 0) {
      setReport(reports[reports.length - 1]);
    }
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
            Track My Issue
          </h1>

          {!report && (
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

          {report && (
            <>
              <div style={{ marginBottom: 30 }}>
                <h3 style={{ fontSize: 18, marginBottom: 6 }}>
                  Issue Description
                </h3>

                <p style={{ color: "#94a3b8" }}>{report.description}</p>
              </div>

              {report.image && (
                <img
                  src={report.image}
                  alt="issue"
                  style={{
                    width: "100%",
                    maxHeight: 260,
                    objectFit: "cover",
                    borderRadius: 16,
                    marginBottom: 30,
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
              )}

              {report.location && (
                <p style={{ color: "#94a3b8", marginBottom: 30 }}>
                  Location: {report.location.lat.toFixed(4)},{" "}
                  {report.location.lng.toFixed(4)}
                </p>
              )}

              <div style={{ marginTop: 20 }}>
                <h3 style={{ marginBottom: 20 }}>Issue Progress</h3>

                {statuses.map((s, i) => {
                  const active = i <= getStatusIndex(report.status);

                  return (
                    <div
                      key={s}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 20,
                      }}
                    >
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          background: active ? "#0ea5e9" : "#374151",
                          boxShadow: active
                            ? "0 0 14px rgba(14,165,233,0.7)"
                            : "none",
                          marginRight: 16,
                        }}
                      />

                      <span
                        style={{
                          textTransform: "capitalize",
                          color: active ? "#fff" : "#6b7280",
                          fontWeight: active ? 600 : 400,
                        }}
                      >
                        {s}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}