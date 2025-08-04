import React, { useEffect, useState } from "react";
import {
  fetchLeadsWithContacts,
  deleteContact,
  updateContact,
  addContact,
} from "../api/contacts";
import toast from "react-hot-toast";

const Contacts = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
  });

  useEffect(() => {
    const loadLeadsWithContacts = async () => {
      try {
        const data = await fetchLeadsWithContacts();
        setLeads(data);
      } catch (err) {
        toast.error("Error fetching leads with contacts");
      }
    };
    loadLeadsWithContacts();
  }, []);

  const handleViewContacts = (leadId) => {
    const selected = leads.find((lead) => lead.id === leadId);
    setSelectedLead(selected);
    setContacts(selected.contacts || []);
  };

  const handleEditClick = (contact) => {
    setEditingContact(contact.id);
    setFormData({
      name: contact.name,
      email: contact.email,
      phone_number: contact.phone_number,
    });
  };

  const handleDeleteClick = async (contactId) => {
    try {
      await deleteContact(contactId);
      setContacts((prev) => prev.filter((c) => c.id !== contactId));
      toast.success("Contact deleted");
    } catch (err) {
      toast.error("Failed to delete contact");
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // const handleSaveEdit = async () => {
  //   try {
  //     const updated = await updateContact(editingContact, formData);
  //     const updatedContacts = contacts.map((c) =>
  //       c.id === editingContact ? updated : c
  //     );
  //     setContacts(updatedContacts);
  //     setEditingContact(null);
  //     toast.success("Contact updated");
  //   } catch (err) {
  //     toast.error("Failed to update contact");
  //   }
  // };

  const handleSaveEdit = async () => {
    try {
      const updated = await updateContact(editingContact, {
        ...formData,
        lead: selectedLead.id, // ✅ Add this line to include lead
      });

      const updatedContacts = contacts.map((c) =>
        c.id === editingContact ? updated : c
      );
      setContacts(updatedContacts);
      setEditingContact(null);
      toast.success("Contact updated");
    } catch (err) {
      toast.error("Failed to update contact");
      console.error("Update error:", err); // Optional debug log
    }
  };


  const handleAddContact = async () => {
    try {
      const newContact = await addContact({
        ...formData,
        lead: selectedLead.id, 
      });

      setContacts((prev) => [...prev, newContact]);
      setFormData({ name: "", email: "", phone_number: "" });
      toast.success("Contact added");
    } catch (err) {
      toast.error("Failed to add contact");
      console.error("Add contact error:", err); // ✅ log for debugging
    }
  };

  return (
    <div>
      <h2>Leads</h2>
      <ul>
        {leads.map((lead) => (
          <li key={lead.id}>
            {lead.name}{" "}
            <button onClick={() => handleViewContacts(lead.id)}>
              View Contacts
            </button>
          </li>
        ))}
      </ul>

      {selectedLead && (
        <div>
          <h3>Contacts for Lead: {selectedLead.name}</h3>

          {contacts.map((contact) => (
            <div key={contact.id}>
              {editingContact === contact.id ? (
                <div>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                  />
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                  />
                  <input
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="Phone"
                  />
                  <button onClick={handleSaveEdit}>Save</button>
                  <button onClick={() => setEditingContact(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <p>Name: {contact.name}</p>
                  <p>Email: {contact.email}</p>
                  <p>Phone: {contact.phone_number}</p>
                  <button onClick={() => handleEditClick(contact)}>Edit</button>
                  <button onClick={() => handleDeleteClick(contact.id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}

          <h4>Add New Contact</h4>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            placeholder="Phone"
          />
          <button onClick={handleAddContact}>Add Contact</button>
        </div>
      )}
    </div>
  );
};

export default Contacts;
