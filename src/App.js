import React, { useState } from "react";
import axios from 'axios'; // Add this import
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './contexts/AuthProvider';
import Header from "./components/Header";
import HomePage from "./components/Home";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import CommunityPage from "./components/Community";
import "./styles/App.css";

const MainContent = () => (
  <div className="main-content">
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/community/:id" element={<CommunityPage />} />
    </Routes>
  </div>
);

function App() {
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  // Add to main App.js
axios.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

  return (
    <AuthProvider>
      <Router>
        <Header />
        <div className={`app-container ${isLeftCollapsed ? 'collapsed-left' : ''} ${isRightCollapsed ? 'collapsed-right' : ''}`}>
          <LeftSidebar 
            isCollapsed={isLeftCollapsed} 
            setIsCollapsed={setIsLeftCollapsed} 
          />
          <MainContent />
          <RightSidebar 
            isCollapsed={isRightCollapsed} 
            setIsCollapsed={setIsRightCollapsed} 
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;