import { useState, useRef } from "react";
import { useChatBot } from "../../context/ChatBotContext";

// ChatBot component - floating chat widget for user support
export function ChatBot() {
  // Track if chat window is open/closed - use context
  const { isOpen, setIsOpen } = useChatBot();
  // Store user's current message input
  const [message, setMessage] = useState("");
  // Store all messages in conversation (user and bot)
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you?" },
  ]);
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Start voice recording
  const startVoiceInput = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstart = () => {
        setIsRecording(true);
      };

      mediaRecorder.onstop = () => {
        setIsRecording(false);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        // In a real app, you would send this to a speech-to-text API
        // For now, we'll add a placeholder message
        setMessages((prev) => [
          ...prev,
          { from: "user", text: "[Voice message received]" },
        ]);
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  // Stop voice recording
  const stopVoiceInput = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Send message from user
  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { from: "user", text: message }]);
    setMessage("");
  };

  // Text-to-speech functionality
  const speakMessage = (text) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech not supported in this browser");
    }
  };

  return (
    <div>
      {/* Floating Bot Button */}
      <div style={styles.fab} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <i className="bi bi-x-lg" style={{ fontSize: "24px" }}></i>
        ) : (
          <i className="bi bi-chat-dots" style={{ fontSize: "24px" }}></i>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <div style={styles.headerContent}>
              <span>Ask Me</span>
              <button
                onClick={() => setIsOpen(false)}
                style={styles.closeBtn}
                title="Close chat"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
          </div>

          <div style={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.message,
                  alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                  background: m.from === "user" ? "#007bff" : "#e9ecef",
                  color: m.from === "user" ? "#fff" : "#000",
                }}
              >
                <div>{m.text}</div>
                {m.from === "bot" && (
                  <button
                    onClick={() => speakMessage(m.text)}
                    style={styles.speakBtn}
                    title="Read message"
                    disabled={isSpeaking}
                  >
                    <i className="bi bi-volume-up"></i>
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={styles.inputArea}>
            <input
              style={styles.input}
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            {/* Mic Button */}
            <button
              style={{
                ...styles.iconBtn,
                background: isRecording ? "#dc3545" : "#fff",
                color: isRecording ? "#fff" : "#666",
              }}
              onClick={isRecording ? stopVoiceInput : startVoiceInput}
              title={isRecording ? "Stop recording" : "Start voice input"}
            >
              <i className={`bi ${isRecording ? "bi-stop-circle" : "bi-mic"}`}></i>
            </button>

            {/* Send Button */}
            <button
              style={styles.sendBtn}
              onClick={sendMessage}
              title="Send message"
            >
              <i className="bi bi-send"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  fab: {
    position: "fixed",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(40, 167, 69, 0.4)",
    zIndex: 1000,
    border: "none",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  chatWindow: {
    position: "fixed",
    bottom: 90,
    right: 20,
    width: 320,
    height: 450,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 5px 25px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    zIndex: 1000,
    border: "1px solid #e0e0e0",
  },
  header: {
    padding: "12px 16px",
    background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
    color: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    fontWeight: "600",
    fontSize: "16px",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    color: "#fff",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "18px",
    transition: "background 0.2s ease",
  },
  messages: {
    flex: 1,
    padding: "12px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    backgroundColor: "#f8f9fa",
  },
  message: {
    maxWidth: "75%",
    padding: "8px 12px",
    borderRadius: 8,
    fontSize: 14,
    lineHeight: "1.4",
    display: "flex",
    alignItems: "flex-end",
    gap: "6px",
    wordWrap: "break-word",
  },
  speakBtn: {
    background: "none",
    border: "none",
    color: "inherit",
    cursor: "pointer",
    fontSize: "12px",
    padding: "2px 4px",
    opacity: 0.7,
    transition: "opacity 0.2s ease",
  },
  inputArea: {
    display: "flex",
    gap: "6px",
    padding: "10px",
    borderTop: "1px solid #e0e0e0",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: "center",
  },
  input: {
    flex: 1,
    border: "1px solid #ddd",
    padding: "8px 12px",
    outline: "none",
    borderRadius: "20px",
    fontSize: "14px",
    fontFamily: "inherit",
    transition: "border-color 0.2s ease",
  },
  iconBtn: {
    background: "#fff",
    border: "1px solid #ddd",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "18px",
    transition: "all 0.2s ease",
    color: "#666",
  },
  sendBtn: {
    background: "#28a745",
    border: "none",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "18px",
    color: "#fff",
    transition: "background 0.2s ease",
  },
};
export default ChatBot;
