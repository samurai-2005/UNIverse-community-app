// Header.js (New Header Component)
import React, { useState } from "react";
import "../styles/Header.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="header">
      <button className="logo" onClick={() => window.scrollTo(0, 0)}>🌌 Universe</button>
      <input type="text" placeholder="Search..." className="search-bar" />
      <button className="notification-btn">🔔</button>
      {isLoggedIn ? (
        <button className="profile-btn">👤 Profile</button>
      ) : (
        <button className="login-btn" onClick={() => setIsLoggedIn(true)}>Login/Signup</button>
      )}
    </header>
  );
};

export default Header;