import React, { useEffect, useState } from "react";
import {
  fetchTeamsWithUsers,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../api/teams";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const data = await fetchTeamsWithUsers();
      setTeams(data);
    } catch (err) {
      console.error("Failed to load teams:", err);
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

  return (
    <div>
      <h2>Teams</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Team Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? "Update" : "Create"}</button>
      </form>

      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            <strong>{team.name}</strong> - {team.description} <br />
            <em>Users: {team.users.map((u) => u.name).join(", ")}</em>
            <br />
            <button onClick={() => handleEdit(team)}>Edit</button>
            <button onClick={() => handleDelete(team.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Teams;
