import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>🌌 UNIVERSE</h2>
      <nav>
        <h3>Communities</h3>
        <ul>
          <li><Link to="/community/ai">🚀 AI/ML</Link></li>
          <li><Link to="/community/cybersecurity">🔒 Cybersecurity</Link></li>
          <li><Link to="/community/fullstack">💻 Full Stack</Link></li>
          <li><Link to="/community/iot">🌐 IoT</Link></li>
        </ul>
        <h3>Recommended Communities</h3>
        <ul>
          <li><Link to="/community/bca">✈ BCA Community</Link></li>
          <li><Link to="/community/bba">✈ BBA Community</Link></li>
        </ul>
      </nav>

      {/* Profile Button */}
      <div className="profile-section">
        <Link to="/profile" className="profile-btn">👤 Profile</Link>
      </div>
    </div>
  );
};

export default Sidebar;
