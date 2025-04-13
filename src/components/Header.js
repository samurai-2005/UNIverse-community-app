// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import '../styles/Header.css';

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="header">
      <button className="logo">🌌 Universe</button>
      <input type="text" placeholder="Search..." className="search-bar" />
      {currentUser ? (
        <>
          <button className="profile-btn">👤 {currentUser.name}</button>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login" className="login-btn">Login/Signup</Link>
      )}
    </header>
  );
};

export default Header;