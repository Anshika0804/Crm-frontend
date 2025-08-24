// import React, { useEffect, useState } from "react";
// import socketService from "../services/socketService";

// // Custom hook for notifications
// export const useNotifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);

//   useEffect(() => {
//     // Connect socket only if not connected
//     socketService.connect();

//     const handleNewNotification = (data) => {
//       setNotifications((prev) => [data, ...prev]);
//       setUnreadCount((prev) => prev + 1);
//     };

//     socketService.subscribe(handleNewNotification);

//     return () => {
//       socketService.unsubscribe(handleNewNotification);
//     };
//   }, []);

//   const markAsRead = () => setUnreadCount(0);

//   return { notifications, unreadCount, markAsRead };
// };

// // Red Dot component for Navbar
// export const RedDot = ({ count }) => {
//   return count > 0 ? (
//     <span
//       style={{
//         position: "absolute",
//         top: 0,
//         right: 0,
//         width: "10px",
//         height: "10px",
//         background: "red",
//         borderRadius: "50%",
//       }}
//     />
//   ) : null;
// };

// // Dropdown component for Navbar
// export const Dropdown = ({ notifications, markAsRead }) => {
//   useEffect(() => {
//     markAsRead();
//   }, [markAsRead]);

//   return (
//     <div
//       style={{
//         position: "absolute",
//         top: "30px",
//         right: 0,
//         width: "250px",
//         maxHeight: "400px",
//         overflowY: "auto",
//         background: "#fff",
//         boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
//         borderRadius: "5px",
//         zIndex: 1000,
//         padding: "10px",
//       }}
//     >
//       {notifications.length === 0 ? (
//         <p style={{ margin: 0 }}>No notifications</p>
//       ) : (
//         notifications.map((n, index) => (
//           <div
//             key={index}
//             style={{
//               padding: "5px",
//               borderBottom: "1px solid #eee",
//             }}
//           >
//             {n.message}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// // Default export for the notifications page route
// const NotificationsPage = () => {
//   const { notifications, markAsRead } = useNotifications();

//   return (
//     <div className="p-3">
//       <h2>Notifications</h2>
//       <Dropdown notifications={notifications} markAsRead={markAsRead} />
//     </div>
//   );
// };

// export default NotificationsPage;



// src/components/Notifications.jsx
import React from "react";
import { formatDistanceToNow } from 'date-fns'; // For better date formatting

// You might need to install date-fns: npm install date-fns

const Notifications = ({ notifications, onMarkAsRead, onClose }) => {
  return (
    <div 
      className="dropdown-menu show position-absolute end-0 mt-2 p-2 shadow rounded-3" 
      style={{ minWidth: '300px', maxHeight: '400px', overflowY: 'auto', zIndex: 1050 }}
      // Prevent closing dropdown when clicking inside it
      onClick={(e) => e.stopPropagation()} 
    >
      <h6 className="dropdown-header text-primary fw-bold">Notifications</h6>
      <div className="dropdown-divider"></div>
      {notifications.length === 0 ? (
        <p className="text-center text-muted m-0 p-3">No new notifications</p>
      ) : (
        notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`dropdown-item d-flex align-items-start py-2 px-3 ${!notification.is_read ? 'bg-light fw-bold' : ''}`}
            style={{ cursor: 'pointer', whiteSpace: 'normal' }}
            onClick={() => {
                if (!notification.is_read) {
                    onMarkAsRead(notification.id);
                }
                // Optionally navigate to lead detail page or perform other action
                // if (notification.lead_id) {
                //   onClose(); // Close dropdown after action
                //   // navigate(`/leads/${notification.lead_id}`); 
                // }
            }}
          >
            <div className="flex-grow-1">
              {notification.message}
              <small className="d-block text-muted mt-1">
                {notification.created_at ? formatDistanceToNow(new Date(notification.created_at), { addSuffix: true }) : 'Just now'}
              </small>
            </div>
            {!notification.is_read && (
              <span 
                className="badge bg-danger rounded-pill ms-2"
                style={{ flexShrink: 0 }}
              >
                New
              </span>
            )}
          </div>
        ))
      )}
      <div className="dropdown-divider"></div>
      <button 
        className="btn btn-sm btn-outline-secondary w-100 mt-2"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default Notifications;
