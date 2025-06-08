import React, { useState, useEffect, useRef } from "react";
import { Button, Popover, OverlayTrigger, Tab, Nav } from "react-bootstrap";
import Chat from "./Chat";
import socket from "../../utils/socket.js";
import chatIcon from "../../assets/chat.svg";

const ChatPopover = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const chatWindowRef = useRef(null);
  
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
    const username = sessionStorage.getItem("username");
    socket.emit("joinChat", { username });

    socket.on("chatMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    socket.on("participantsUpdate", (participantsList) => {
      setParticipants(participantsList);
    });
    return () => {
      socket.off("participantsUpdate");
      socket.off("chatMessage");
    };
  }, []);

  const username = sessionStorage.getItem("username");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = { user: username, text: newMessage };
      socket.emit("chatMessage", message);
      setNewMessage("");
    }
  };

  const handleKickOut = (participant) => {
    if (username.startsWith("teacher")) {
      socket.emit("kickOut", participant);
      setParticipants(participants.filter((p) => p !== participant));
    }
  };

  const participantsTab = (
    <div className="max-h-[300px] overflow-y-auto px-3 pb-3">
      <div className="flex justify-between items-center text-base font-medium text-gray-500 mb-2">
        <span className="text-[#726F6F] text-[14px]">Name</span>
        {username.startsWith("teacher") ? (
          <span className="flex-1 text-right text-[#726F6F] text-[14px]">Action</span>
        ) : null}
      </div>
      {participants.length === 0 ? (
        <div className="text-gray-400 py-3 text-center text-base">No participants connected</div>
      ) : (
        <div className="flex flex-col gap-2">
          {participants.map((participant, index) => (
            <div className="flex justify-between items-center py-1" key={index}>
              <span className="font-bold text-[14px] text-black flex-2">{participant}</span>
              {username.startsWith("teacher") ? (
                <span className="flex-1 text-right">
                  <button
                    onClick={() => handleKickOut(participant)}
                    className="text-[14px] font-[400] text-[#1D68BD] bg-transparent border-none cursor-pointer p-0 underline"
                  >
                    Kick out
                  </button>
                </span>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const popover = (
    <Popover
      id="chat-popover"
      style={{ width: "400px", height: "400px", fontSize: "12px" }}
    >
      <Popover.Body style={{ height: "100%"}}>
        <Tab.Container defaultActiveKey="chat">
          <Nav className="flex gap-4">
            <Nav.Item>
              <Nav.Link className="text-[14px] font-[400] text-[#4E4A4A] focus:font-[600] focus:text-black" eventKey="chat">
                Chat
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="text-[14px] font-[400] text-[#4E4A4A] focus:font-[600] focus:text-black" eventKey="participants">
                Participants
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content className="">
            <Tab.Pane eventKey="chat">
              <Chat
                messages={messages}
                newMessage={newMessage}
                onMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="participants">{participantsTab}</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger="click"
      placement="top"
      overlay={popover}
      rootClose
    >
      <div
        className="fixed bottom-5 right-5 p-2 bg-[#5A66D1] rounded-full cursor-pointer flex items-center justify-center"
      >
        <img
          className="w-[25px] h-[20px]"
          src={chatIcon}
          alt="chat icon"
        />
      </div>
    </OverlayTrigger>
  );
};

export default ChatPopover;
