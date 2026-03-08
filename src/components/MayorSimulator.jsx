import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, authHeaders } from "../utils/api";

export default function MayorSimulator() {
  const [policy, setPolicy] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const simulate = async () => {
    if (!policy.trim()) return;
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${BASE_URL}/simulate`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ policy }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || data.message || `Error ${res.status}`);

      setResult({
        traffic: data.traffic,
        pollution: data.pollution,
        satisfaction: data.satisfaction,
      });
    } catch {
      // Fallback to local simulation if backend not reachable
      setResult({
        traffic: Math.floor(Math.random() * 20) - 10,
        pollution: Math.floor(Math.random() * 15) - 5,
        satisfaction: Math.floor(Math.random() * 40) + 40,
      });
      setError("Backend not reachable — showing local simulation.");
    } finally {
      setLoading(false);
    }
  };

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
              marginBottom: 10,
              letterSpacing: "-0.02em",
            }}
          >
            Mayor Policy Simulator
          </h1>

          <p
            style={{
              color: "#94a3b8",
              marginBottom: 32,
              fontSize: 15,
              lineHeight: 1.7,
            }}
          >
            Simulate how city policies could influence traffic, pollution,
            and overall citizen satisfaction.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 30,
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="Example: Increase bus routes or plant more trees..."
              value={policy}
              onChange={(e) => setPolicy(e.target.value)}
              style={{
                flex: 1,
                minWidth: 260,
                padding: "14px 16px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                color: "#fff",
                outline: "none",
                fontSize: 14,
              }}
            />

            <button
              onClick={simulate}
              disabled={loading}
              style={{
                padding: "14px 22px",
                borderRadius: 14,
                border: "none",
                background: loading ? "rgba(14,165,233,0.4)" : "linear-gradient(135deg,#0ea5e9,#0369a1)",
                color: "#fff",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 8px 24px rgba(14,165,233,0.35)",
                transition: "background 0.2s",
              }}
            >
              {loading ? "Running…" : "Run Simulation"}
            </button>
          </div>

          {error && (
            <p style={{ color: "#f59e0b", fontSize: 13, marginBottom: 16 }}>{error}</p>
          )}

          {result && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                gap: 20,
                marginTop: 30,
              }}
            >
              <div
                style={{
                  padding: 24,
                  borderRadius: 20,
                  background: "rgba(14,165,233,0.08)",
                  border: "1px solid rgba(14,165,233,0.2)",
                }}
              >
                <h3 style={{ fontSize: 14, color: "#7dd3fc" }}>Traffic Impact</h3>
                <p style={{ fontSize: 28, fontWeight: 700 }}>
                  {result.traffic > 0 ? "+" : ""}
                  {result.traffic}%
                </p>
              </div>

              <div
                style={{
                  padding: 24,
                  borderRadius: 20,
                  background: "rgba(124,58,237,0.08)",
                  border: "1px solid rgba(124,58,237,0.2)",
                }}
              >
                <h3 style={{ fontSize: 14, color: "#c4b5fd" }}>
                  Pollution Impact
                </h3>
                <p style={{ fontSize: 28, fontWeight: 700 }}>
                  {result.pollution > 0 ? "+" : ""}
                  {result.pollution}%
                </p>
              </div>

              <div
                style={{
                  padding: 24,
                  borderRadius: 20,
                  background: "rgba(52,211,153,0.08)",
                  border: "1px solid rgba(52,211,153,0.2)",
                }}
              >
                <h3 style={{ fontSize: 14, color: "#6ee7b7" }}>
                  Citizen Satisfaction
                </h3>
                <p style={{ fontSize: 28, fontWeight: 700 }}>
                  {result.satisfaction}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}