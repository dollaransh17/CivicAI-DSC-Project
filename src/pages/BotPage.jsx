import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BotPage() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! I'm CivicAI. How can I help you today?" }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      });

      const data = await res.json();
      const botMessage = { from: "bot", text: data.reply || "Sorry, I couldn't process that." };
      setMessages((prev) => [...prev, botMessage]);

      // Navigation hints
      const reply = (data.reply || "").toLowerCase();
      if (reply.includes("report page")) {
        setTimeout(() => navigate("/report"), 2000);
      } else if (reply.includes("track page")) {
        setTimeout(() => navigate("/track"), 2000);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Could not connect to server. Is the backend running?" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
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
          filter: "blur(120px)"
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
          filter: "blur(120px)"
        }}
      />

      <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            marginBottom: 30,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "8px 16px",
            borderRadius: 12,
            color: "#94a3b8",
            cursor: "pointer"
          }}
        >
          ← Back
        </button>

        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: 30,
            backdropFilter: "blur(20px)",
            height: 500,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <h2 style={{ marginBottom: 20 }}>CivicAI Bot</h2>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              marginBottom: 20
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                  marginBottom: 10
                }}
              >
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 14,
                    maxWidth: "70%",
                    background:
                      m.from === "user"
                        ? "linear-gradient(135deg,#0ea5e9,#0369a1)"
                        : "rgba(255,255,255,0.05)"
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }}>
                <div style={{ padding: "10px 14px", borderRadius: 14, background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}>
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about reporting or tracking issues..."
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.02)",
                color: "white",
                outline: "none",
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                border: "none",
                background: loading
                  ? "rgba(14,165,233,0.3)"
                  : "linear-gradient(135deg,#0ea5e9,#0369a1)",
                color: "white",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}