import React from "react";
import { Link } from "react-router-dom";
import "../styles/LeftSidebar.css";


const LeftSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`left-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isCollapsed ? "▶" : "◀"}
      </button>
      {!isCollapsed && (
        <>
          <h3>Communities</h3>
          <ul>
            <li><Link to="/community/ai">🚀 AI/ML</Link></li>
            <li><Link to="/community/cybersecurity">🔒 Cybersecurity</Link></li>
            <li><Link to="/community/fullstack">💻 Full Stack</Link></li>
          </ul>
        </>
      )}
    </div>
  );
};

export default LeftSidebar;
