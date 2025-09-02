import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import { FaUsers, FaUserFriends, FaLayerGroup } from "react-icons/fa";
import axios from "axios";

const BASE_URL = "https://advanced-crm.onrender.com/api";

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
