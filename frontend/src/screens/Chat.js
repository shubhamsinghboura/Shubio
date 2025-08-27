import Lottie from "lottie-react";
import { AI_ROBOT, CHAT_BOT } from "../components/AsstesImports";
import { History, Send, Mic, FileText, Link, Image, Ellipsis, Smile } from "lucide-react";
import "../screens/ChatStyle.css";
import { useState, useRef, useEffect } from "react";
import { postRequest } from "../ApiMethods/Methods";
import EmojiPicker from "emoji-picker-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { v4 as uuidv4 } from "uuid"
const Chat = () => {
  const history = [
    "Chat with AI - Today",
    "Meeting Notes",
    "Project Update",
    "Weekend Plans",
    "Shopping List",
  ];

  const [messages, setMessages] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState("hitesh");
  const [showEmoji, setShowEmoji] = useState(false);
const [uploadedDoc, setUploadedDoc] = useState(null); // uploaded document state
  const messagesEndRef = useRef(null);
  const emojiRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (file) => {
  // Har file ko ek unique ID assign kar do
  const uploadedDoc = {
    id: uuidv4(),       // always unique ID
    name: file.name,    // file ka naam
    type: file.type,    // file ka type
    size: file.size,    // file ka size
    file: file          // actual file object
  };

  setUploadedDoc(uploadedDoc); // state me store kar lo
};

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // ---------------- File Upload Handlers ----------------

  const handleDocumentClick = () => {
    fileInputRef.current.setAttribute("data-type", "document");
    fileInputRef.current.click();
  };

  const handleImageClick = () => {
    fileInputRef.current.setAttribute("data-type", "image");
    fileInputRef.current.click();
  };

const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    let response;
    const fileType = fileInputRef.current.getAttribute("data-type");

    const formData = new FormData();
    formData.append("file", file);

    let endpoint = "";
    if (fileType === "document") {
      endpoint = "document";
    } else if (fileType === "image") {
      endpoint = "image";
    } else {
      setChat((prev) => [
        ...prev,
        { sender: "system", text: "⚠️ Unsupported file type." },
      ]);
      return;
    }

    response = await fetch(`http://localhost:5000/rag/upload/${endpoint}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Upload failed on server");
    }

    setChat((prev) => [
      ...prev,
      { sender: "system", text: `✅ Uploaded: ${file.name}` },
    ]);
    console.log("Upload success:", data);
  } catch (err) {
    console.error("Upload error:", err);
    setChat((prev) => [
      ...prev,
      { sender: "system", text: `⚠️ Upload failed: ${err.message}` },
    ]);
  } finally {
    e.target.value = ""; // reset input
  }
};

  const handleLinkUpload = async (url) => {
    try {
      const response = await fetch("http://localhost:5000/rag/upload/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      setChat((prev) => [...prev, { sender: "system", text: `🔗 Link uploaded: ${url}` }]);
      console.log("Link upload success:", data);
    } catch (err) {
      console.error("Link upload error:", err);
      setChat((prev) => [...prev, { sender: "system", text: `⚠️ Link upload failed: ${err.message}` }]);
    }
  };

  // ---------------- Chat Message Handling ----------------

const sendMessage = async () => {
  if (!messages.trim()) return;

  setChat((prev) => [...prev, { sender: "user", text: messages }]);
  setLoading(true);

  try {
    const data = await postRequest("message", { 
      question: messages,      
      useDoc: uploadedDoc ? true : false
    });

    setChat((prev) => [...prev, { sender: "ai", text: data?.replyAI }]);
  } catch (err) {
    console.error("Error:", err.message);
    setChat((prev) => [
      ...prev,
      { sender: "system", text: `⚠️ ${err.message}` }
    ]);
  } finally {
    setMessages("");
    setLoading(false);
  }
};

  // ---------------- Emoji Handling ----------------

  const onEmojiClick = (emojiData) => {
    setMessages((prev) => prev + emojiData.emoji);
    setShowEmoji(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    if (showEmoji) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmoji]);

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <History size={22} style={{ marginRight: "8px" }} />
          Chat History
        </div>
        <div className="chat-history">
          {history.map((chat, i) => (
            <div key={i} className="chat-item">{chat}</div>
          ))}
        </div>
      </div>

      {/* Main Chat Section */}
      <div className="main">
        {/* Header */}
        <div className="main-header">
          <div className="header-avatar">
            <Lottie animationData={AI_ROBOT} loop={true} />
          </div>
          <h2>Shubham Singh Boura</h2>
        </div>

        {/* Chat Messages */}
        <div className="chat-messages">
          {chat?.map((msg, i) => (
            <div key={i} className={`message-row ${msg.sender === "user" ? "user" : msg.sender}`}>
              {msg.sender === "ai" && (
                <div className="bot-avatar">
                  <img src={CHAT_BOT} alt="Bot" />
                </div>
              )}
              <div className={`message-bubble ${msg.sender}-bubble`}>
                {msg.sender === "ai" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="inline-code" {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  msg.text
                )}
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

          <div ref={messagesEndRef} />
        </div>

        {/* Input + Features */}
        <div className="input-section">
          <div className="input-row">
            <input
              value={messages}
              onChange={(e) => setMessages(e.target.value)}
              type="text"
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            <button type="button" className="emoji-btn" onClick={() => setShowEmoji(!showEmoji)}>
              <Smile size={22} />
            </button>

            {showEmoji && (
              <div className="emoji-picker-box" ref={emojiRef}>
                <EmojiPicker onEmojiClick={onEmojiClick} searchDisabled />
              </div>
            )}

            <button className="send-btn" onClick={sendMessage}>
              <Send size={20} color="white" />
            </button>
          </div>

          <div className="feature-row">
            {[
              { label: "Voice Chat", icon: <Mic size={18} />, onClick: () => {} },
              { label: "Document", icon: <FileText size={18} />, onClick: handleDocumentClick },
              {
                label: "Links",
                icon: <Link size={18} />,
                onClick: () => {
                  const url = prompt("Enter a link to upload:");
                  if (url) handleLinkUpload(url);
                },
              },
              { label: "Picture", icon: <Image size={18} />, onClick: handleImageClick },
            ].map((btn, i) => (
              <button key={i} className="feature-btn" onClick={btn.onClick}>
                <span className="feature-icon">{btn.icon}</span>
                {btn.label}
              </button>
            ))}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept=".pdf,.doc,.docx,.txt,image/*"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
