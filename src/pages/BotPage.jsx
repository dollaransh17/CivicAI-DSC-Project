import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, authHeaders } from "../utils/api";

export default function BotPage() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! I'm CivicAI. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, botTyping]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    // Show user message immediately
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setBotTyping(true);

    try {
      const res = await fetch(`${BASE_URL}/bot`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data.detail || data.message || "Bot error");

      const reply = data.reply || data.response || data.message || "I didn't get a response.";
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);

      // If the reply suggests navigation, act on it
      if (/\breport\b/i.test(reply) && /\bpage\b/i.test(reply)) {
        setTimeout(() => navigate("/report"), 1500);
      } else if (/\btrack\b/i.test(reply) && /\bpage\b/i.test(reply)) {
        setTimeout(() => navigate("/track"), 1500);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Sorry, I couldn't reach the server. Please make sure the backend is running." },
      ]);
    } finally {
      setBotTyping(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
            {botTyping && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }}>
                <div style={{ padding: "10px 16px", borderRadius: 14, background: "rgba(255,255,255,0.05)", color: "#94a3b8", fontSize: 13 }}>
                  CivicAI is typing…
                </div>
              </div>
            )}
            <div ref={bottomRef} />

          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything about civic issues…"
              disabled={botTyping}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.02)",
                color: "white",
                opacity: botTyping ? 0.6 : 1,
              }}
            />

            <button
              onClick={sendMessage}
              disabled={botTyping}
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                border: "none",
                background: botTyping ? "rgba(14,165,233,0.4)" : "linear-gradient(135deg,#0ea5e9,#0369a1)",
                color: "white",
                cursor: botTyping ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {botTyping ? "…" : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}