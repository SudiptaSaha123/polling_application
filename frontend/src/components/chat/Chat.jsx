import React, { useEffect } from "react";
import { Button, Form } from "react-bootstrap";

const Chat = ({ messages, newMessage, onMessageChange, onSendMessage }) => {
  const username = sessionStorage.getItem("username");

  useEffect(() => {
    const chatWindow = document.getElementById("chat-window");
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }, [messages]);

  // Handle Enter key to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex flex-col justify-between">
      <div
        id="chat-window"
        className="flex-1 overflow-y-auto flex flex-col mb-2"
      >
        {messages.length === 0 ? (
          <div className="text-gray-400 text-left text-sm ml-[17px] mt-[8px]">
            No messages yet
          </div>
        ) : (
          messages.map((msg, index) => {
            const isCurrentUser = msg.user === username;
            return (
              <div
                key={index}
                className={`flex flex-col gap-0.5 ${isCurrentUser ? "items-end" : "items-start"}`}
              >
                <span className="text-[#4F0BD3] font-medium text-xs mb-[2px]">
                  {msg.user}
                </span>
                <span
                  className={`text-left ${isCurrentUser ? "bg-[#4F0BD3]" : "bg-[#3A3A3B]"} max-w-[694px] rounded-[32px] rounded-tr-[1px] rounded-tl-[8px] rounded-b-[8px] py-[9px] pl-[9px] pr-[10.5px] text-white`}
                >
                  {msg.text}
                </span>
              </div>
            );
          })
        )}
      </div>
      <form
        className="flex items-center gap-2 mt-2 fixed bottom-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSendMessage();
        }}
      >
        <Form.Control
          type="text"
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="text-sm rounded-lg border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-400 px-3 py-2 bg-white flex-1"
        />
        <Button
          type="submit"
          className="rounded-lg border-none text-sm bg-gray-900 text-white py-2 shadow-sm hover:bg-gray-800 transition-colors mr-3"
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default Chat;
