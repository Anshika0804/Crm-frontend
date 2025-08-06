import React, { useEffect, useState } from "react";
import { fetchExtendedUsers, deleteUser, updateUser } from "../api/users";
import { Table, Button, Form, Container } from "react-bootstrap";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({});
  const [expandedUserId, setExpandedUserId] = useState(null); // ✅ FIXED

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

  const handleToggleLeads = (userId) => {
    setExpandedUserId((prev) => (prev === userId ? null : userId));
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-primary">Users List</h2>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Role</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <React.Fragment key={user.id}>
              <tr
                onClick={() => handleToggleLeads(user.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{user.id}</td>
                <td>
                  {editingUserId === user.id ? (
                    <Form.Control
                      size="sm"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingUserId === user.id ? (
                    <Form.Control
                      size="sm"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingUserId === user.id ? (
                    <Form.Select
                      size="sm"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="team_lead">Team Lead</option>
                      <option value="agent">Agent</option>
                      <option value="custom">Custom User</option>
                    </Form.Select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="text-center">
                  {editingUserId === user.id ? (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleSave(user.id)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        className="me-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(user);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(user.id);
                        }}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              </tr>

              {/* Expanded Leads Row */}
              {expandedUserId === user.id && user.leads && (
                <tr>
                  <td colSpan="5">
                    <div className="p-3 bg-light rounded">
                      <h6 className="mb-3 text-secondary">Assigned Leads</h6>
                      {user.leads.length > 0 ? (
                        <ul className="list-group">
                          {user.leads.map((lead) => (
                            <li
                              key={lead.id}
                              className="list-group-item d-flex justify-content-between align-items-center"
                            >
                              <span>
                                <strong>{lead.name}</strong> ({lead.status})
                              </span>
                              <span className="text-muted">{lead.email}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted">
                          No leads assigned to this user.
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Users;
