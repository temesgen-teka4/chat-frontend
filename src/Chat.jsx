import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./Chat.css";

// Initialize socket connection
const socket = io("http://localhost:5001");

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Fetch stored messages on load
  useEffect(() => {
    fetch("http://localhost:5001/api/chat/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error fetching messages:", err));
  }, []);

  // Listen for new messages via Socket.IO
  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  // Send a new message
  const sendMessage = () => {
    if (message.trim()) {
      const msg = {
        user: "Temesgen",
        text: message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      socket.emit("chat message", msg);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">💬 Real-Time Chat</h2>
      <div className="chat-box">
        {messages.map((msg) => (
          <div key={msg._id || msg.time} className="chat-message">
            <span className="chat-user">{msg.user}</span>
            <span className="chat-time">{msg.time}</span>
            <div className="chat-text">{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
