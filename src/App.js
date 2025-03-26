// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import CommunityPage from "./components/Community";
import "./styles/App.css";

function App() {
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  return (
    <Router>
      <Header />
      <div className={`app-container ${isLeftCollapsed ? "collapsed-left" : ""} ${isRightCollapsed ? "collapsed-right" : ""}`}>
        <LeftSidebar setIsLeftCollapsed={setIsLeftCollapsed} />
        <div className="main-content">
          <Routes>
            <Route path="/community/:id" element={<CommunityPage />} />
          </Routes>
        </div>
        <RightSidebar setIsRightCollapsed={setIsRightCollapsed} />
      </div>
    </Router>
  );
}

export default App;
