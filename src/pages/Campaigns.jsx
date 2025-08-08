import React, { useEffect, useState } from "react";
import {
  fetchCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "../api/campaigns";
import toast from "react-hot-toast";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "draft",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load campaigns on mount
  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await fetchCampaigns();
      setCampaigns(data);
    } catch (err) {
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.start_date || !form.end_date) {
      toast.error("Please fill required fields: name, start date, end date");
      return;
    }

    try {
      if (editingId) {
        // Update
        await updateCampaign(editingId, form);
        toast.success("Campaign updated");
      } else {
        // Create
        await createCampaign(form);
        toast.success("Campaign created");
      }
      setForm({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "draft",
      });
      setEditingId(null);
      loadCampaigns();
    } catch (err) {
      toast.error("Failed to save campaign");
    }
  };

  const handleEdit = (campaign) => {
    setEditingId(campaign.id);
    setForm({
      name: campaign.name,
      description: campaign.description,
      start_date: campaign.start_date,
      end_date: campaign.end_date,
      status: campaign.status,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this campaign?")) return;
    try {
      await deleteCampaign(id);
      toast.success("Campaign deleted");
      loadCampaigns();
    } catch {
      toast.error("Failed to delete campaign");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Campaigns</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-2">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            className="form-control"
            rows={3}
          />
        </div>

        <div className="mb-2">
          <label>Start Date *</label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-2">
          <label>End Date *</label>
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-2">
          <label>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="draft">Draft</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          {editingId ? "Update Campaign" : "Create Campaign"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditingId(null);
              setForm({
                name: "",
                description: "",
                start_date: "",
                end_date: "",
                status: "draft",
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h3>Existing Campaigns</h3>

      {loading ? (
        <p>Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((camp) => (
              <tr key={camp.id}>
                <td>{camp.name}</td>
                <td>{camp.start_date}</td>
                <td>{camp.end_date}</td>
                <td>{camp.status}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(camp)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(camp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Campaigns;
