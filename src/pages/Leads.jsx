import React, { useEffect, useState } from "react";
import { fetchExtendedLeads, deleteLead, updateLead } from "../api/leads";
import AddLeadForm from "../components/AddLeadForm";
import {
  Table,
  Button,
  Container,
  Form,
  Card,
  Badge,
} from "react-bootstrap";

const Lead = () => {
  const [leads, setLeads] = useState([]);
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [formData, setFormData] = useState({});

  const loadLeads = async () => {
    try {
      const data = await fetchExtendedLeads();
      setLeads(data);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    }
  };

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    loadLeads();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteLead(id);
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
      } catch (err) {
        console.error("Error deleting lead:", err);
      }
    }
  };

  const handleEdit = (lead) => {
    setEditingLeadId(lead.id);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone_number: lead.phone_number,
      status: lead.status,
    });
  };

  const handleCancel = () => {
    setEditingLeadId(null);
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
      const updated = await updateLead(id, formData);
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, ...updated } : lead))
      );
      setEditingLeadId(null);
      setFormData({});
    } catch (err) {
      console.error("Error updating lead:", err);
    }
  };

  const getStatusBadge = (status) => {
    const variantMap = {
      New: "primary",
      Contacted: "info",
      Qualified: "success",
      Lost: "secondary",
      Canceled: "dark",
      Confirmed: "warning",
    };
    return <Badge bg={variantMap[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm p-4 border-0">
        <h2 className="text-center text-primary mb-4">Leads Dashboard</h2>

        {/* Add Lead Form */}
        <Card className="mb-4 shadow-sm p-3">
          <AddLeadForm onLeadAdded={loadLeads} />
        </Card>

        <div className="table-responsive">
          <Table bordered hover responsive className="align-middle shadow-sm">
            <thead className="table-primary text-center">
              <tr>
                <th>ID</th>
                <th>Lead Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Assigned By</th>
                <th>Assigned To</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="text-center">{lead.id}</td>
                  <td>
                    {editingLeadId === lead.id ? (
                      <Form.Control
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        size="sm"
                      />
                    ) : (
                      lead.name
                    )}
                  </td>
                  <td>
                    {editingLeadId === lead.id ? (
                      <Form.Control
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        size="sm"
                      />
                    ) : (
                      lead.email
                    )}
                  </td>
                  <td>
                    {editingLeadId === lead.id ? (
                      <Form.Control
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        size="sm"
                      />
                    ) : (
                      lead.phone_number
                    )}
                  </td>
                  <td className="text-center">
                    {editingLeadId === lead.id ? (
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        size="sm"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Lost">Lost</option>
                        <option value="Canceled">Canceled</option>
                        <option value="Confirmed">Confirmed</option>
                      </Form.Select>
                    ) : (
                      getStatusBadge(lead.status)
                    )}
                  </td>
                  <td>{lead.assigned_by_name || "—"}</td>
                  <td>{lead.assigned_to_name || "—"}</td>
                  <td>{new Date(lead.created_at).toLocaleString()}</td>
                  <td className="text-center">
                    {editingLeadId === lead.id ? (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2 rounded-pill"
                          onClick={() => handleSave(lead.id)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="rounded-pill"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2 rounded-pill"
                          onClick={() => handleEdit(lead)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="rounded-pill"
                          onClick={() => handleDelete(lead.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </Container>
  );
};

export default Lead;
