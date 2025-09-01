// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaSignOutAlt } from "react-icons/fa"; 
import Notifications from "./Notifications"; 
import { logout as handleUserLogout } from "../services/authService"; 
import axios from 'axios'; 


const API_BASE_URL = "http://localhost:8000/notifications/"; 

const Navbar = ({ isAuthenticated, socketService }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const navigate = useNavigate();

  // Function to fetch notifications from the API
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await axios.get(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(response.data);
      // Check if any notification is unread
      setHasUnread(response.data.some(n => !n.is_read));
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Effect to subscribe to new WebSocket notifications
  useEffect(() => {
    if (isAuthenticated && socketService) {
      // Register callback for new notifications
      const cleanup = socketService.onNotification((newNotification) => {
        console.log("Navbar received new WS notification:", newNotification);
        // Add the new notification to the list, assuming it's unread
        setNotifications(prevNotifications => [
          { ...newNotification, is_read: false, created_at: new Date().toISOString(), id: `ws-${Date.now()}` }, // Assign a temporary ID for client-side
          ...prevNotifications
        ]);
        setHasUnread(true); // Always set to true on new notification
      });

      fetchNotifications();

      // Cleanup function for when component unmounts or isAuthenticated changes
      return cleanup;
    }
  }, [isAuthenticated, socketService]);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
    if (!showDropdown) {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      // Optimistically update UI
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      
      // Send API request to mark as read
      await axios.patch(`${API_BASE_URL}${notificationId}/`, { is_read: true }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Re-check unread status after marking one as read
      setHasUnread(notifications.some(n => n.id !== notificationId && !n.is_read));

    } catch (error) {
      console.error("Error marking notification as read:", error);
      fetchNotifications(); 
    }
  };


  useEffect(() => {
    setHasUnread(notifications.some(n => !n.is_read));
  }, [notifications]);

  const handleLogout = () => {
    handleUserLogout(); 
    window.dispatchEvent(new Event("authChange")); 
    navigate("/login"); 
  };

  // const handleClearAllNotifications = async () => {
  //   try {
  //     const token = localStorage.getItem("accessToken");
  //     if (!token) return;

  //     // Optimistically mark all notifications as read in the UI
  //     setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

  //     // Send API requests to mark each unread notification as read
  //     // We'll filter only unread ones to avoid unnecessary API calls
  //     const unreadNotifications = notifications.filter(n => !n.is_read);
  //     const patchPromises = unreadNotifications.map(notification => 
  //       axios.patch(`${API_BASE_URL}${notification.id}/`, { is_read: true }, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //     );

  //     await Promise.allSettled(patchPromises); // Wait for all patches to settle

  //     // Re-fetch notifications from the backend to ensure full synchronization
  //     await fetchNotifications();
      
  //     // Optionally close the dropdown after clearing all
  //     setShowDropdown(false);

  //   } catch (error) {
  //     console.error("Error clearing all notifications:", error);
  //     fetchNotifications(); // Revert/resync in case of error
  //   }
  // };


  return (
    <nav className="navbar navbar-dark bg-dark px-3 d-flex justify-content-between">
      <Link className="navbar-brand" to="/dashboard"> {/* Changed to dashboard for logged in users */}
        CRM
      </Link>

      <div className="d-flex align-items-center">
        {isAuthenticated && (
          <>
            {/* Notification Bell */}
            <div
              className="position-relative me-3"
              onClick={toggleDropdown}
              style={{ cursor: "pointer" }}
            >
              <FaBell size={22} color="white" />
              {hasUnread && (
                <span
                  className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                  style={{ fontSize: "10px" }}
                />
              )}
            </div>

            {showDropdown && (
              <Notifications 
                notifications={notifications} 
                onMarkAsRead={handleMarkAsRead} 
                // onClearAll={handleClearAllNotifications} 
                onClose={() => setShowDropdown(false)}
              />
            )}

            {/* Logout button for authenticated users */}
            <button onClick={handleLogout} className="btn btn-outline-light ms-2 d-flex align-items-center">
                <FaSignOutAlt className="me-2" />
                Logout
            </button>
          </>
        )}
        {/* Auth buttons */}
         <Link to="/login" className="btn btn-outline-light me-2">
           Login
         </Link>
         <Link to="/signup" className="btn btn-outline-light">
           Signup
         </Link>
      </div>
    </nav>
  );
};

export default Navbar;


