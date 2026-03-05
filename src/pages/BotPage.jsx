import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BotPage() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! I'm CivicAI. How can I help you today?" }
  ]);

  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const botReply = (msg) => {
    const m = msg.toLowerCase();

    if (m.includes("report")) {
      return {
        text: "You can report an issue using the Report page.",
        action: () => navigate("/report")
      };
    }

    if (m.includes("track")) {
      return {
        text: "You can track your issue here.",
        action: () => navigate("/track")
      };
    }

    if (m.includes("traffic")) {
      return {
        text: "Traffic issues can be reported with a photo and location so authorities can respond quickly."
      };
    }

    if (m.includes("garbage") || m.includes("waste")) {
      return {
        text: "Garbage collection problems are a common civic issue. You can report it with a photo."
      };
    }

    return {
      text: "I'm here to help with civic issues. You can ask about reporting or tracking problems."
    };
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    const reply = botReply(input);

    const botMessage = { from: "bot", text: reply.text };

    setMessages([...messages, userMessage, botMessage]);
    setInput("");

    if (reply.action) {
      setTimeout(reply.action, 1200);
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
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about reporting or tracking issues..."
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.02)",
                color: "white"
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg,#0ea5e9,#0369a1)",
                color: "white",
                cursor: "pointer"
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