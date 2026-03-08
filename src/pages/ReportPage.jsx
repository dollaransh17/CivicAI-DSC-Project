import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DEPARTMENTS = [
  "Roads & Infrastructure",
  "Water Supply",
  "Sanitation",
  "Electricity",
  "Public Safety",
  "Parks & Recreation",
  "Other",
];

export default function ReportPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => setError("Could not detect location. Please allow location access.")
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const submitReport = async () => {
    if (!title || !description || !department || !location || !imageFile) {
      setError("Please fill in all fields, select a department, detect location, and attach an image.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("civicai_token");
      if (!token) {
        setError("You must be signed in to report an issue.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("department", department);
      formData.append("latitude", location.lat);
      formData.append("longitude", location.lng);
      formData.append("image", imageFile);

      const res = await fetch("/api/users/report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Failed to submit report");
        setLoading(false);
        return;
      }

      alert("Issue submitted successfully!");
      navigate("/");
    } catch {
      setError("Could not connect to server. Is the backend running?");
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

          <input
            type="text"
            placeholder="Issue title (e.g. Pothole on Main Road)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
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

          <textarea
            placeholder="Describe the issue in detail..."
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

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(15,23,42,0.9)",
              color: department ? "#fff" : "#94a3b8",
              outline: "none",
              marginBottom: 20,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            <option value="" disabled>Select Department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{
              marginBottom: 20,
              color: "#94a3b8",
            }}
          />

          {imagePreview && (
            <img
              src={imagePreview}
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
            📍 Detect Location
          </button>

          {location && (
            <p style={{ color: "#94a3b8", marginBottom: 20 }}>
              ✅ Location detected: {location.lat.toFixed(4)},{" "}
              {location.lng.toFixed(4)}
            </p>
          )}

          <button
            onClick={submitReport}
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: 16,
              border: "none",
              background: loading
                ? "rgba(14,165,233,0.3)"
                : "linear-gradient(135deg,#0ea5e9,#0369a1)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 10px 30px rgba(14,165,233,0.35)",
            }}
          >
            {loading ? "Submitting..." : "Submit Issue"}
          </button>
        </div>
      </div>
    </div>
  );
}