import Lottie from "lottie-react";
import { AI_ROBOT, CHAT_BOT } from "../components/AsstesImports";
import { History, Send, Mic, FileText, Link, Image } from "lucide-react";
import '../screens/ChatStyle.css'
const Chat = () => {
  const history = [
    "Chat with AI - Today",
    "Meeting Notes",
    "Project Update",
    "Weekend Plans",
    "Shopping List",
  ];

  const messages = [
    { sender: "ai", text: "Hello! How can I help you today?" },
    { sender: "user", text: "Can you summarize my meeting notes?" },
    { sender: "ai", text: "Sure! Please upload your meeting notes document." },
    { sender: "user", text: "Done ✅" },
    { sender: "ai", text: "Great, I’ll analyze it now." },
  ];

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <History size={22} style={{ marginRight: "8px" }} />
          Chat History
        </div>

        <div className="chat-history">
          {history.map((chat, i) => (
            <div key={i} className="chat-item">
              {chat}
            </div>
          ))}
        </div>
      </div>

      <div className="main">
        <div className="main-header">
          <div className="header-avatar">
            <Lottie animationData={AI_ROBOT} loop={true} />
          </div>
          <h2>Shubham Singh Boura</h2>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message-row ${msg.sender === "user" ? "user" : "ai"}`}
            >
              {msg.sender === "ai" && (
                <div className="bot-avatar">
                  <img src={CHAT_BOT} alt="Bot" />
                </div>
              )}
              <div
                className={`message-bubble ${
                  msg.sender === "user" ? "user-bubble" : "ai-bubble"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="input-section">
          <div className="input-row">
            <input type="text" placeholder="Type a message..." />
            <button className="send-btn">
              <Send size={20} color="white" />
            </button>
          </div>

          <div className="feature-row">
            {[
              { label: "Voice Chat", icon: <Mic size={18} /> },
              { label: "Document", icon: <FileText size={18} /> },
              { label: "Links", icon: <Link size={18} /> },
              { label: "Picture", icon: <Image size={18} /> },
            ].map((btn, i) => (
              <button key={i} className="feature-btn">
                <span className="feature-icon">{btn.icon}</span>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
