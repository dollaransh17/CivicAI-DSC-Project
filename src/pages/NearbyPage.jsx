import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_COLOR = {
  raised:     { bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)",  text: "#f59e0b" },
  assigned:   { bg: "rgba(14,165,233,0.12)",  border: "rgba(14,165,233,0.3)",  text: "#38bdf8" },
  "in progress": { bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.3)", text: "#a78bfa" },
  resolved:   { bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.3)",  text: "#34d399" },
};

const PRIORITY_COLOR = {
  high:   "#ef4444",
  medium: "#f59e0b",
  low:    "#34d399",
};

const RADIUS_OPTIONS = [
  { label: "500 m",  value: 500 },
  { label: "1 km",   value: 1000 },
  { label: "2 km",   value: 2000 },
  { label: "5 km",   value: 5000 },
];

export default function NearbyPage() {
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [locError, setLocError] = useState("");
  const [radius, setRadius] = useState(1000);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocError("Location access denied. Please allow location access and refresh.")
    );
  }, []);

  const fetchNearby = async () => {
    if (!location) return;
    setLoading(true);
    setFetchError("");
    setSearched(true);

    try {
      const res = await fetch(
        `/api/users/nearby?lat=${location.lat}&lng=${location.lng}&radius=${radius}`
      );
      if (!res.ok) {
        const data = await res.json();
        setFetchError(data.detail || "Failed to load nearby issues");
        setIssues([]);
        return;
      }
      const data = await res.json();
      setIssues(data);
    } catch {
      setFetchError("Could not connect to server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) fetchNearby();
  }, [location]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#030712",
        color: "#fff",
        fontFamily: "'Inter',system-ui,sans-serif",
        padding: "120px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", width: 600, height: 600, top: -200, left: -200, background: "#0ea5e9", opacity: 0.2, filter: "blur(120px)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", width: 500, height: 500, bottom: -200, right: -200, background: "#ef4444", opacity: 0.15, filter: "blur(120px)", borderRadius: "50%" }} />

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

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 10 }}>
            Nearby Issues
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.7 }}>
            Civic issues reported in your vicinity — potholes, broken lights, garbage, water leaks and more.
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "24px 28px",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {locError ? (
              <>
                <span style={{ fontSize: 20 }}>⚠️</span>
                <span style={{ color: "#ef4444", fontSize: 14 }}>{locError}</span>
              </>
            ) : location ? (
              <>
                <span
                  style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: "#34d399",
                    boxShadow: "0 0 10px rgba(52,211,153,0.7)",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: "#94a3b8", fontSize: 14 }}>
                  Location detected:{" "}
                  <span style={{ color: "#e2e8f0" }}>
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </span>
                </span>
              </>
            ) : (
              <>
                <span style={{ fontSize: 20 }}>📍</span>
                <span style={{ color: "#64748b", fontSize: 14 }}>Detecting location...</span>
              </>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ color: "#94a3b8", fontSize: 13 }}>Radius:</span>
            <div style={{ display: "flex", gap: 8 }}>
              {RADIUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRadius(opt.value)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 10,
                    border: radius === opt.value
                      ? "1px solid rgba(14,165,233,0.6)"
                      : "1px solid rgba(255,255,255,0.08)",
                    background: radius === opt.value
                      ? "rgba(14,165,233,0.15)"
                      : "rgba(255,255,255,0.03)",
                    color: radius === opt.value ? "#38bdf8" : "#94a3b8",
                    fontSize: 13,
                    fontWeight: radius === opt.value ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={fetchNearby}
              disabled={!location || loading}
              style={{
                padding: "8px 18px",
                borderRadius: 12,
                border: "none",
                background: !location || loading
                  ? "rgba(14,165,233,0.2)"
                  : "linear-gradient(135deg,#0ea5e9,#0369a1)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: !location || loading ? "not-allowed" : "pointer",
                transition: "all 0.15s",
              }}
            >
              {loading ? "Searching..." : "🔍 Search"}
            </button>
          </div>
        </div>

        {/* Error */}
        {fetchError && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 12,
            padding: "14px 18px",
            color: "#ef4444",
            fontSize: 14,
            marginBottom: 24,
          }}>
            {fetchError}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 18,
                  padding: 28,
                  height: 120,
                  opacity: 0.5 + i * 0.1,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        )}

        {!loading && searched && issues.length === 0 && !fetchError && (
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: "60px 40px",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>No issues nearby</h3>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              No civic issues have been reported within {RADIUS_OPTIONS.find((o) => o.value === radius)?.label} of your location.
            </p>
            <button
              onClick={() => navigate("/report")}
              style={{
                marginTop: 24,
                padding: "12px 24px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg,#0ea5e9,#0369a1)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Be the first to report an issue
            </button>
          </div>
        )}

        {!loading && issues.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ color: "#64748b", fontSize: 14 }}>
                Found{" "}
                <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{issues.length}</span>{" "}
                issue{issues.length !== 1 ? "s" : ""} within{" "}
                {RADIUS_OPTIONS.find((o) => o.value === radius)?.label}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {issues.map((issue) => {
                const sc = STATUS_COLOR[issue.status] || STATUS_COLOR.raised;
                return (
                  <div
                    key={issue._id}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 20,
                      padding: "24px 28px",
                      transition: "border-color 0.2s, background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(14,165,233,0.2)";
                      e.currentTarget.style.background = "rgba(14,165,233,0.03)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 10 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, flex: 1 }}>{issue.title}</h3>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          background: sc.bg,
                          border: `1px solid ${sc.border}`,
                          color: sc.text,
                          flexShrink: 0,
                        }}
                      >
                        {issue.status}
                      </span>
                    </div>

                    <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 14, lineHeight: 1.6 }}>
                      {issue.description}
                    </p>

                    {issue.image_id && (
                      <img
                        src={`/api/users/image/${issue.image_id}`}
                        alt=""
                        onError={(e) => { e.target.style.display = 'none'; }}
                        style={{
                          width: "100%",
                          maxHeight: 240,
                          objectFit: "cover",
                          borderRadius: 14,
                          marginBottom: 14,
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      />
                    )}

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {issue.department && (
                        <span style={{
                          padding: "4px 12px", borderRadius: 20, fontSize: 12,
                          background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.15)", color: "#7dd3fc",
                        }}>
                          📁 {issue.department}
                        </span>
                      )}
                      {issue.ai_department && issue.ai_department !== issue.department && (
                        <span style={{
                          padding: "4px 12px", borderRadius: 20, fontSize: 12,
                          background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)", color: "#c4b5fd",
                        }}>
                          🤖 {issue.ai_department}
                        </span>
                      )}
                      {issue.priority && (
                        <span style={{
                          padding: "4px 12px", borderRadius: 20, fontSize: 12,
                          background: "rgba(0,0,0,0.2)", border: `1px solid ${PRIORITY_COLOR[issue.priority]}44`, color: PRIORITY_COLOR[issue.priority],
                        }}>
                          ⚡ {issue.priority}
                        </span>
                      )}
                      {issue.created_at && (
                        <span style={{
                          padding: "4px 12px", borderRadius: 20, fontSize: 12,
                          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b",
                        }}>
                          🕐 {new Date(issue.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!loading && searched && (
          <div style={{
            marginTop: 40,
            textAlign: "center",
            paddingTop: 32,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 16 }}>
              Spotted an issue not listed here?
            </p>
            <button
              onClick={() => navigate("/report")}
              style={{
                padding: "12px 28px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg,#0ea5e9,#0369a1)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(14,165,233,0.25)",
              }}
            >
              Report an Issue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
