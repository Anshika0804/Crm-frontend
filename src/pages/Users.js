import React, { useEffect, useState } from "react";
import { fetchUsersWithLeads } from "../api/users";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const loadUsersWithLeads = async () => {
      try {
        const data = await fetchUsersWithLeads();
        setUsers(data);
      } catch (err) {
        toast.error("Error fetching users with leads");
      }
    };
    loadUsersWithLeads();
  }, []);

  const handleViewLeads = (userId) => {
    const selected = users.find((user) => user.id === userId);
    setSelectedUser(selected);
    setLeads(selected.leads || []);
  };

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name || user.email}{" "}
            <button onClick={() => handleViewLeads(user.id)}>View Leads</button>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div>
          <h3>Leads for User: {selectedUser.name || selectedUser.email}</h3>

          {leads.length > 0 ? (
            leads.map((lead) => (
              <div key={lead.id} className="border p-2 mb-2">
                <p>Name: {lead.name || `${lead.first_name} ${lead.last_name}`}</p>
                <p>Email: {lead.email}</p>
                <p>Status: {lead.status}</p>
                <p>Phone: {lead.phone_number}</p>
              </div>
            ))
          ) : (
            <p>No leads for this user</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
