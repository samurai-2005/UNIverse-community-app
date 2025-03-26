import React from "react";
import "../styles/ChatBox.css";

const ChatBox = () => {
  return (
    <div className="chatbox-container">
      <h3>Chat</h3>
      <div className="chat-messages">Messages will appear here...</div>
      <input type="text" placeholder="Type a message..." />
    </div>
  );
};

export default ChatBox;
