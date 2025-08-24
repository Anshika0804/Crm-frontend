import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-light p-3" style={{ width: "200px", minHeight: "100vh" }}>
      <ul className="nav flex-column">
        <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/users">Users</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/leads">Leads</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/contacts">Contacts</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/teams">Teams</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/tickets">Tickets</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/notes-attachments">Notes & Attachments</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/campaigns">Campaigns</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/notifications">Notifications</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
