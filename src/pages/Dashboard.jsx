// // src/pages/Dashboard.js
// import React from "react";

// function Dashboard() {
//   return (
//     <div>
//       <h1>Welcome to Dashboard</h1>
//       <p>You are successfully logged in!</p>
//     </div>
//   );
// }

// export default Dashboard;


// src/pages/Dashboard.jsx
import React from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { FaUsers, FaUserCheck, FaChartLine } from "react-icons/fa";

function Dashboard() {
  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <Card className="shadow text-white bg-primary">
            <Card.Body>
              <h2>Welcome to Your CRM Dashboard</h2>
              <p>Manage your leads, clients, and sales all in one place!</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <FaUsers size={40} className="mb-3 text-primary" />
              <h5>Total Leads</h5>
              <h3>1,254</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <FaUserCheck size={40} className="mb-3 text-success" />
              <h5>Active Clients</h5>
              <h3>875</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <FaChartLine size={40} className="mb-3 text-warning" />
              <h5>Sales This Month</h5>
              <h3>₹2,34,000</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header>Quick Actions</Card.Header>
            <Card.Body>
              <Button variant="outline-primary" className="me-2 mb-2">+ Add New Lead</Button>
              <Button variant="outline-success" className="me-2 mb-2">View All Leads</Button>
              <Button variant="outline-warning" className="mb-2">Generate Report</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header>System Status</Card.Header>
            <Card.Body>
              <ul className="list-unstyled">
                <li><strong>Server:</strong> Online ✅</li>
                <li><strong>Last Backup:</strong> Today at 2:15 PM</li>
                <li><strong>Version:</strong> 1.0.4</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
