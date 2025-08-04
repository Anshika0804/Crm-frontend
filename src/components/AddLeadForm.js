// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AddLeadForm = ({ onLeadAdded }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone_number: "",
//     status: "New",
//     assigned_to: "",
//     team: "", // ✅ Added team field
//   });

//   const [users, setUsers] = useState([]);

//   const token = localStorage.getItem("accessToken");

//   // ✅ Fetch all users for the "assigned_to" dropdown
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/users/list/", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUsers(res.data);
//       } catch (err) {
//         console.error("Failed to fetch users", err);
//       }
//     };

//     fetchUsers();
//   }, [token]);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };


// const handleSubmit = async (e) => {
//   e.preventDefault();

//   console.log("Submitting lead with data:", formData);

//   const payload = {
//     name: formData.name,
//     email: formData.email,
//     phone_number: formData.phone_number,
//     status: formData.status,
//     assigned_to: parseInt(formData.assigned_to), // Ensure it's an integer
//     team: formData.team || null, // send team name directly
//   };

//   try {
//     const token = localStorage.getItem("accessToken");

//     const res = await axios.post("http://localhost:8000/api/leads/", payload, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     onLeadAdded?.(res.data); // optional callback after lead creation
//     alert("Lead added!");
//   } catch (err) {
//     console.error("Error creating lead", err.response?.data || err.message);
//     alert("Failed to create lead");
//   }
// };


//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         name="name"
//         placeholder="Name"
//         onChange={handleChange}
//         value={formData.name}
//         required
//       />
//       <input
//         name="email"
//         placeholder="Email"
//         type="email"
//         onChange={handleChange}
//         value={formData.email}
//         required
//       />
//       <input
//         name="phone_number"
//         placeholder="Phone Number"
//         onChange={handleChange}
//         value={formData.phone_number}
//         required
//       />

//       <select name="status" onChange={handleChange} value={formData.status}>
//         <option value="New">New</option>
//         <option value="Contacted">Contacted</option>
//         <option value="Qualified">Qualified</option>
//         <option value="Lost">Lost</option>
//       </select>

//       <select
//         name="assigned_to"
//         onChange={handleChange}
//         value={formData.assigned_to}
//         required
//       >
//         <option value="">Assign to</option>
//         {users.map((user) => (
//           <option key={user.id} value={user.id}>
//             {user.name || user.username || user.email}
//           </option>
//         ))}
//       </select>
//       <div className="form-group">
//   <label htmlFor="team">Team</label>
//   <select
//     className="form-control"
//     id="team"
//     name="team"
//     value={formData.team || ""}
//     onChange={handleChange}
//   >
//     <option value="">Select a team</option>
//     {teams.map((team) => (
//       <option key={team.id} value={team.name}>
//         {team.name}
//       </option>
//     ))}
//   </select>
// </div>

//       <button type="submit">Add Lead</button>
//     </form>
//   );
// };

// export default AddLeadForm;


import React, { useEffect, useState } from "react";
import axios from "axios";

const AddLeadForm = ({ onLeadAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    status: "New",
    assigned_to: "",
    team: "", // ✅ team name (string)
  });

  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]); // ✅ Store team list

  const token = localStorage.getItem("accessToken");

  // ✅ Fetch all users for assignment
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/users/list/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, [token]);

  // ✅ Fetch all teams (using name)
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/teams/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeams(res.data); // Assume each team has .id and .name
      } catch (err) {
        console.error("Failed to fetch teams", err);
      }
    };
    fetchTeams();
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone_number,
      status: formData.status,
      assigned_to: parseInt(formData.assigned_to), // convert string to int
      team: formData.team || null, // ✅ send team name (string) or null
    };

    try {
      const res = await axios.post("http://localhost:8000/api/leads/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onLeadAdded?.(res.data);
      alert("Lead added successfully!");
      setFormData({
        name: "",
        email: "",
        phone_number: "",
        status: "New",
        assigned_to: "",
        team: "",
      });
    } catch (err) {
      console.error("Error creating lead", err.response?.data || err.message);
      alert("Failed to create lead");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        value={formData.name}
        required
      />
      <input
        name="email"
        placeholder="Email"
        type="email"
        onChange={handleChange}
        value={formData.email}
        required
      />
      <input
        name="phone_number"
        placeholder="Phone Number"
        onChange={handleChange}
        value={formData.phone_number}
        required
      />

      <select name="status" onChange={handleChange} value={formData.status}>
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Qualified">Qualified</option>
        <option value="Lost">Lost</option>
      </select>

      <select
        name="assigned_to"
        onChange={handleChange}
        value={formData.assigned_to}
        required
      >
        <option value="">Assign to</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name || user.username || user.email}
          </option>
        ))}
      </select>

      <select
        name="team"
        value={formData.team}
        onChange={handleChange}
        required
      >
        <option value="">Select a team</option>
        {teams.map((team) => (
          <option key={team.id} value={team.name}>
            {team.name}
          </option>
        ))}
      </select>

      <button type="submit">Add Lead</button>
    </form>
  );
};

export default AddLeadForm;
