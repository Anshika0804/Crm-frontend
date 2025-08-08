// import React from "react";
// import { Card, Container, Row, Col, Button } from "react-bootstrap";
// import { FaUsers, FaUserCheck, FaChartLine } from "react-icons/fa";

// function Dashboard() {
//   return (
//     <Container fluid className="mt-4">
//       <Row className="mb-4">
//         <Col>
//           <Card className="shadow text-white bg-primary">
//             <Card.Body>
//               <h2>Welcome to Your CRM Dashboard</h2>
//               <p>Manage your leads, clients, and sales all in one place!</p>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Row className="mb-4">
//         <Col md={4}>
//           <Card className="shadow-sm">
//             <Card.Body className="text-center">
//               <FaUsers size={40} className="mb-3 text-primary" />
//               <h5>Total Leads</h5>
//               <h3>1,254</h3>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={4}>
//           <Card className="shadow-sm">
//             <Card.Body className="text-center">
//               <FaUserCheck size={40} className="mb-3 text-success" />
//               <h5>Active Clients</h5>
//               <h3>875</h3>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={4}>
//           <Card className="shadow-sm">
//             <Card.Body className="text-center">
//               <FaChartLine size={40} className="mb-3 text-warning" />
//               <h5>Sales This Month</h5>
//               <h3>₹2,34,000</h3>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Row>
//         <Col md={6}>
//           <Card className="shadow-sm">
//             <Card.Header>Quick Actions</Card.Header>
//             <Card.Body>
//               <Button variant="outline-primary" className="me-2 mb-2">+ Add New Lead</Button>
//               <Button variant="outline-success" className="me-2 mb-2">View All Leads</Button>
//               <Button variant="outline-warning" className="mb-2">Generate Report</Button>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={6}>
//           <Card className="shadow-sm">
//             <Card.Header>System Status</Card.Header>
//             <Card.Body>
//               <ul className="list-unstyled">
//                 <li><strong>Server:</strong> Online ✅</li>
//                 <li><strong>Last Backup:</strong> Today at 2:15 PM</li>
//                 <li><strong>Version:</strong> 1.0.4</li>
//               </ul>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default Dashboard;

import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import { FaUsers, FaUserFriends, FaLayerGroup } from "react-icons/fa";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

function Dashboard() {
  const [counts, setCounts] = useState({
    leads: null,
    users: null,
    teams: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const fetchCounts = async () => {
      try {
        const [leadsRes, usersRes, teamsRes] = await Promise.all([
          axios.get(`${BASE_URL}/leads/count/`, { headers }),
          axios.get(`${BASE_URL}/users/count/`, { headers }),
          axios.get(`${BASE_URL}/teams/count/`, { headers }),
        ]);

        setCounts({
          leads: leadsRes.data.count,
          users: usersRes.data.count,
          teams: teamsRes.data.count,
        });
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p>Loading dashboard...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm text-center p-4">
            <FaUsers size={50} className="mb-3 text-primary" />
            <h5>Total Leads</h5>
            <h2>{counts.leads ?? 0}</h2>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm text-center p-4">
            <FaUserFriends size={50} className="mb-3 text-success" />
            <h5>Total Users</h5>
            <h2>{counts.users ?? 0}</h2>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm text-center p-4">
            <FaLayerGroup size={50} className="mb-3 text-warning" />
            <h5>Total Teams</h5>
            <h2>{counts.teams ?? 0}</h2>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
