import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Leads from "./pages/Leads";
import Contacts from "./pages/Contacts";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Users from "./pages/Users"; 
import Teams from "./pages/Teams";
import Tickets from "./pages/Tickets";
import NotesAndAttachments from "./pages/NotesAndAttachments";
import Campaigns from "./pages/Campaigns";

import { socketService } from "./services/socketService";

function App() {
  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Used useEffect to manage WebSocket connection based on authentication
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true);
      socketService.connect(token);
    } else {
      setIsAuthenticated(false);
      socketService.disconnect();
    }

    // Add an event listener for login/logout to update auth state
    const handleAuthChange = () => {
      const currentToken = localStorage.getItem("accessToken");
      if (currentToken) {
        setIsAuthenticated(true);
        if (!socketService.getSocket() || socketService.getSocket().readyState === WebSocket.CLOSED) {
          socketService.connect(currentToken);
        }
      } else {
        setIsAuthenticated(false);
        socketService.disconnect();
      }
    };

    // I have a custom event for auth changes(in login)
    window.addEventListener("authChange", handleAuthChange);

    // Cleanup function: disconnect WebSocket when component unmounts
    // or when authentication status changes (e.g., user logs out)
    return () => {
      socketService.disconnect();
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount


  return (
    <Router>
      {/* Pass isAuthenticated and socketService to Navbar */}
      <Navbar isAuthenticated={isAuthenticated} socketService={socketService} />
      <div className="d-flex">
        {/* Render Sidebar only if authenticated */}
        {isAuthenticated && <Sidebar />}
        <div className="flex-grow-1 p-3">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login onLogin={() => window.dispatchEvent(new Event("authChange"))} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/users" element={<Users />} /> 
            <Route path="/teams" element={<Teams />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/notes-attachments" element={<NotesAndAttachments />} /> 
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
