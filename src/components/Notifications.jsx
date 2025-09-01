// src/components/Notifications.jsx
import React from "react";
import { formatDistanceToNow } from 'date-fns'; 


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
                // Navigate to lead detail page or perform other action
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
