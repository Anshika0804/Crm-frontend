// import React, { useEffect, useState } from "react";
// import { fetchUsersWithLeads } from "../api/users";
// import toast from "react-hot-toast";

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [leads, setLeads] = useState([]);

//   useEffect(() => {
//     const loadUsersWithLeads = async () => {
//       try {
//         const data = await fetchUsersWithLeads();
//         setUsers(data);
//       } catch (err) {
//         toast.error("Error fetching users with leads");
//       }
//     };
//     loadUsersWithLeads();
//   }, []);

//   const handleViewLeads = (userId) => {
//     const selected = users.find((user) => user.id === userId);
//     setSelectedUser(selected);
//     setLeads(selected.leads || []);
//   };

//   return (
//     <div>
//       <h2>Users</h2>
//       <ul>
//         {users.map((user) => (
//           <li key={user.id}>
//             {user.name || user.email}{" "}
//             <button onClick={() => handleViewLeads(user.id)}>View Leads</button>
//           </li>
//         ))}
//       </ul>

//       {selectedUser && (
//         <div>
//           <h3>Leads for User: {selectedUser.name || selectedUser.email}</h3>

//           {leads.length > 0 ? (
//             leads.map((lead) => (
//               <div key={lead.id} className="border p-2 mb-2">
//                 <p>Name: {lead.name || `${lead.first_name} ${lead.last_name}`}</p>
//                 <p>Email: {lead.email}</p>
//                 <p>Status: {lead.status}</p>
//                 <p>Phone: {lead.phone_number}</p>
//               </div>
//             ))
//           ) : (
//             <p>No leads for this user</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Users;


// src/pages/Users.js
import React, { useEffect, useState } from "react";
import { fetchExtendedUsers, deleteUser, updateUser } from "../api/users";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({});

  const loadUsers = async () => {
    try {
      const data = await fetchExtendedUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        setUsers((prev) => prev.filter((user) => user.id !== id));
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (id) => {
    try {
      const updated = await updateUser(id, formData);
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, ...updated } : user))
      );
      setEditingUserId(null);
      setFormData({});
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Users List</h2>

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editingUserId === user.id ? (
                  <input name="name" value={formData.name} onChange={handleChange} />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <input name="email" value={formData.email} onChange={handleChange} />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="team_lead">Team Lead</option>
                    <option value="agent">Agent</option>
                    <option value="custom">Custom User</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <>
                    <button onClick={() => handleSave(user.id)}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
