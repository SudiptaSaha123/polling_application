import React, { useState, useEffect } from "react";
import socket from "../../utils/socket";
import "./Chat.css";

const ChatPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const [activeTab, setActiveTab] = useState("chat");
  const username = sessionStorage.getItem("username");
  const isTeacher = username?.startsWith("teacher");

  useEffect(() => {
    socket.on("chatMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("participantsUpdate", (updatedParticipants) => {
      setParticipants(updatedParticipants);
    });

    socket.emit("joinChat", { username });

    return () => {
      socket.off("chatMessage");
      socket.off("participantsUpdate");
    };
  }, [username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socket.emit("chatMessage", {
        text: newMessage,
        sender: username,
        timestamp: new Date().toISOString(),
      });
      setNewMessage("");
    }
  };

  const handleKickOut = (userToKick) => {
    socket.emit("kickOut", userToKick);
  };

  return (
    <>
      <div
        className={`chat-popover ${isOpen ? "open" : ""}`}
        style={{
          position: "fixed",
          right: "20px",
          bottom: "100px",
          width: "400px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          overflow: "hidden",
          zIndex: 1000,
          display: isOpen ? "flex" : "none",
          flexDirection: "column",
          height: "500px",
        }}
      >
        <div
          className="chat-header"
          style={{ padding: "15px", borderBottom: "1px solid #eee" }}
        >
          <div style={{ display: "flex", gap: "20px", margin: "0" }}>
            <button
              onClick={() => setActiveTab("chat")}
              style={{
                padding: "10px 20px",
                border: "none",
                background: "none",
                borderBottom:
                  activeTab === "chat" ? "2px solid #7565D9" : "none",
                color: activeTab === "chat" ? "#000" : "#666",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab("participants")}
              style={{
                padding: "10px 20px",
                border: "none",
                background: "none",
                borderBottom:
                  activeTab === "participants" ? "2px solid #7565D9" : "none",
                color: activeTab === "participants" ? "#000" : "#666",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Participants
            </button>
          </div>
        </div>

        {activeTab === "chat" ? (
          <>
            <div
              className="chat-messages"
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              {messages.map((message, index) => {
                const isCurrentUser = message.sender === username;
                return (
                  <div
                    key={index}
                    style={{
                      alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                      maxWidth: "80%",
                    }}
                  >
                    {!isCurrentUser && (
                      <div
                        style={{
                          color: "#666",
                          fontSize: "14px",
                          marginBottom: "4px",
                        }}
                      >
                        {message.sender}
                      </div>
                    )}
                    <div
                      style={{
                        background: isCurrentUser ? "#7565D9" : "#f0f0f0",
                        color: isCurrentUser ? "white" : "black",
                        padding: "12px 16px",
                        borderRadius: "18px",
                        wordBreak: "break-word",
                      }}
                    >
                      {message.text}
                    </div>
                  </div>
                );
              })}
            </div>
            <form
              onSubmit={handleSubmit}
              style={{
                padding: "15px",
                borderTop: "1px solid #eee",
                display: "flex",
                gap: "10px",
              }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "12px 24px",
                  background: "#7565D9",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div
            className="participants-list"
            style={{ flex: 1, overflowY: "auto" }}
          >
            <div style={{ padding: "15px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#666",
                  padding: "10px 15px",
                }}
              >
                <span>Name</span>
                {isTeacher && <span>Action</span>}
              </div>
              {participants
                .filter(
                  (participant) =>
                    !participant.startsWith("teacher") ||
                    participant === username
                )
                .map((participant, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "15px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <span style={{ fontWeight: "500" }}>{participant}</span>
                    {isTeacher && !participant.startsWith("teacher") && (
                      <button
                        onClick={() => handleKickOut(participant)}
                        style={{
                          color: "#7565D9",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        Kick out
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#7565D9",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          zIndex: 1000,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
            fill="white"
          />
        </svg>
      </button>
    </>
  );
};

export default ChatPopover;
