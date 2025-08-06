// import React, { useEffect, useState } from "react";
// import {
//   fetchLeadsWithContacts,
//   deleteContact,
//   updateContact,
//   addContact,
// } from "../api/contacts";
// import toast from "react-hot-toast";

// const Contacts = () => {
//   const [leads, setLeads] = useState([]);
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [contacts, setContacts] = useState([]);
//   const [editingContact, setEditingContact] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone_number: "",
//   });

//   useEffect(() => {
//     const loadLeadsWithContacts = async () => {
//       try {
//         const data = await fetchLeadsWithContacts();
//         setLeads(data);
//       } catch (err) {
//         toast.error("Error fetching leads with contacts");
//       }
//     };
//     loadLeadsWithContacts();
//   }, []);

//   const handleViewContacts = (leadId) => {
//     const selected = leads.find((lead) => lead.id === leadId);
//     setSelectedLead(selected);
//     setContacts(selected.contacts || []);
//   };

//   const handleEditClick = (contact) => {
//     setEditingContact(contact.id);
//     setFormData({
//       name: contact.name,
//       email: contact.email,
//       phone_number: contact.phone_number,
//     });
//   };

//   const handleDeleteClick = async (contactId) => {
//     try {
//       await deleteContact(contactId);
//       setContacts((prev) => prev.filter((c) => c.id !== contactId));
//       toast.success("Contact deleted");
//     } catch (err) {
//       toast.error("Failed to delete contact");
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSaveEdit = async () => {
//     try {
//       const updated = await updateContact(editingContact, {
//         ...formData,
//         lead: selectedLead.id,
//       });

//       const updatedContacts = contacts.map((c) =>
//         c.id === editingContact ? updated : c
//       );
//       setContacts(updatedContacts);
//       setEditingContact(null);
//       toast.success("Contact updated");
//     } catch (err) {
//       toast.error("Failed to update contact");
//     }
//   };

//   const handleAddContact = async () => {
//     try {
//       const newContact = await addContact({
//         ...formData,
//         lead: selectedLead.id,
//       });

//       setContacts([...contacts, newContact]);
//       setFormData({ name: "", email: "", phone_number: "" });
//       toast.success("Contact added successfully");
//     } catch (error) {
//       toast.error("Failed to add contact");
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="text-primary mb-4">Leads</h2>
//       <div className="row">
//         <div className="col-md-4 mb-4">
//           <ul className="list-group shadow-sm">
//             {leads.map((lead) => (
//               <li
//                 key={lead.id}
//                 className={`list-group-item d-flex justify-content-between align-items-center ${
//                   selectedLead?.id === lead.id ? "active text-white" : ""
//                 }`}
//               >
//                 {lead.name}
//                 <button
//                   className={`btn btn-sm ${
//                     selectedLead?.id === lead.id
//                       ? "btn-light text-dark"
//                       : "btn-outline-primary"
//                   }`}
//                   onClick={() => handleViewContacts(lead.id)}
//                 >
//                   View Contacts
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="col-md-8">
//           {selectedLead && (
//             <>
//               <div className="card mb-4 shadow-sm">
//                 <div className="card-body">
//                   <h4 className="card-title">
//                     Contacts for <span className="text-primary">{selectedLead.name}</span>
//                   </h4>
//                   {contacts.length === 0 ? (
//                     <p className="text-muted">No contacts available.</p>
//                   ) : (
//                     contacts.map((contact) => (
//                       <div
//                         key={contact.id}
//                         className="border rounded p-3 mb-3 bg-light"
//                       >
//                         {editingContact === contact.id ? (
//                           <>
//                             <div className="row">
//                               <div className="col-md-4 mb-2">
//                                 <input
//                                   name="name"
//                                   value={formData.name}
//                                   onChange={handleInputChange}
//                                   className="form-control"
//                                   placeholder="Name"
//                                 />
//                               </div>
//                               <div className="col-md-4 mb-2">
//                                 <input
//                                   name="email"
//                                   value={formData.email}
//                                   onChange={handleInputChange}
//                                   className="form-control"
//                                   placeholder="Email"
//                                 />
//                               </div>
//                               <div className="col-md-4 mb-2">
//                                 <input
//                                   name="phone_number"
//                                   value={formData.phone_number}
//                                   onChange={handleInputChange}
//                                   className="form-control"
//                                   placeholder="Phone"
//                                 />
//                               </div>
//                             </div>
//                             <div className="d-flex gap-2 mt-2">
//                               <button
//                                 className="btn btn-success btn-sm"
//                                 onClick={handleSaveEdit}
//                               >
//                                 Save
//                               </button>
//                               <button
//                                 className="btn btn-secondary btn-sm"
//                                 onClick={() => setEditingContact(null)}
//                               >
//                                 Cancel
//                               </button>
//                             </div>
//                           </>
//                         ) : (
//                           <>
//                             <p className="mb-1">
//                               <strong>Name:</strong> {contact.name}
//                             </p>
//                             <p className="mb-1">
//                               <strong>Email:</strong> {contact.email}
//                             </p>
//                             <p className="mb-2">
//                               <strong>Phone:</strong> {contact.phone_number}
//                             </p>
//                             <div className="d-flex gap-2">
//                               <button
//                                 className="btn btn-outline-secondary btn-sm"
//                                 onClick={() => handleEditClick(contact)}
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 className="btn btn-outline-danger btn-sm"
//                                 onClick={() => handleDeleteClick(contact.id)}
//                               >
//                                 Delete
//                               </button>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>

//               <div className="card shadow-sm">
//                 <div className="card-body">
//                   <h5 className="card-title mb-3">Add New Contact</h5>
//                   <div className="row">
//                     <div className="col-md-4 mb-2">
//                       <input
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         className="form-control"
//                         placeholder="Name"
//                       />
//                     </div>
//                     <div className="col-md-4 mb-2">
//                       <input
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         className="form-control"
//                         placeholder="Email"
//                       />
//                     </div>
//                     <div className="col-md-4 mb-2">
//                       <input
//                         name="phone_number"
//                         value={formData.phone_number}
//                         onChange={handleInputChange}
//                         className="form-control"
//                         placeholder="Phone"
//                       />
//                     </div>
//                   </div>
//                   <button
//                     className="btn btn-primary mt-2"
//                     onClick={handleAddContact}
//                   >
//                     Add Contact
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Contacts;


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
    setEditingContact(null);
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

  const handleSaveEdit = async () => {
    try {
      const updated = await updateContact(editingContact, {
        ...formData,
        lead: selectedLead.id,
      });
      setContacts((prev) =>
        prev.map((c) => (c.id === editingContact ? updated : c))
      );
      setEditingContact(null);
      toast.success("Contact updated");
    } catch (err) {
      toast.error("Failed to update contact");
    }
  };

  const handleAddContact = async () => {
    try {
      const newContact = await addContact({
        ...formData,
        lead: selectedLead.id,
      });
      setContacts([...contacts, newContact]);
      setFormData({ name: "", email: "", phone_number: "" });
      toast.success("Contact added successfully");
    } catch (error) {
      toast.error("Failed to add contact");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-primary mb-4 fw-bold">📇 Manage Contacts by Lead</h2>

      <div className="row">
        {/* Left Column – Leads List */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white fw-bold">
              🧑‍💼 Leads
            </div>
            <ul className="list-group list-group-flush">
              {leads.map((lead) => (
                <li
                  key={lead.id}
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    selectedLead?.id === lead.id ? "bg-light fw-bold" : ""
                  }`}
                >
                  {lead.name}
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleViewContacts(lead.id)}
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column – Contacts */}
        <div className="col-md-8">
          {selectedLead && (
            <>
              {/* Contacts List */}
              <div className="card mb-4 shadow-sm border-0">
                <div className="card-header bg-light">
                  <h5 className="mb-0">
                    👥 Contacts for{" "}
                    <span className="text-primary fw-bold">
                      {selectedLead.name}
                    </span>
                  </h5>
                </div>
                <div className="card-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {contacts.length === 0 ? (
                    <p className="text-muted">No contacts available.</p>
                  ) : (
                    contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="border rounded p-3 mb-3 bg-white shadow-sm"
                      >
                        {editingContact === contact.id ? (
                          <>
                            <div className="row g-2">
                              <div className="col-md-4">
                                <input
                                  name="name"
                                  value={formData.name}
                                  onChange={handleInputChange}
                                  className="form-control"
                                  placeholder="Full Name"
                                />
                              </div>
                              <div className="col-md-4">
                                <input
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  className="form-control"
                                  placeholder="Email Address"
                                />
                              </div>
                              <div className="col-md-4">
                                <input
                                  name="phone_number"
                                  value={formData.phone_number}
                                  onChange={handleInputChange}
                                  className="form-control"
                                  placeholder="Phone Number"
                                />
                              </div>
                            </div>
                            <div className="d-flex gap-2 mt-3">
                              <button
                                className="btn btn-success btn-sm"
                                onClick={handleSaveEdit}
                              >
                                ✅ Save
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setEditingContact(null)}
                              >
                                ❌ Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="mb-1">
                              <strong>Name:</strong> {contact.name}
                            </p>
                            <p className="mb-1">
                              <strong>Email:</strong> {contact.email}
                            </p>
                            <p className="mb-2">
                              <strong>Phone:</strong> {contact.phone_number}
                            </p>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => handleEditClick(contact)}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDeleteClick(contact.id)}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add Contact Section */}
              <div className="card shadow-sm border-0">
                <div className="card-header bg-primary text-white">
                  ➕ Add New Contact
                </div>
                <div className="card-body">
                  <div className="row g-2">
                    <div className="col-md-4">
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Full Name"
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Email"
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>
                  <button
                    className="btn btn-primary mt-3 float-end"
                    onClick={handleAddContact}
                  >
                    Add Contact
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contacts;
