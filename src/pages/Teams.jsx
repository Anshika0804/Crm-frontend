import React, { useEffect, useState } from "react";
import {
  fetchTeamsWithUsers,
  createTeam,
  updateTeam,
  deleteTeam,
  assignUsersToTeam,
  removeUsersFromTeam,
} from "../api/teams";
import { FaEdit, FaTrash, FaUserPlus, FaUserMinus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [assigningTeamId, setAssigningTeamId] = useState(null);

  useEffect(() => {
    loadTeams();
    fetchUsers();
  }, []);

  const loadTeams = async () => {
    try {
      const data = await fetchTeamsWithUsers();
      setTeams(data);
    } catch (err) {
      console.error("Failed to load teams:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        "https://advanced-crm.onrender.com/api/users/users-with-leads/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setAllUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTeam(editingId, formData);
        setEditingId(null);
      } else {
        await createTeam(formData);
      }
      setFormData({ name: "", description: "" });
      loadTeams();
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  const handleEdit = (team) => {
    setFormData({ name: team.name, description: team.description });
    setEditingId(team.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTeam(id);
      loadTeams();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleAssignUsers = async () => {
    try {
      await assignUsersToTeam(assigningTeamId, selectedUsers);
      setAssigningTeamId(null);
      setSelectedUsers([]);
      loadTeams();
    } catch (err) {
      console.error("Assigning users failed:", err);
    }
  };

  const handleRemoveUser = async (teamId, userId) => {
    try {
      await removeUsersFromTeam(teamId, [userId]);
      loadTeams();
    } catch (err) {
      console.error("Removing user failed:", err);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Team Management</h2>

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Team Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="description"
            className="form-control"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <button type="submit" className="btn btn-primary w-100">
            {editingId ? "Update Team" : "Create Team"}
          </button>
        </div>
      </form>

      <div className="row">
        {teams.map((team) => (
          <div key={team.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{team.name}</h5>
                <p className="card-text text-muted">{team.description}</p>

                <div className="mb-2">
                  <strong>Users:</strong>
                  {team.users.length === 0 ? (
                    <p className="text-muted">None</p>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {team.users.map((user) => (
                        <li
                          key={user.id}
                          className="list-group-item d-flex justify-content-between align-items-center px-0"
                        >
                          {user.name} ({user.email})
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveUser(team.id, user.id)}
                          >
                            <FaUserMinus />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="d-flex justify-content-between mt-3">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleEdit(team)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(team.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => setAssigningTeamId(team.id)}
                  >
                    <FaUserPlus /> Assign Users
                  </button>
                </div>

                {assigningTeamId === team.id && (
                  <div className="mt-3">
                    <h6 className="fw-bold">Assign Users</h6>
                    <select
                      multiple
                      className="form-select mb-2"
                      value={selectedUsers}
                      onChange={(e) =>
                        setSelectedUsers(
                          Array.from(
                            e.target.selectedOptions,
                            (opt) => opt.value
                          )
                        )
                      }
                    >
                      {allUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={handleAssignUsers}
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teams;
