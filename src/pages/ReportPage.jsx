import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReportPage() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  };

  const submitReport = () => {
    const report = {
      id: Date.now(),
      description,
      image,
      location,
      status: "submitted",
      time: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("reports") || "[]");
    existing.push(report);
    localStorage.setItem("reports", JSON.stringify(existing));

    alert("Issue submitted successfully!");
    navigate("/");
  };

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
              marginBottom: 10,
              letterSpacing: "-0.02em",
            }}
          >
            Report an Issue
          </h1>

          <p
            style={{
              color: "#94a3b8",
              marginBottom: 32,
              fontSize: 15,
              lineHeight: 1.7,
            }}
          >
            Upload a photo, describe the civic problem, and automatically tag
            the location to help authorities respond faster.
          </p>

          <textarea
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              height: 120,
              padding: 16,
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
              color: "#fff",
              outline: "none",
              marginBottom: 20,
              fontSize: 14,
            }}
          />

          <input
            type="file"
            onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
            style={{
              marginBottom: 20,
              color: "#94a3b8",
            }}
          />

          {image && (
            <img
              src={image}
              alt="preview"
              style={{
                width: "100%",
                maxHeight: 300,
                objectFit: "cover",
                borderRadius: 16,
                marginBottom: 20,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
          )}

          <button
            onClick={getLocation}
            style={{
              padding: "12px 20px",
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: 20,
              boxShadow: "0 8px 24px rgba(124,58,237,0.35)",
            }}
          >
            Detect Location
          </button>

          {location && (
            <p style={{ color: "#94a3b8", marginBottom: 20 }}>
              Location detected: {location.lat.toFixed(4)},{" "}
              {location.lng.toFixed(4)}
            </p>
          )}

          <button
            onClick={submitReport}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: 16,
              border: "none",
              background: "linear-gradient(135deg,#0ea5e9,#0369a1)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(14,165,233,0.35)",
            }}
          >
            Submit Issue
          </button>
        </div>
      </div>
    </div>
  );
}