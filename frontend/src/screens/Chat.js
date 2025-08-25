import Lottie from "lottie-react";
import { AI_ROBOT, CHAT_BOT } from "../components/AsstesImports";
import { History, Send, Mic, FileText, Link, Image, Ellipsis } from "lucide-react";
import '../screens/ChatStyle.css'
import { useState } from "react";
import { postRequest } from "../ApiMethods/Methods";

const Chat = () => {
  const history = [
    "Chat with AI - Today",
    "Meeting Notes",
    "Project Update",
    "Weekend Plans",
    "Shopping List",
  ];

  const [messages, setMessages] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState("hitesh");

  const sendMessage = async () => {
    if (!messages.trim()) return;

    setChat([...chat, { sender: "user", text: messages }]);
    setLoading(true);
    try {
      setMessages('');

      const data = await postRequest("chat", {
        persona,
        message: messages
      });

      setChat((prev) => [...prev, { sender: "ai", text: data?.replyAI }]);
    } catch (err) {
      console.error("Error:", err.message);
      setChat((prev) => [...prev, { sender: "system", text: `⚠️ ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

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

        {/* <div className="chat-messages">
          {chat?.map((msg, i) => (
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

          {loading && (
            <div className="message-row ai">
              <div className="bot-avatar">
                <img src={CHAT_BOT} alt="Bot" />
              </div>
              <div className="message-bubble ai-bubble">
                <Ellipsis className="typing-dots" size={28} />
              </div>
            </div>
          )}
        </div> */}
<div className="chat-messages">
  {chat?.map((msg, i) => (
    <div
      key={i}
      className={`message-row ${msg.sender}`}
    >
      {msg.sender === "ai" && (
        <div className="bot-avatar">
          <img src={CHAT_BOT} alt="Bot" />
        </div>
      )}

      <div
        className={`message-bubble ${msg.sender}`}
      >
        {msg.text}
      </div>
    </div>
  ))}

  {/* Typing loader */}
  {loading && (
    <div className="message-row ai">
      <div className="bot-avatar">
        <img src={CHAT_BOT} alt="Bot" />
      </div>
      <div className="message-bubble ai">
        <Ellipsis className="typing-dots" size={28} />
      </div>
    </div>
  )}
</div>
        <div className="input-section">
          <div className="input-row">
            <input
              value={messages}
              onChange={(e) => setMessages(e.target.value)}
              type="text"
              placeholder="Type a message..."
            />
            <button className="send-btn" onClick={sendMessage}>
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
              <button key={i} className="feature-btn" onClick={sendMessage}>
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
