// RightSidebar.js
import React, { useState } from "react";
import "../styles/RightSidebar.css";

const RightSidebar = ({ setIsRightCollapsed }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setIsRightCollapsed(!isCollapsed);
  };

  return (
    <div className={`right-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>{isCollapsed ? "◀" : "▶"}</button>
      {!isCollapsed && (
        <>
          <h3>🔗 Connections</h3>
          <ul>
            <li>🟢 John Doe</li>
            <li>🟢 Jane Smith</li>
          </ul>
          <div className="chatbox">
            <h4>💬 Chat</h4>
            <input type="text" placeholder="Type a message..." />
          </div>
        </>
      )}
    </div>
  );
};

export default RightSidebar;